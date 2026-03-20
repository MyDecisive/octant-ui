import { CodeSnippet } from "@components/CodeSnippet";
import { ExpandConfig } from "@components/ExpandConfig";
import Stack from "@mui/material/Stack";
import "./ConfigDrawer.css";

const DATADOG_PLACEHOLDER_YAML = `# Placeholder config for Datadog Agent
apiVersion: v1
kind: ConfigMap
metadata:
  name: datadog-agent-config
  namespace: observability
data:
  datadog.yaml: |-
    api_key: "<DATADOG_API_KEY>"
    site: "datadoghq.com"
    logs_enabled: true

    apm_config:
      enabled: true

    process_config:
      process_collection:
        enabled: true

    # Forward telemetry to your in-cluster collector endpoint.
    otlp_config:
      receiver:
        protocols:
          grpc:
            endpoint: "0.0.0.0:4317"
          http:
            endpoint: "0.0.0.0:4318"
`;

export function ConfigDrawer() {
  return (
    <Stack className="config-drawer-container" gap={1} alignItems={"stretch"}>
      <ExpandConfig
        title="Expand config view"
        content={
          // Replace with dynamic config content based on form inputs
          <CodeSnippet code={DATADOG_PLACEHOLDER_YAML} copyButton={false} />
        }
      />
    </Stack>
  );
}
