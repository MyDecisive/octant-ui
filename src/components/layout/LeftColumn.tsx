import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import "./LeftColumn.css";

export function LeftColumn({ children }: { children: React.ReactNode }) {
  return (
    <Box className="left-column">
      <Stack gap={3} direction={"column"}>
        {children}
      </Stack>
    </Box>
  );
}
