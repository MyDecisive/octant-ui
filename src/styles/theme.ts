import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    secondary: true;
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
      primary: "#1D1D21",
      secondary: "#66666F",
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
  },
  components: {
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
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#66666F",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          variants: [
            {
              props: { variant: "secondary" },
              style: {
                background: grey["300"],
                color: "text.primary",
              },
            },
          ],
        },
      },
    },
  },
});
