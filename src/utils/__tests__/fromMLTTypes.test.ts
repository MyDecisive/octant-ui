import { describe, it, expect } from "vitest";
import { fromMLTTypes } from "../fromMLTTypes";
import { MLTType } from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";

describe("fromMLTTypes", () => {
  it("maps 'metrics' to MLT_TYPE_METRIC", () => {
    expect(fromMLTTypes([MLTType.MLT_TYPE_METRIC])).toEqual(["metrics"]);
  });

  it("maps 'traces' to MLT_TYPE_TRACE", () => {
    expect(fromMLTTypes([MLTType.MLT_TYPE_TRACE])).toEqual(["traces"]);
  });

  it("maps 'logs' to MLT_TYPE_LOG", () => {
    expect(fromMLTTypes([MLTType.MLT_TYPE_LOG])).toEqual(["logs"]);
  });

  it("maps multiple telemetry types in order", () => {
    expect(
      fromMLTTypes([
        MLTType.MLT_TYPE_LOG,
        MLTType.MLT_TYPE_METRIC,
        MLTType.MLT_TYPE_TRACE,
      ]),
    ).toEqual(["logs", "metrics", "traces"]);
  });

  it("returns an empty array for an empty input", () => {
    expect(fromMLTTypes([])).toEqual([]);
  });

  it("preserves duplicate entries", () => {
    expect(fromMLTTypes([MLTType.MLT_TYPE_LOG, MLTType.MLT_TYPE_LOG])).toEqual([
      "logs",
      "logs",
    ]);
  });
});
