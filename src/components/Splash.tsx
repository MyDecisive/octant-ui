import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export function Splash({ onClickProgress }: { onClickProgress: () => void }) {
  return (
    <Box
      sx={{
        flex: "1 1 auto",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "465px 1fr" },
        gridTemplateRows: "1fr",
        alignItems: "stretch",
        justifyContent: "stretch",
      }}
    >
      <Box
        sx={{
          borderTopLeftRadius: "12px",
          borderBottomLeftRadius: "12px",
          backgroundColor: "#D9D9D9",
          width: { xs: "none", md: "100%" },
          height: { xs: "none", md: "100%" },
        }}
      />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          py: 12,
          px: 8,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Setup a DataDog connection
          </Typography>
          <Typography component="div" variant="body2">
            This guided setup will help you accomplish the following:
            <ul>
              <li>Connect to Datadog source and preferred destination</li>
              <li>Configure your collector with ease</li>
              <li>Ensure your data is...</li>
            </ul>
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Information you need to configure your collector
          </Typography>
          <Typography component="div" variant="body2">
            These items are required to establish and verify your connection
            <ul>
              <li>A target branch to test connection (Argo CD)</li>
              <li>API key from Datadog</li>
              <li>Destination URL (Datadog or OTLP)</li>
            </ul>
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          type={"button"}
          onClick={onClickProgress}
          sx={{
            alignSelf: "flex-start",
            marginTop: "auto",
            textTransform: "none",
          }}
        >
          I'm ready
        </Button>
      </Box>
    </Box>
  );
}
