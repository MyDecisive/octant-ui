import { describe, it, expect } from "vitest";
import { toFilterType } from "../toFilterType";
import { FilterType } from "@mydecisiveai/octant-client";

describe("toFilterType", () => {
  it("maps 'logs' to FilterType.LOG", () => {
    expect(toFilterType("logs")).toBe(FilterType.LOG);
  });

  it("maps 'traces' to FilterType.TRACE", () => {
    expect(toFilterType("traces")).toBe(FilterType.TRACE);
  });

  it("returns undefined for a value outside UIFilterType's known values", () => {
    expect(toFilterType("metrics" as never)).toBeUndefined();
  });
});
