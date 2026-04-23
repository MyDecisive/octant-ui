import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import "./FlowLayout.css";

export function FlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box className="meta-container">
      <Paper className="layout-container">
        <Box className="column-container">{children}</Box>
      </Paper>
    </Box>
  );
}
