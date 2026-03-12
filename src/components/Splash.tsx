import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export function Splash({ onClickProgress }: { onClickProgress: () => void }) {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, pb: 8, mt: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 3,
          border: "1px solid #e5e5e5",
          minHeight: 620,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "465px 1px 1fr" },
            gap: 3,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#D9D9D9",
              width: { xs: "none", md: "100%" },
            }}
          />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" } }}
          />
          <Box sx={{ width: "100%" }}>
            <Typography variant="h5">Setup a DataDog connection</Typography>
            <Typography variant="body2">
              This guided setup will help you accomplish the following:
              <br />
              <ul>
                <li>Connect to Datadog source and preferred destination</li>
                <li>Configure your collector with ease</li>
                <li>Ensure your data is</li>
              </ul>
            </Typography>

            <Button
              variant="contained"
              size="small"
              type={"button"}
              onClick={onClickProgress}
              sx={{ alignSelf: "flex-start", textTransform: "none" }}
            >
              I'm ready
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
