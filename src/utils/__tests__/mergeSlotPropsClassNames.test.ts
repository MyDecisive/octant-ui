import { describe, it, expect } from "vitest";
import { mergeSlotPropsClassNames } from "../mergeSlotPropsClassNames";

interface SlotProps {
  className?: string;
  [key: string]: unknown;
}

interface TestSlots extends Record<string, unknown> {
  root?: SlotProps;
  input?: SlotProps;
  label?: SlotProps;
}

function merge(base: TestSlots, override?: Partial<TestSlots>) {
  return mergeSlotPropsClassNames<TestSlots>(base, override);
}

describe("mergeSlotPropsClassNames", () => {
  it("returns baseSlotProps unchanged when overrideSlotProps is undefined", () => {
    const base: TestSlots = { root: { className: "base-class" } };

    expect(merge(base)).toEqual(base);
  });

  it("returns baseSlotProps unchanged when overrideSlotProps is not provided for a given key", () => {
    const base: TestSlots = {
      root: { className: "base-root" },
      input: { className: "base-input" },
    };
    const override: Partial<TestSlots> = {
      root: { className: "override-root" },
    };

    const result = merge(base, override);

    expect(result.input).toEqual({ className: "base-input" });
  });

  it("merges className strings from base and override", () => {
    const base: TestSlots = { root: { className: "base-class" } };
    const override: Partial<TestSlots> = {
      root: { className: "override-class" },
    };

    const result = merge(base, override);

    expect(result.root?.className).toBe("base-class override-class");
  });

  it("keeps base className when override has no className", () => {
    const base: TestSlots = { root: { className: "base-class" } };
    const override: Partial<TestSlots> = { root: { "data-testid": "test" } };

    const result = merge(base, override);

    expect(result.root).toEqual({
      className: "base-class",
      "data-testid": "test",
    });
  });

  it("keeps override className when base has no className", () => {
    const base: TestSlots = { root: { "data-testid": "base-testid" } };
    const override: Partial<TestSlots> = {
      root: { className: "override-class" },
    };

    const result = merge(base, override);

    expect(result.root).toEqual({
      "data-testid": "base-testid",
      className: "override-class",
    });
  });

  it("results in an empty string className when neither base nor override has one", () => {
    const base: TestSlots = { root: { "data-testid": "base" } };
    const override: Partial<TestSlots> = { root: { "aria-label": "label" } };

    const result = merge(base, override);

    expect(result.root?.className).toBe("");
  });

  it("merges non-className props, with override taking precedence", () => {
    const base: TestSlots = {
      root: { className: "base-class", "data-testid": "base-testid" },
    };
    const override: Partial<TestSlots> = {
      root: { className: "override-class", "data-testid": "override-testid" },
    };

    const result = merge(base, override);

    expect(result.root).toEqual({
      className: "base-class override-class",
      "data-testid": "override-testid",
    });
  });

  it("preserves base props not present in override", () => {
    const base: TestSlots = {
      root: { className: "base-class", "data-testid": "base-testid" },
    };
    const override: Partial<TestSlots> = {
      root: { className: "override-class" },
    };

    const result = merge(base, override);

    expect(result.root?.["data-testid"]).toBe("base-testid");
  });

  it("adds new props from override that don't exist in base", () => {
    const base: TestSlots = { root: { className: "base-class" } };
    const override: Partial<TestSlots> = { root: { "aria-hidden": true } };

    const result = merge(base, override);

    expect(result.root).toEqual({
      className: "base-class",
      "aria-hidden": true,
    });
  });

  it("skips falsy override values and keeps base value as-is", () => {
    const base: TestSlots = { root: { className: "base-class" } };
    const override: Partial<TestSlots> = { root: undefined };

    const result = merge(base, override);

    expect(result.root).toEqual({ className: "base-class" });
  });

  it("handles multiple slot keys independently", () => {
    const base: TestSlots = {
      root: { className: "base-root" },
      input: { className: "base-input" },
      label: { className: "base-label" },
    };
    const override: Partial<TestSlots> = {
      root: { className: "override-root" },
      label: { "data-testid": "label-test" },
    };

    const result = merge(base, override);

    expect(result).toEqual({
      root: { className: "base-root override-root" },
      input: { className: "base-input" },
      label: { className: "base-label", "data-testid": "label-test" },
    });
  });

  it("handles an empty baseSlotProps object", () => {
    const base: TestSlots = {};
    const override: Partial<TestSlots> = {
      root: { className: "override-class" },
    };

    expect(merge(base, override)).toEqual({});
  });

  it("handles an empty overrideSlotProps object", () => {
    const base: TestSlots = { root: { className: "base-class" } };
    const override: Partial<TestSlots> = {};

    expect(merge(base, override)).toEqual(base);
  });
});
