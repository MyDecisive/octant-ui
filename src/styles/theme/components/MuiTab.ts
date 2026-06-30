import type { ComponentOverride } from "../types";

export const MuiTab: ComponentOverride<"MuiTab"> = {
  styleOverrides: {
    root: {
      textTransform: "none",
      padding: "8px 16px",
      minHeight: "24px",
    },
  },
};
