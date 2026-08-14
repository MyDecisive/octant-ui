import { describe, it, expect } from "vitest";
import { formatTimestamp } from "../formatTimestamp";

describe("formatTimestamp", () => {
  describe("falsy input", () => {
    it("returns undefined when timestamp is undefined", () => {
      expect(formatTimestamp(undefined)).toBeUndefined();
    });

    it("returns undefined when timestamp is an empty string", () => {
      expect(formatTimestamp("")).toBeUndefined();
    });
  });

  describe("invalid input", () => {
    it("returns undefined when timestamp cannot be parsed into a valid date", () => {
      expect(formatTimestamp("not-a-real-date")).toBeUndefined();
    });
  });

  describe("formatting behavior", () => {
    it("returns a non-empty formatted string for a valid timestamp", () => {
      const result = formatTimestamp("2024-01-15T12:00:00.000Z");

      expect(typeof result).toBe("string");
      expect(result?.length).toBeGreaterThan(0);
    });

    it("includes the year from the given timestamp", () => {
      const result = formatTimestamp("2024-01-15T12:00:00.000Z");

      expect(result).toContain("2024");
    });

    it("includes a time component with a colon separator", () => {
      const result = formatTimestamp("2024-01-15T12:00:00.000Z");

      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it("returns different output for different timestamps", () => {
      const result1 = formatTimestamp("2024-01-15T12:00:00.000Z");
      const result2 = formatTimestamp("2020-06-01T08:30:00.000Z");

      expect(result1).not.toBe(result2);
      expect(result1).toContain("2024");
      expect(result2).toContain("2020");
    });

    it("returns the same output for the same timestamp across calls", () => {
      const result1 = formatTimestamp("2024-01-15T12:00:00.000Z");
      const result2 = formatTimestamp("2024-01-15T12:00:00.000Z");

      expect(result1).toBe(result2);
    });
  });
});
