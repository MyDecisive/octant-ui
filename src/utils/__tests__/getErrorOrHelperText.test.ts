import { describe, it, expect } from "vitest";
import { getErrorOrHelperText } from "../getErrorOrHelperText";

describe("getErrorOrHelperText", () => {
  describe("when errorProp is true", () => {
    it("returns helperText regardless of validationErrors being null", () => {
      expect(getErrorOrHelperText(null, "Helper text", true)).toBe(
        "Helper text",
      );
    });

    it("returns helperText even when validationErrors is a non-empty string", () => {
      expect(
        getErrorOrHelperText("Validation error", "Helper text", true),
      ).toBe("Helper text");
    });

    it("returns helperText even when validationErrors is a non-empty array", () => {
      expect(
        getErrorOrHelperText(["Error 1", "Error 2"], "Helper text", true),
      ).toBe("Helper text");
    });

    it("returns undefined when helperText is not provided", () => {
      expect(getErrorOrHelperText(null, undefined, true)).toBeUndefined();
    });
  });

  describe("when errorProp is false or undefined, and validationErrors is falsy", () => {
    it("returns helperText when validationErrors is null", () => {
      expect(getErrorOrHelperText(null, "Helper text")).toBe("Helper text");
    });

    it("returns helperText when validationErrors is undefined", () => {
      expect(getErrorOrHelperText(undefined, "Helper text")).toBe(
        "Helper text",
      );
    });

    it("returns helperText when validationErrors is an empty string", () => {
      expect(getErrorOrHelperText("", "Helper text")).toBe("Helper text");
    });

    it("returns undefined when helperText is also not provided", () => {
      expect(getErrorOrHelperText(null, undefined, false)).toBeUndefined();
    });

    it("treats errorProp as falsy when explicitly set to false", () => {
      expect(getErrorOrHelperText(null, "Helper text", false)).toBe(
        "Helper text",
      );
    });
  });

  describe("when errorProp is false or undefined, and validationErrors is truthy", () => {
    it("returns the string directly when validationErrors is a non-empty string", () => {
      expect(getErrorOrHelperText("Field is required", "Helper text")).toBe(
        "Field is required",
      );
    });

    it("returns the first element when validationErrors is a non-empty array", () => {
      expect(
        getErrorOrHelperText(["First error", "Second error"], "Helper text"),
      ).toBe("First error");
    });

    it("prefers validationErrors over helperText when both are present", () => {
      expect(getErrorOrHelperText("Validation failed", "Helper text")).toBe(
        "Validation failed",
      );
    });

    it("returns undefined when validationErrors is an empty array", () => {
      // An empty array is truthy in JS, so this hits the validationErrors
      // branch, but `[][0]` is undefined.
      expect(getErrorOrHelperText([], "Helper text")).toBeUndefined();
    });
  });
});
