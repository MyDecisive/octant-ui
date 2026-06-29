import type { ThemeOptions } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

export const palette: ThemeOptions["palette"] = {
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
    main: "#E5F6FD",
    contrastText: "#014361",
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
};
