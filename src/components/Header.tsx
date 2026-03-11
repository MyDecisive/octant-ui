import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function Header() {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, pt: 6 }}>
      <Paper
        elevation={6}
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid",
          borderColor: "rgba(255, 255, 255, 0.12)",
          background:
            "linear-gradient(180deg, #150D17 79.97%, rgba(21, 13, 23, 0) 100.2%)",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box component={"img"} src="/logo.svg" alt="logo" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              MyDecisive Octant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SmartHub setup wizard
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Chip
            label="Local cluster"
            color="primary"
            variant="outlined"
            sx={{ borderColor: "rgba(216, 0, 252, 0.6)" }}
          />
          <Chip label="v0.1" variant="outlined" />
        </Stack>
      </Paper>
    </Box>
  );
}
