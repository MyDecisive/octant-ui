import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9C27B0",
      dark: "#6A1B9A",
      light: "#EDE7F6",
      contrastText: "rgba(255, 255, 255, 0.95)",
    },
    secondary: {
      main: "#D500F9",
      dark: "#E040FB",
      light: "#EA80FC",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    error: {
      main: "#F44336",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FFA726",
      dark: "#F57C00",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    info: {
      main: "#29B6F6",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    success: {
      main: "#66BB6A",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    text: {
      primary: "#FFFFFF",
    },
    background: {
      default: "#150D17",
      paper: "#1B0F1F",
    },
  },
  typography: {
    fontFamily: '"Geist", "Space Grotesk", "IBM Plex Sans", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top left, rgba(216, 0, 252, 0.2), transparent 45%), radial-gradient(circle at 20% 80%, rgba(106, 27, 154, 0.35), transparent 50%), #150D17",
        },
      },
    },
  },
});
