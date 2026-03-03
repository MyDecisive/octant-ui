import { apiFetch } from "../utils/apiFetch";

type IntegrationType = "datadog" | "otlphttp" | "otlpgrpc";

interface Integration {
  name: string;
  type: IntegrationType;
}

interface DatadogIntegrationBody {
  apiKey: string;
  ddUrl: string;
}

interface OtlpIntegrationBody {
  url: string;
}

type IntegrationBody = DatadogIntegrationBody | OtlpIntegrationBody;

interface Connection {
  name: string;
}

interface ConnectionReceiver {
  type: IntegrationType;
  dataTypes: string[];
}

interface ConnectionExportIntegration {
  type: IntegrationType;
  name: string;
}

interface ConnectionExport {
  type: IntegrationType;
  integrations: ConnectionExportIntegration[];
}

interface ConnectionDeployment {
  type: string;
  data: Record<string, string>;
}

interface ConnectionBody {
  receives: ConnectionReceiver[];
  exports: ConnectionExport[];
  deployment: ConnectionDeployment;
}

export const integrations = {
  getAll: (): Promise<Integration[]> => apiFetch.get("/integrations"),

  upsert: (
    type: IntegrationType,
    name: string,
    body: IntegrationBody,
  ): Promise<void> => apiFetch.put(`/integrations/${type}/${name}`, { body }),

  delete: (type: IntegrationType, name: string): Promise<void> =>
    apiFetch.delete(`/integrations/${type}/${name}`),
};

export const connections = {
  getAll: (): Promise<Connection[]> => apiFetch.get("/connections"),

  upsert: (name: string, body: ConnectionBody): Promise<void> =>
    apiFetch.put(`/connections/${name}`, { body }),

  delete: (name: string): Promise<void> =>
    apiFetch.delete(`/connections/${name}`),
};
