import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function Header() {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, pt: 3 }}>
      <Paper
        elevation={3}
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #CFCFD4",
          background: "#E5E5E8",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box component={"img"} src="/logo.svg" alt="logo" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              MyDecisive Octant
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
