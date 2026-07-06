import { COLORS } from "../constants";
import type { ComponentOverride } from "../types";

export const MuiAccordion: ComponentOverride<"MuiAccordion"> = {
  styleOverrides: {
    root: {
      backgroundColor: COLORS.WHITE,
      border: "1px solid rgba(0,0,0,0.23)",
    },
  },
};
