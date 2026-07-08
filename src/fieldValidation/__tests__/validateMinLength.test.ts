import { describe, it, expect } from "vitest";
import { validateMinLength } from "../validateMinLength";
import { INPUT_VALIDATION_ERRORS } from "@copy/global";

describe("validateMinLength", () => {
  describe("valid values", () => {
    it("accepts a string exactly at the minimum length", () => {
      const validate = validateMinLength(5);
      expect(validate("hello")).toBeUndefined();
    });

    it("accepts a string longer than the minimum length", () => {
      const validate = validateMinLength(5);
      expect(validate("hello world")).toBeUndefined();
    });

    it("accepts a string that meets the minimum length after trimming", () => {
      const validate = validateMinLength(5);
      expect(validate("  hello  ")).toBeUndefined();
    });

    it("accepts any string when minLength is 0", () => {
      const validate = validateMinLength(0);
      expect(validate("")).toBeUndefined();
    });

    it("accepts undefined when minLength is 0", () => {
      const validate = validateMinLength(0);
      expect(validate(undefined)).toBeUndefined();
    });
  });

  describe("invalid values", () => {
    it("rejects a string shorter than the minimum length", () => {
      const validate = validateMinLength(5);
      expect(validate("hi")).toBe(INPUT_VALIDATION_ERRORS.MINIMUM_LENGTH(5));
    });

    it("rejects a string whose trimmed length is below the minimum", () => {
      const validate = validateMinLength(5);
      expect(validate("  hi  ")).toBe(
        INPUT_VALIDATION_ERRORS.MINIMUM_LENGTH(5),
      );
    });

    it("rejects an empty string when minLength is greater than 0", () => {
      const validate = validateMinLength(1);
      expect(validate("")).toBe(INPUT_VALIDATION_ERRORS.MINIMUM_LENGTH(1));
    });

    it("rejects a whitespace-only string when minLength is greater than 0", () => {
      const validate = validateMinLength(1);
      expect(validate("   ")).toBe(INPUT_VALIDATION_ERRORS.MINIMUM_LENGTH(1));
    });

    it("rejects undefined when minLength is greater than 0", () => {
      const validate = validateMinLength(1);
      expect(validate(undefined)).toBe(
        INPUT_VALIDATION_ERRORS.MINIMUM_LENGTH(1),
      );
    });
  });

  describe("factory behavior", () => {
    it("creates independent validators for different minLength values", () => {
      const validateShort = validateMinLength(2);
      const validateLong = validateMinLength(10);

      expect(validateShort("hi")).toBeUndefined();
      expect(validateLong("hi")).toBe(
        INPUT_VALIDATION_ERRORS.MINIMUM_LENGTH(10),
      );
    });
  });
});
