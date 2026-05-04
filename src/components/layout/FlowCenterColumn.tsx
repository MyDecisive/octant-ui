import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { SubmitEvent } from "react";
import "./FlowCenterColumn.css";

export function FlowCenterColumn({
  children,
  isForm,
}: {
  children: React.ReactNode;
  isForm?: boolean;
}) {
  return (
    <Box className="center-column">
      <Stack
        gap={3}
        direction={"column"}
        component={isForm ? "form" : "div"}
        onSubmit={isForm ? (e: SubmitEvent) => e.preventDefault() : undefined}
      >
        {children}
      </Stack>
    </Box>
  );
}
