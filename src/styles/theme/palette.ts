import type {
  PaletteOptions,
  SimplePaletteColorOptions,
} from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { COLORS } from "./constants";

const primary: SimplePaletteColorOptions = {
  main: "#9C27B0",
  dark: "#7B1FA2",
  light: "#F3E5F5",
  contrastText: COLORS.WHITE,
};
const secondary: SimplePaletteColorOptions = {
  main: "#6D6D75",
  dark: "#51515A",
  light: "#E6E6EB",
  contrastText: COLORS.WHITE,
};
const error: SimplePaletteColorOptions = {
  main: "#D32F2F",
  contrastText: COLORS.WHITE,
};
const warning: SimplePaletteColorOptions = {
  main: "#EF6C00",
  dark: "#F57C00",
  contrastText: "rgba(0, 0, 0, 0.87)",
};
const info: SimplePaletteColorOptions = {
  main: "#E5F6FD",
  contrastText: "#014361",
};
const success: SimplePaletteColorOptions = {
  main: "#2E7D32",
  contrastText: COLORS.WHITE,
};

export const palette = {
  mode: "light",
  primary,
  secondary,
  error,
  warning,
  info,
  success,
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
} satisfies PaletteOptions;
