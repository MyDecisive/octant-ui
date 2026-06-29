import type { ComponentOverride } from "../types";

declare module "@mui/material/Alert" {
  interface AlertPropsVariantOverrides {
    snackbarNeutral: true;
    snackbarError: true;
  }
}

export const MuiAlert: ComponentOverride<"MuiAlert"> = {
  defaultProps: {
    variant: "filled",
  },
  styleOverrides: {
    root: {
      fontWeight: 400,
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
          color: "#D32F2F",
        },
      },
    },
    {
      props: { severity: "warning" },
      style: {
        backgroundColor: "#FFF4E5",
        color: "#663C00",
        [`& > .MuiAlert-icon`]: {
          color: "#EF6C00",
        },
      },
    },
    {
      props: { variant: "snackbarNeutral" },
      style: {
        alignItems: "center",
        backgroundColor: "#2f2f2f",
        borderRadius: 4,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.24)",
        color: "#ffffff",
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
          color: "#ffffff",
          marginLeft: "24px",
          padding: 0,
        },
        "& .MuiButtonBase-root, & .MuiSvgIcon-root": {
          color: "#ffffff",
        },
      },
    },
    {
      props: { variant: "snackbarError" },
      style: {
        alignItems: "center",
        backgroundColor: "#d32f2f",
        borderRadius: 4,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.24)",
        color: "#ffffff",
        padding: "16px 12px 16px 16px",
        "& .MuiAlert-icon": {
          color: "#ffffff",
          padding: 0,
        },
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
          color: "#ffffff",
          marginLeft: "24px",
          padding: 0,
        },
        "& .MuiButtonBase-root, & .MuiSvgIcon-root": {
          color: "#ffffff",
        },
      },
    },
  ],
};
