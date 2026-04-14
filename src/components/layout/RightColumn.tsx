import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import "./RightColumn.css";

export function RightColumn({ children }: { children: React.ReactNode }) {
  return (
    <Box className="right-column">
      <Stack gap={3} direction={"column"}>
        {children}
      </Stack>
    </Box>
  );
}
