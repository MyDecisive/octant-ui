import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { BaseFlowViewProps } from "../../types";
import "./Splash.css";

export function Splash({ onClickProgress }: BaseFlowViewProps) {
  return (
    <Box className="connect-splash-container">
      <Box className="connect-splash-left-bar" />
      <Stack className="connect-splash-content" gap={2.5}>
        <Stack spacing={1}>
          <Typography variant="h5">Setup a DataDog connection</Typography>
          <Typography component="div" variant="body2">
            This guided setup will help you accomplish the following:
            <ul>
              <li>Connect to Datadog source and preferred destination</li>
              <li>Configure your collector with ease</li>
              <li>Ensure your data is...</li>
            </ul>
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h5">
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
        </Stack>

        <Button
          className="connect-splash-button"
          variant="contained"
          size="small"
          type={"button"}
          onClick={onClickProgress}
        >
          I'm ready
        </Button>
      </Stack>
    </Box>
  );
}
