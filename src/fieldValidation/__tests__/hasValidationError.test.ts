import { describe, it, expect } from "vitest";
import { hasValidationError } from "../hasValidationError";

describe("hasValidationError", () => {
  describe("returns false", () => {
    it("returns false for null", () => {
      expect(hasValidationError(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(hasValidationError(undefined)).toBe(false);
    });

    it("returns false for an empty string", () => {
      expect(hasValidationError("")).toBe(false);
    });

    it("returns false for an empty array", () => {
      expect(hasValidationError([])).toBe(false);
    });
  });

  describe("returns true", () => {
    it("returns true for a non-empty string", () => {
      expect(hasValidationError("Error message")).toBe(true);
    });

    it("returns true for an array with one error", () => {
      expect(hasValidationError(["Error message"])).toBe(true);
    });

    it("returns true for an array with multiple errors", () => {
      expect(hasValidationError(["Error 1", "Error 2"])).toBe(true);
    });

    it("returns true for a single whitespace character string", () => {
      expect(hasValidationError(" ")).toBe(true);
    });
  });
});
