import type { ComponentOverride } from "../types";

export const MuiTooltip: ComponentOverride<"MuiTooltip"> = {
  styleOverrides: {
    tooltip: {
      backgroundColor: "#323232",
      padding: "8px 12px",
      "& .MuiStack-root.mui-rich-tooltip-actions-row > .MuiButton-text": {
        color: "#d500f9",
      },
      "& .mui-rich-tooltip-description.MuiTypography-root": {
        color: "#ffffffb3",
      },
    },
    arrow: {
      color: "#323232",
    },
  },
};
