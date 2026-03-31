import { CodeSnippet } from "@components/CodeSnippet";
import { ExpandConfig } from "@components/ExpandConfig";
import Stack from "@mui/material/Stack";
import "./ConfigDrawer.css";

const DATADOG_PLACEHOLDER_YAML = `apiVersion: opentelemetry.io/v1beta1
kind: OpenTelemetryCollector
metadata:
  labels:
    mydecisive.ai/hub-name: mdaihub-dd-logs
  name: gateway
  namespace: mdai
spec:
  managementState: managed
  image: public.ecr.aws/decisiveai/mdai-dd-collector:0.1.0-dev1
  imagePullPolicy: Always
  replicas: 1
  resources:
    limits:
      memory: "256Mi"
      cpu: "200m"
    requests:
      memory: "128Mi"
      cpu: "100m"
  env:
    - name: API_KEY
      valueFrom:
        secretKeyRef:
          name: datadog-secret
          key: api-key
  config:
    receivers:
      datadog:
        endpoint: 0.0.0.0:8126

      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
          http:
            endpoint: 0.0.0.0:4318
            cors:
              allowed_origins:
                - "http://*"
                - "https://*"

    extensions:
      health_check:
        endpoint : 0.0.0.0:13133

    processors:
      memory_limiter:
        check_interval: 23s
        limit_percentage: 75
        spike_limit_percentage: 15

      batch:
        send_batch_size: 5000
        timeout: 10s

      datadogsemantics: {}

    exporters:
      debug/logs_verbose:
        verbosity: detailed
        sampling_initial: 5
        sampling_thereafter: 200

      datadog:
        api:
          site: us5.datadoghq.com
          key: \${API_KEY}

    service:
      telemetry:
        resource:
          mdai-logstream: collector
        metrics:
          readers:
            - pull:
                exporter:
                  prometheus:
                    host: "0.0.0.0"
                    port: 8888
      extensions:
        - health_check
      pipelines:
        logs:
          receivers: [ datadog ]
          processors: [ batch ]
          exporters: [ datadog ]
`;

export function ConfigDrawer() {
  return (
    <Stack className="config-drawer-container" gap={1} alignItems={"stretch"}>
      <ExpandConfig
        title="Expand config view +"
        content={
          // Replace with dynamic config content based on form inputs
          <CodeSnippet code={DATADOG_PLACEHOLDER_YAML} copyButton={false} />
        }
      />
    </Stack>
  );
}
