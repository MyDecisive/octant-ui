import { describe, it, expect } from "vitest";
import { validateRequired } from "../validateRequired";
import { INPUT_VALIDATION_ERRORS } from "@copy/global";

describe("validateRequired", () => {
  describe("valid values", () => {
    it("accepts a non-empty string", () => {
      expect(validateRequired("hello")).toBeUndefined();
    });

    it("accepts a string with leading/trailing whitespace but content", () => {
      expect(validateRequired("  hello  ")).toBeUndefined();
    });

    it("accepts a non-empty array", () => {
      expect(validateRequired(["item"])).toBeUndefined();
    });

    it("accepts the number 0", () => {
      expect(validateRequired(0)).toBeUndefined();
    });

    it("accepts false", () => {
      expect(validateRequired(false)).toBeUndefined();
    });

    it("accepts a non-empty object", () => {
      expect(validateRequired({ key: "value" })).toBeUndefined();
    });

    it("accepts an empty object", () => {
      expect(validateRequired({})).toBeUndefined();
    });
  });

  describe("invalid values", () => {
    it("rejects an empty string", () => {
      expect(validateRequired("")).toBe(
        INPUT_VALIDATION_ERRORS.MINIMUM_SELECTION,
      );
    });

    it("rejects a whitespace-only string", () => {
      expect(validateRequired("   ")).toBe(
        INPUT_VALIDATION_ERRORS.MINIMUM_SELECTION,
      );
    });

    it("rejects an empty array", () => {
      expect(validateRequired([])).toBe(
        INPUT_VALIDATION_ERRORS.MINIMUM_SELECTION,
      );
    });

    it("rejects null", () => {
      expect(validateRequired(null)).toBe(
        INPUT_VALIDATION_ERRORS.MINIMUM_SELECTION,
      );
    });

    it("rejects undefined", () => {
      expect(validateRequired(undefined)).toBe(
        INPUT_VALIDATION_ERRORS.MINIMUM_SELECTION,
      );
    });
  });
});
