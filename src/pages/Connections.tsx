import { TroubleshootingPage } from "@components/TroubleshootingPage";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function ConnectionsPage() {
  return (
    <TroubleshootingPage
      status={{
        label: "Status",
        lastSuccessful: "7/2/87",
        rows: [
          {
            label: "Hub Infrastructure",
            value: false,
          },
          {
            label: "Connection",
            value: true,
          },
          {
            label: "Filter",
            value: "loading",
          },
          {
            label: "Integration",
            value: "Datadog",
          },
        ],
      }}
      fixes={{
        header: (
          <Typography variant="body2" bold>
            How to fix
          </Typography>
        ),
        content: (
          <Stack gap={3}>
            <Typography component="div" variant="body2" color="secondary">
              Clients connected
              <ul style={{ margin: 0 }}>
                <li>Generic copy to go to Docs</li>
              </ul>
            </Typography>
            <Typography component="div" variant="body2" color="secondary">
              Generic copy to go to Docs
              <ul style={{ margin: 0 }}>
                <li>Receiving data</li>
              </ul>
            </Typography>
            <Typography component="div" variant="body2" color="secondary">
              Generic copy to go to Docs
              <ul style={{ margin: 0 }}>
                <li>Sending data</li>
              </ul>
            </Typography>
            <Typography component="div" variant="body2" color="secondary">
              Generic copy to go to Docs
              <ul style={{ margin: 0 }}>
                <li>Data integrity</li>
              </ul>
            </Typography>
          </Stack>
        ),
        footer: (
          <Button size="small" variant="contained" color="inherit">
            Re-validate
          </Button>
        ),
      }}
    />
  );
}
