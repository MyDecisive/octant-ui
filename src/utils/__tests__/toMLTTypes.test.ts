import { describe, it, expect } from "vitest";
import { toMLTTypes } from "../toMLTTypes";
import { MLTType } from "@mydecisiveai/octant-client/dist/octant/v1alpha/type_pb";

describe("toMLTTypes", () => {
  it("maps 'metrics' to MLT_TYPE_METRIC", () => {
    expect(toMLTTypes(["metrics"])).toEqual([MLTType.MLT_TYPE_METRIC]);
  });

  it("maps 'traces' to MLT_TYPE_TRACE", () => {
    expect(toMLTTypes(["traces"])).toEqual([MLTType.MLT_TYPE_TRACE]);
  });

  it("maps 'logs' to MLT_TYPE_LOG", () => {
    expect(toMLTTypes(["logs"])).toEqual([MLTType.MLT_TYPE_LOG]);
  });

  it("maps multiple telemetry types in order", () => {
    expect(toMLTTypes(["logs", "metrics", "traces"])).toEqual([
      MLTType.MLT_TYPE_LOG,
      MLTType.MLT_TYPE_METRIC,
      MLTType.MLT_TYPE_TRACE,
    ]);
  });

  it("returns an empty array for an empty input", () => {
    expect(toMLTTypes([])).toEqual([]);
  });

  it("preserves duplicate entries", () => {
    expect(toMLTTypes(["logs", "logs"])).toEqual([
      MLTType.MLT_TYPE_LOG,
      MLTType.MLT_TYPE_LOG,
    ]);
  });
});
