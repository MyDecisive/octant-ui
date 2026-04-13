import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import "./CenterColumn.css";

export function CenterColumn({ children }: { children: React.ReactNode }) {
  return (
    <Box className="center-column">
      <Stack gap={3} direction={"column"}>
        {children}
      </Stack>
    </Box>
  );
}
