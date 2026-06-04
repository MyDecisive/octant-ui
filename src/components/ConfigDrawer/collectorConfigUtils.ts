import type { TelemetryTypes } from "@types";
import { stringify } from "yaml";
import type { OpenTelemetryCollector, Pipeline } from "./types";

function createInitialCollectorConfig(): OpenTelemetryCollector {
  return {
    apiVersion: "opentelemetry.io/v1beta1",
    kind: "OpenTelemetryCollector",
    metadata: {
      labels: {
        "mydecisive.ai/hub-name": "mdaihub-dd-logs",
      },
      name: null,
      namespace: "mdai",
    },
    spec: {
      managementState: "managed",
      image: "public.ecr.aws/decisiveai/mdai-dd-collector:0.1.0-dev1",
      imagePullPolicy: "Always",
      replicas: 1,
      resources: {
        limits: {
          memory: "256Mi",
          cpu: "200m",
        },
        requests: {
          memory: "128Mi",
          cpu: "100m",
        },
      },
      env: [],
      config: {
        receivers: {
          datadog: {
            endpoint: null,
          },
          otlp: {
            protocols: {
              grpc: {
                endpoint: "0.0.0.0:4317",
              },
              http: {
                endpoint: "0.0.0.0:4318",
                cors: {
                  allowed_origins: ["http://*", "https://*"],
                },
              },
            },
          },
        },
        extensions: {
          health_check: {
            endpoint: "0.0.0.0:13133",
          },
        },
        processors: {
          memory_limiter: {
            check_interval: "23s",
            limit_percentage: 75,
            spike_limit_percentage: 15,
          },
          batch: {
            send_batch_size: 5000,
            timeout: "10s",
          },
          datadogsemantics: {},
        },
        exporters: {
          datadog: {
            api: {
              site: null,
              key: null,
            },
          },
        },
        service: {
          telemetry: {
            resource: {
              "mdai-logstream": "collector",
            },
            metrics: {
              readers: [
                {
                  pull: {
                    exporter: {
                      prometheus: {
                        host: "0.0.0.0",
                        port: 8888,
                      },
                    },
                  },
                },
              ],
            },
          },
          extensions: ["health_check"],
          pipelines: {},
        },
      },
    },
  };
}

function createUpToDateConfigYaml(
  telemetryTypes: TelemetryTypes[],
  url: string | undefined,
  apiKey: string | undefined,
  connectionName: string | undefined,
  urlPlaceholder: string | undefined,
  apiKeyPlaceholder: string | undefined,
) {
  const configObject = createInitialCollectorConfig();
  const urlForRender = url || urlPlaceholder;
  const apiKeyForRender = apiKey || apiKeyPlaceholder;

  const newPipelines = telemetryTypes.reduce<
    Partial<Record<TelemetryTypes, Pipeline>>
  >((accum, telType) => {
    accum[telType] = {
      receivers: ["datadog"],
      processors: ["batch"],
      exporters: ["datadog"],
    };
    return accum;
  }, {});

  configObject.spec.config.service.pipelines = newPipelines;

  if (urlForRender) {
    configObject.spec.config.exporters.datadog.api.site = urlForRender;
  }

  if (apiKeyForRender) {
    configObject.spec.config.exporters.datadog.api.key = apiKey
      ? "${API_KEY}"
      : apiKeyForRender;
    configObject.spec.env = [
      {
        name: "API_KEY",
        valueFrom: {
          secretKeyRef: {
            name: "datadog-secret",
            key: "api-key",
          },
        },
      },
    ];
  }

  if (connectionName) {
    configObject.metadata.name = connectionName;
  }

  return configObject;
}

function configObjectToLinesForRender(configObject: OpenTelemetryCollector) {
  const yamlString = stringify(configObject);
  const yamlLines = yamlString.split("\n");

  return yamlLines.map((line) => {
    if (!line.trim().startsWith("-")) {
      const lineParts = line.split(":");

      if (lineParts.length > 1) {
        return [lineParts[0].trim(), line];
      }
    }

    return [undefined, line];
  });
}

export function createUpdatedConfigLines(
  telemetryTypes: TelemetryTypes[],
  url: string | undefined,
  apiKey: string | undefined,
  connectionName: string | undefined,
  urlPlaceholder?: string,
  apiKeyPlaceholder?: string,
) {
  const configObject = createUpToDateConfigYaml(
    telemetryTypes,
    url,
    apiKey,
    connectionName,
    urlPlaceholder,
    apiKeyPlaceholder,
  );
  const updatedLinesForRender = configObjectToLinesForRender(configObject);

  return updatedLinesForRender;
}

export const formKeyToConfigKeyMap = {
  telemetryTypes: "pipelines",
  url: "site",
  apiKey: "key",
  connectionName: "name",
};
