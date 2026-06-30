import type { TypographyVariantsOptions } from "@mui/material/styles";
import { FONT_WEIGHTS } from "./constants";

export const typography: TypographyVariantsOptions = {
  fontFamily: '"Geist", sans-serif',
  h1: {
    fontSize: "4.5rem",
    fontWeight: FONT_WEIGHTS.DEFAULT,
  },
  h2: {
    fontSize: "3rem",
    fontWeight: FONT_WEIGHTS.DEFAULT,
  },
  h3: {
    fontSize: "2rem",
  },
  h4: {
    fontSize: "1.5rem",
  },
  h5: {
    fontSize: "1.25rem",
    fontWeight: FONT_WEIGHTS.SLIGHTLY_BOLD,
  },
  h6: {
    fontSize: "1rem",
    fontWeight: FONT_WEIGHTS.DEFAULT,
  },
  body1: {
    lineHeight: "160%",
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: FONT_WEIGHTS.DEFAULT,
  },
  subtitle1: {
    fontSize: "1.5rem",
    fontStyle: "normal",
    fontWeight: FONT_WEIGHTS.DEFAULT,
  },
  subtitle2: {
    fontSize: "1.25rem",
    fontStyle: "normal",
    fontWeight: FONT_WEIGHTS.DEFAULT,
  },
  overline: {},
  caption: {
    fontSize: "0.75rem",
    fontWeight: FONT_WEIGHTS.DEFAULT,
  },
};
