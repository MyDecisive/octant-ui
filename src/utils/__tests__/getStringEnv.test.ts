import { describe, it, expect } from "vitest";
import { getStringEnv } from "../getStringEnv";

describe("getStringEnv", () => {
  it("returns the value when it is a string", () => {
    expect(getStringEnv("hello")).toBe("hello");
  });

  it("returns an empty string when the value is an empty string", () => {
    expect(getStringEnv("")).toBe("");
  });

  it("returns undefined when the value is undefined", () => {
    expect(getStringEnv(undefined)).toBeUndefined();
  });

  it("returns undefined when the value is null", () => {
    expect(getStringEnv(null)).toBeUndefined();
  });

  it("returns undefined when the value is a number", () => {
    expect(getStringEnv(42)).toBeUndefined();
  });

  it("returns undefined when the value is a boolean", () => {
    expect(getStringEnv(true)).toBeUndefined();
  });

  it("returns undefined when the value is an array", () => {
    expect(getStringEnv(["a", "b"])).toBeUndefined();
  });

  it("returns undefined when the value is an object", () => {
    expect(getStringEnv({ key: "value" })).toBeUndefined();
  });
});
