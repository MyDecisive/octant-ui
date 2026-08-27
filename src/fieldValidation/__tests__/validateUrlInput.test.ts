import { describe, it, expect } from "vitest";
import { validateUrlInput } from "../validateUrlInput";
import { INPUT_VALIDATION_ERRORS } from "@copy/global";

describe("validateUrlInput", () => {
  describe("valid URLs", () => {
    it("accepts a full http URL", () => {
      expect(validateUrlInput("http://www.abc.com")).toBeUndefined();
    });

    it("accepts a full https URL", () => {
      expect(validateUrlInput("https://www.abc.com")).toBeUndefined();
    });

    it("accepts a bare domain without protocol", () => {
      expect(validateUrlInput("www.abc.com")).toBeUndefined();
    });

    it("accepts a bare domain without www", () => {
      expect(validateUrlInput("abc.com")).toBeUndefined();
    });

    it("accepts localhost without protocol", () => {
      expect(validateUrlInput("localhost")).toBeUndefined();
    });

    it("accepts localhost with a port", () => {
      expect(validateUrlInput("localhost:8080")).toBeUndefined();
    });

    it("accepts localhost with protocol and port", () => {
      expect(validateUrlInput("http://localhost:8080")).toBeUndefined();
    });

    it("accepts a domain with a subdomain", () => {
      expect(validateUrlInput("api.example.com")).toBeUndefined();
    });

    it("accepts a domain with a path", () => {
      expect(validateUrlInput("http://www.abc.com/some/path")).toBeUndefined();
    });

    it("accepts a domain with a port", () => {
      expect(validateUrlInput("www.abc.com:3000")).toBeUndefined();
    });

    it("trims leading/trailing whitespace", () => {
      expect(validateUrlInput("  http://www.abc.com  ")).toBeUndefined();
    });

    it("is case-insensitive for protocol", () => {
      expect(validateUrlInput("HTTP://www.abc.com")).toBeUndefined();
    });

    it("is case-insensitive for hostname", () => {
      expect(validateUrlInput("http://WWW.ABC.COM")).toBeUndefined();
    });
  });

  describe("invalid URLs", () => {
    it("rejects an empty string", () => {
      expect(validateUrlInput("")).toBe(INPUT_VALIDATION_ERRORS.URL);
    });

    it("rejects whitespace-only input", () => {
      expect(validateUrlInput("   ")).toBe(INPUT_VALIDATION_ERRORS.URL);
    });

    it("rejects a non-http/https protocol", () => {
      expect(validateUrlInput("ftp://www.abc.com")).toBe(
        INPUT_VALIDATION_ERRORS.URL,
      );
    });

    it("rejects a mailto link", () => {
      expect(validateUrlInput("mailto:test@abc.com")).toBe(
        INPUT_VALIDATION_ERRORS.URL,
      );
    });

    it("rejects a single word without a TLD", () => {
      expect(validateUrlInput("abc")).toBe(INPUT_VALIDATION_ERRORS.URL);
    });

    it("rejects a string with only spaces between words", () => {
      expect(validateUrlInput("not a url")).toBe(INPUT_VALIDATION_ERRORS.URL);
    });

    it("rejects an IP-less malformed hostname with invalid characters", () => {
      expect(validateUrlInput("http://abc_def.com")).toBe(
        INPUT_VALIDATION_ERRORS.URL,
      );
    });

    it("rejects a hostname with a leading hyphen in a label", () => {
      expect(validateUrlInput("http://-abc.com")).toBe(
        INPUT_VALIDATION_ERRORS.URL,
      );
    });

    it("rejects a hostname with a trailing hyphen in a label", () => {
      expect(validateUrlInput("http://abc-.com")).toBe(
        INPUT_VALIDATION_ERRORS.URL,
      );
    });

    it("rejects a TLD that is a single character", () => {
      expect(validateUrlInput("http://abc.c")).toBe(
        INPUT_VALIDATION_ERRORS.URL,
      );
    });

    it("rejects malformed URLs that throw during construction", () => {
      expect(validateUrlInput("http://")).toBe(INPUT_VALIDATION_ERRORS.URL);
    });

    it("rejects a value with only a protocol separator", () => {
      expect(validateUrlInput("://")).toBe(INPUT_VALIDATION_ERRORS.URL);
    });
  });
});
