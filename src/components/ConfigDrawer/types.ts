type SecretKeyRef = {
  name: string;
  key: string;
};

type EnvVar = {
  name: string;
  valueFrom: {
    secretKeyRef: SecretKeyRef;
  };
};

type Receivers = {
  datadog?: { endpoint: string | null };
  otlp?: {
    protocols: {
      grpc?: { endpoint: string };
      http?: {
        endpoint: string;
        cors?: { allowed_origins: string[] };
      };
    };
  };
};

type Exporters = {
  "debug/logs_verbose"?: {
    verbosity: string;
    sampling_initial: number;
    sampling_thereafter: number;
  };
  datadog: {
    api: {
      site: string | null;
      key: string | null;
    };
  };
};

type Connectors = {
  "datadog/connector"?: {
    traces: { trace_buffer: number };
  };
};

export type Pipeline = {
  receivers: string[];
  processors: string[];
  exporters: string[];
};

type Config = {
  receivers: Receivers;
  extensions: {
    health_check?: { endpoint: string };
  };
  processors: Record<string, unknown>;
  connectors?: Connectors;
  exporters: Exporters;
  service: {
    telemetry: Record<string, unknown>;
    extensions: string[];
    pipelines: Partial<Record<string, Pipeline>>;
  };
};

export type OpenTelemetryCollector = {
  apiVersion: string;
  kind: "OpenTelemetryCollector";
  metadata: {
    labels: Record<string, string>;
    name: string | null;
    namespace: string;
  };
  spec: {
    managementState: string;
    image: string;
    imagePullPolicy: "Always" | "IfNotPresent" | "Never";
    replicas: number;
    resources: Record<string, unknown>;
    env: EnvVar[];
    config: Config;
  };
};
