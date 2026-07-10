import { describe, it, expect } from "vitest";
import { isMaskedValue, getSubmittedCollectorValue } from "../maskedValues";
import { SECRET_VALUE_MASK } from "@copy/global";

describe("isMaskedValue", () => {
  it("returns true when value matches the mask", () => {
    expect(isMaskedValue(SECRET_VALUE_MASK)).toBe(true);
  });

  it("returns false for a real value", () => {
    expect(isMaskedValue("my-secret-value")).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isMaskedValue(undefined)).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isMaskedValue("")).toBe(false);
  });

  it("returns false for a value that partially matches the mask", () => {
    expect(isMaskedValue(SECRET_VALUE_MASK.slice(0, -1))).toBe(false);
  });

  it("returns false for a value that contains the mask plus extra characters", () => {
    expect(isMaskedValue(`${SECRET_VALUE_MASK}x`)).toBe(false);
  });
});

describe("getSubmittedCollectorValue", () => {
  it("returns an empty string when value is the mask", () => {
    expect(getSubmittedCollectorValue(SECRET_VALUE_MASK)).toBe("");
  });

  it("returns the value unchanged when it is a real, non-masked string", () => {
    expect(getSubmittedCollectorValue("my-secret-value")).toBe(
      "my-secret-value",
    );
  });

  it("returns an empty string when value is undefined", () => {
    expect(getSubmittedCollectorValue(undefined)).toBe("");
  });

  it("returns an empty string when value is already an empty string", () => {
    expect(getSubmittedCollectorValue("")).toBe("");
  });
});
