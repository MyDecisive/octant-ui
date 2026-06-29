import type { ComponentOverride } from "../types";

export const MuiChip: ComponentOverride<"MuiChip"> = {
  styleOverrides: {
    root: {
      variants: [
        {
          props: { color: "success" },
          style: {
            backgroundColor: "#C8E6C9",
            color: "#1E4620",
          },
        },
        {
          props: { color: "error" },
          style: {
            backgroundColor: "#FDEDED",
            color: "#5F2120",
          },
        },
      ],
    },
  },
};
