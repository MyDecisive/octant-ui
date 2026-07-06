import { COLORS, FONT_WEIGHTS } from "../constants";
import type { ComponentOverride } from "../types";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    secondary: true;
    nav: true;
  }
}

export const MuiButton: ComponentOverride<"MuiButton"> = {
  variants: [
    {
      props: { variant: "secondary" },
      style: {
        background: "#E0E0E0",
        color: "#1D1D21",
      },
    },
    {
      props: { variant: "nav" },
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        alignSelf: "stretch",
        background: "#transparent",
        color: COLORS.BLACK,
        padding: "8px 10px",
        fontSize: "14px",
        fontWeight: FONT_WEIGHTS.DEFAULT,
        lineHeight: "20px",
        textAlign: "left",
        minWidth: 0,
        borderRadius: "4px",
        "& .MuiButton-icon.MuiButton-startIcon": {
          margin: 0,
        },
      },
    },
  ],
  styleOverrides: {
    root: {
      textTransform: "none",
      "&.Mui-disabled.MuiButton-colorSuccess.MuiButton-contained": {
        backgroundColor: "rgba(46, 125, 50, 30%)",
        color: "rgba(0,0,0,38%)",
      },
    },
  },
};
