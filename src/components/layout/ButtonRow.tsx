import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

export function ButtonRow({ children }: { children: ReactNode }) {
  return (
    <Stack direction={"row"} gap={2} alignItems={"flex-start"}>
      {children}
    </Stack>
  );
}
