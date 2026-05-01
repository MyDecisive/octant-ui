import classNames from "classnames";

type SlotPropsValue = { className?: string; [key: string]: unknown };

export function mergeSlotPropsClassNames<T extends Record<string, unknown>>(
  baseSlotProps: T,
  overrideSlotProps?: Partial<T>,
): T {
  if (!overrideSlotProps) return baseSlotProps;

  return Object.fromEntries(
    Object.entries(baseSlotProps).map(([key, baseValue]) => {
      const override = overrideSlotProps[key as keyof T];
      if (!override) return [key, baseValue];

      const { className: baseClassName, ...baseRest } =
        baseValue as SlotPropsValue;
      const { className: overrideClassName, ...overrideRest } =
        override as SlotPropsValue;

      return [
        key,
        {
          ...baseRest,
          ...overrideRest,
          className: classNames(baseClassName, overrideClassName),
        },
      ];
    }),
  ) as T;
}
