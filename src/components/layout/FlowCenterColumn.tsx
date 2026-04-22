import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import "./FlowCenterColumn.css";

export function FlowCenterColumn({ children }: { children: React.ReactNode }) {
  return (
    <Box className="center-column">
      <Stack gap={3} direction={"column"}>
        {children}
      </Stack>
    </Box>
  );
}
