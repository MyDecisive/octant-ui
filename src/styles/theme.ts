import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    secondary: true;
    nav: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    chipLabel: true;
    metric: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyOwnProps {
    bold?: boolean;
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#9C27B0",
      dark: "#7B1FA2",
      light: "#F3E5F5",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#6D6D75",
      dark: "#51515A",
      light: "#E6E6EB",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#D32F2F",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#EF6C00",
      dark: "#F57C00",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    info: {
      main: "#29B6F6",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    success: {
      main: "#2E7D32",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#000000de",
      secondary: "#00000099",
    },
    background: {
      default: "#CFCFD4",
      paper: "#F3F3F6",
    },
    divider: "#D0D0D6",
    DataGrid: {
      bg: "#F3F3F6",
      pinnedBg: "#F3F3F6",
      headerBg: "#F3F3F6",
    },
  },
  typography: {
    fontFamily: '"Geist", sans-serif',
    h1: {
      fontSize: "4.5rem",
      fontWeight: 400,
    },
    h2: {
      fontSize: "3rem",
      fontWeight: 400,
    },
    h3: {
      fontSize: "2rem",
    },
    h4: {
      fontSize: "1.5rem",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body1: {
      lineHeight: "160%",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: "1.5rem",
      fontStyle: "normal",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "1.25rem",
      fontStyle: "normal",
      fontWeight: 400,
    },
    overline: {},
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.color === "success" && {
            backgroundColor: "#C8E6C9",
            color: "#1E4620",
          }),
          ...(ownerState.color === "error" && {
            backgroundColor: "#FDEDED",
            color: "#5F2120",
          }),
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#000",
          padding: "8px 12px",
          "& .MuiStack-root.mui-rich-tooltip-actions-row > .MuiButton-text": {
            color: "#d500f9",
          },
          "& .mui-rich-tooltip-description.MuiTypography-root": {
            color: "#ffffffb3",
          },
        },
        arrow: {
          color: "#000",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFF",
          border: "1px solid rgba(0,0,0,0.23)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ECECEF",
          borderRadius: 4,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#C9C9CF",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#AEAEB5",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9C27B0",
          },
        },
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: "chipLabel" },
          style: {
            fontSize: "13px",
            fontWeight: 500,
            lineHeight: "18px",
            letterSpacing: "0.16px",
          },
        },
        {
          props: { variant: "metric" },
          style: {
            fontSize: "36px",
            fontWeight: 500,
            lineHeight: "56px",
            letterSpacing: "-0.5px",
          },
        },
        {
          props: { bold: true },
          style: {
            fontWeight: 700,
          },
        },
      ],
    },
    MuiAlert: {
      defaultProps: {
        variant: "filled",
      },
      styleOverrides: {
        root: {
          fontWeight: 400,
          [`& > .MuiAlert-action > .MuiButtonBase-root`]: {
            padding: "4px 5px",
            color: "#5F2120",
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
      ],
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#66666F",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "8px 16px",
          minHeight: "24px",
        },
      },
    },
    MuiButton: {
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            alignSelf: "stretch",
            background: "#transparent",
            color: "#000",
            padding: "12px 8px",
            fontSize: "10px",
            fontWeight: 400,
            lineHeight: "10px",
            textAlign: "center",
            minWidth: 0,
            borderRadius: 0,
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
    },
  },
});
