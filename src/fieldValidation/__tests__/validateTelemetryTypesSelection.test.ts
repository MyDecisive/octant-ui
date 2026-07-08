import { describe, it, expect } from "vitest";
import { validateTelemetryTypesSelection } from "../validateTelemetryTypesSelection";
import { INPUT_VALIDATION_ERRORS } from "@copy/global";

describe("validateTelemetryTypesSelection", () => {
  describe("valid selections", () => {
    it("accepts a selection containing only logs", () => {
      expect(validateTelemetryTypesSelection(["logs"])).toBeUndefined();
    });

    it("accepts a selection containing only traces", () => {
      expect(validateTelemetryTypesSelection(["traces"])).toBeUndefined();
    });

    it("accepts a selection containing logs and traces", () => {
      expect(
        validateTelemetryTypesSelection(["logs", "traces"]),
      ).toBeUndefined();
    });

    it("accepts a selection containing logs and metrics", () => {
      expect(
        validateTelemetryTypesSelection(["logs", "metrics"]),
      ).toBeUndefined();
    });

    it("accepts a selection containing traces and metrics", () => {
      expect(
        validateTelemetryTypesSelection(["traces", "metrics"]),
      ).toBeUndefined();
    });

    it("accepts a selection containing all telemetry types", () => {
      expect(
        validateTelemetryTypesSelection(["logs", "traces", "metrics"]),
      ).toBeUndefined();
    });
  });

  describe("invalid selections", () => {
    it("rejects an empty selection", () => {
      expect(validateTelemetryTypesSelection([])).toBe(
        INPUT_VALIDATION_ERRORS.TELEMETRY_TYPES,
      );
    });

    it("rejects a selection containing only metrics", () => {
      expect(validateTelemetryTypesSelection(["metrics"])).toBe(
        INPUT_VALIDATION_ERRORS.TELEMETRY_TYPES,
      );
    });
  });
});
