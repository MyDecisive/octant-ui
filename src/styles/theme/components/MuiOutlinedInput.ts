import { palette } from "../palette";
import type { ComponentOverride } from "../types";

export const MuiOutlinedInput: ComponentOverride<"MuiOutlinedInput"> = {
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
        borderColor: palette.primary.main,
      },
    },
  },
};
