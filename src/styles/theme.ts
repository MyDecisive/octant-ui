import { createTheme } from "@mui/material/styles";

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
      primary: "#1D1D21",
      secondary: "#66666F",
    },
    background: {
      default: "#CFCFD4",
      paper: "#F3F3F6",
    },
    divider: "#D0D0D6",
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
        },
      },
    },
  },
});
