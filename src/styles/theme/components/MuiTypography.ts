import { FONT_WEIGHTS } from "../constants";
import type { ComponentOverride } from "../types";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    chipLabel: true;
    metric: true;
  }
  interface TypographyOwnProps {
    "data-bold"?: "true";
  }
}

export const MuiTypography: ComponentOverride<"MuiTypography"> = {
  variants: [
    {
      props: { variant: "chipLabel" },
      style: {
        fontSize: "13px",
        fontWeight: FONT_WEIGHTS.SLIGHTLY_BOLD,
        lineHeight: "18px",
        letterSpacing: "0.16px",
      },
    },
    {
      props: { variant: "metric" },
      style: {
        fontSize: "36px",
        fontWeight: FONT_WEIGHTS.SLIGHTLY_BOLD,
        lineHeight: "56px",
        letterSpacing: "-0.5px",
      },
    },
    {
      props: { "data-bold": "true" },
      style: {
        fontWeight: FONT_WEIGHTS.BOLD,
      },
    },
  ],
};
