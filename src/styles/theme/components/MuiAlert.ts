import { COLORS, FONT_WEIGHTS } from "../constants";
import { palette } from "../palette";
import type { ComponentOverride } from "../types";

declare module "@mui/material/Alert" {
  interface AlertPropsVariantOverrides {
    snackbar: true;
  }
  interface AlertPropsColorOverrides {
    neutral: true;
  }
}

export const MuiAlert: ComponentOverride<"MuiAlert"> = {
  defaultProps: {
    variant: "filled",
  },
  styleOverrides: {
    root: {
      fontWeight: FONT_WEIGHTS.DEFAULT,
      [`& > .MuiAlert-action > .MuiButtonBase-root`]: {
        padding: "4px 5px",
        color: "inherit",
      },
    },
  },
  variants: [
    {
      props: { severity: "error" },
      style: {
        backgroundColor: "#FDEDED",
        color: "#5F2120",
        [`& > .MuiAlert-icon`]: {
          color: palette.error.main,
        },
      },
    },
    {
      props: { severity: "warning" },
      style: {
        backgroundColor: "#FFF4E5",
        color: "#663C00",
        [`& > .MuiAlert-icon`]: {
          color: palette.warning.main,
        },
      },
    },
    {
      props: { variant: "snackbar" },
      style: {
        alignItems: "center",
        borderRadius: 4,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.24)",
        padding: "16px 12px 16px 16px",
        "& .MuiAlert-message": {
          flex: 1,
          minWidth: 0,
          padding: 0,
        },
        "& .MuiAlertTitle-root": {
          margin: 0,
        },
        "& .MuiAlert-action": {
          alignItems: "center",
          marginLeft: "24px",
          padding: 0,
        },
      },
    },
    {
      props: { variant: "snackbar", severity: "neutral" },
      style: {
        backgroundseverity: "#2f2f2f",
        color: COLORS.WHITE,
        "& .MuiAlert-action": {
          color: COLORS.WHITE,
        },
        "& .MuiButtonBase-root, & .MuiSvgIcon-root": {
          color: COLORS.WHITE,
        },
      },
    },
    {
      props: { variant: "snackbar", color: "error" },
      style: {
        backgroundColor: palette.error.main,
        color: palette.error.contrastText,
        "& .MuiAlert-icon": {
          color: palette.error.contrastText,
          padding: 0,
        },
        "& .MuiAlert-action": {
          color: palette.error.contrastText,
        },
        "& .MuiButtonBase-root, & .MuiSvgIcon-root": {
          color: palette.error.contrastText,
        },
      },
    },
  ],
};
