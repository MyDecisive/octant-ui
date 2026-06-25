// In-cluster replay poster. Runs as a Deployment (see e2e/replay.yaml), POSTing the
// captured fixtures to the hub ingress (mdai-envoy) over service DNS — the path a
// real Datadog agent uses — paced to a byte rate so it drives Clarity without
// flooding the collector. Errors are swallowed and shown in the heartbeat log.
//
// Trace payloads (Datadog intake protobuf, /api/v0.2/traces) are rewritten each
// send: span starts shifted to "now", trace/span ids re-randomized. Reposting fixed
// starts makes deltatocumulative reject the count connector's metric after the first
// batch (ErrOlderStart/ErrOutOfOrder), freezing the span count and so Clarity's
// trace cost. The rewrite is in-place (same-length varints, so no length prefix
// moves) and ids are remapped consistently so the trace tree survives.
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename } from "node:path";

const FORWARDER = process.env.FORWARDER_URL || "http://mdai-envoy:8126";
const RATE = Number(process.env.RATE_BYTES_PER_SEC || 1_500_000);

// --- protobuf wire helpers (stdlib only; the poster image has no deps) ---

export function readVarint(buf, pos) {
  let shift = 0n;
  let value = 0n;
  const start = pos;
  for (;;) {
    const b = buf[pos++];
    value |= BigInt(b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7n;
  }
  return { value, next: pos, len: pos - start };
}

// Overwrite `len` bytes at `pos` with `value` (varint, zero-padded to `len`), so a
// same-length rewrite never shifts later bytes. `value` must fit in 7*len bits.
export function writeVarintFixed(buf, pos, value, len) {
  let v = value;
  for (let i = 0; i < len; i++) {
    let byte = Number(v & 0x7fn);
    v >>= 7n;
    if (i < len - 1) byte |= 0x80;
    buf[pos + i] = byte;
  }
}

export function* fields(buf, start, end) {
  let pos = start;
  while (pos < end) {
    const tag = readVarint(buf, pos);
    const field = Number(tag.value >> 3n);
    const wire = Number(tag.value & 7n);
    let valStart = tag.next;
    let valEnd;
    if (wire === 0) valEnd = readVarint(buf, valStart).next;
    else if (wire === 1) valEnd = valStart + 8;
    else if (wire === 5) valEnd = valStart + 4;
    else if (wire === 2) {
      const lp = readVarint(buf, valStart);
      valStart = lp.next;
      valEnd = lp.next + Number(lp.value);
    } else throw new Error(`unsupported wire type ${wire}`);
    yield { field, wire, valStart, valEnd };
    pos = valEnd;
  }
}

// A BigInt in [1, 2^(7*len)) — fits a `len`-byte varint and is never zero.
function randomIdBytes(len) {
  let v = 0n;
  for (const b of randomBytes(len)) v = (v << 8n) | BigInt(b);
  v &= (1n << BigInt(7 * len)) - 1n;
  return v === 0n ? 1n : v;
}

// Index a Datadog AgentPayload along tracerPayloads(5) -> chunks(6) -> spans(3):
// each span's start varint (field 7) and id varints (fields 4/5/6).
export function indexTrace(buf) {
  const starts = []; // { pos, len, value }
  const ids = new Map(); // origValue(string) -> { len, positions: [] }
  let minStart = null;
  for (const tp of fields(buf, 0, buf.length)) {
    if (tp.field !== 5 || tp.wire !== 2) continue;
    for (const ch of fields(buf, tp.valStart, tp.valEnd)) {
      if (ch.field !== 6 || ch.wire !== 2) continue;
      for (const sp of fields(buf, ch.valStart, ch.valEnd)) {
        if (sp.field !== 3 || sp.wire !== 2) continue;
        for (const f of fields(buf, sp.valStart, sp.valEnd)) {
          if (f.wire !== 0) continue;
          const v = readVarint(buf, f.valStart);
          if (f.field === 7) {
            starts.push({ pos: f.valStart, len: Number(v.len), value: v.value });
            if (minStart === null || v.value < minStart) minStart = v.value;
          } else if (f.field === 4 || f.field === 5 || f.field === 6) {
            const key = v.value.toString();
            let g = ids.get(key);
            if (!g) ids.set(key, (g = { len: Number(v.len), positions: [] }));
            g.positions.push(f.valStart);
          }
        }
      }
    }
  }
  return { starts, ids, minStart: minStart ?? 0n };
}

// Monotonic nanosecond anchor: real time, but strictly increasing across calls so
// each batch's span starts are newer than the last (what deltatocumulative needs).
let lastAnchor = 0n;
function nextAnchorNs() {
  const now = BigInt(Date.now()) * 1_000_000n;
  lastAnchor = now > lastAnchor ? now : lastAnchor + 1_000_000n;
  return lastAnchor;
}

// A fresh copy with starts shifted to now and ids re-randomized; same byte length.
export function freshTrace({ original, index }) {
  const buf = Buffer.from(original);
  const shift = nextAnchorNs() - index.minStart;
  for (const s of index.starts) writeVarintFixed(buf, s.pos, s.value + shift, s.len);
  for (const g of index.ids.values()) {
    const fresh = randomIdBytes(g.len);
    for (const pos of g.positions) writeVarintFixed(buf, pos, fresh, g.len);
  }
  return buf;
}

// --- replay ---

async function runReplay() {
  const fixtures = JSON.parse(readFileSync("/app/egress-replay.json", "utf8"));
  const requests = fixtures.map((f) => {
    const url = `${FORWARDER}${f.path}`;
    const headers = {
      "Content-Type": f.contentType,
      "DD-Api-Key": "x".repeat(32),
      ...(f.contentEncoding ? { "Content-Encoding": f.contentEncoding } : {}),
    };
    const raw = Buffer.from(f.dataB64, "base64");
    // Only the protobuf trace intake carries span timestamps; logs go as captured.
    if (f.path.includes("/traces") && f.contentType.includes("protobuf")) {
      return { url, headers, trace: { original: raw, index: indexTrace(raw) } };
    }
    return { url, headers, body: raw };
  });

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const start = Date.now();
  let sent = 0;
  let posts = 0;
  let fails = 0;
  let lastLog = start;

  console.log(`replay: ${requests.length} fixtures -> ${FORWARDER} @ ~${(RATE / 1e6).toFixed(1)} MB/s`);
  for (;;) {
    for (const req of requests) {
      const body = req.trace ? freshTrace(req.trace) : req.body;
      try {
        const res = await fetch(req.url, { method: "POST", headers: req.headers, body });
        if (!res.ok) fails++;
      } catch {
        fails++;
      }
      sent += body.length;
      posts++;

      // Pace to the target byte rate: sleep off any time we are ahead of it.
      const ahead = (sent / RATE) * 1000 - (Date.now() - start);
      if (ahead > 0) await sleep(ahead);

      if (Date.now() - lastLog > 10_000) {
        const mbps = sent / ((Date.now() - start) / 1000) / 1e6;
        console.log(`replay: ${posts} posts, ${(sent / 1e6).toFixed(1)} MB, ${fails} failures, ~${mbps.toFixed(2)} MB/s`);
        lastLog = Date.now();
      }
    }
  }
}

// Run as the container entrypoint only (tests import the helpers without the loop).
// Match basename, not the full path: under a ConfigMap mount poster.mjs is a
// symlink, so import.meta.url (realpath) never equals the literal process.argv[1].
if (process.argv[1] && basename(process.argv[1]) === "poster.mjs") {
  await runReplay();
}
