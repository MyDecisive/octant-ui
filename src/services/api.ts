import type { IntegrationType } from "../types";
import { apiFetch } from "../utils/apiFetch";

interface Integration {
  name: string;
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

const devDelay = <T>(value: T, ms = 800): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const integrations = {
  getAll: (type: IntegrationType): Promise<Integration[]> => {
    if (import.meta.env.DEV) {
      return devDelay<Integration[]>([
        {
          name: "dd-one",
        },
        {
          name: "otlp-http-one",
        },
        {
          name: "otlp-grpc-one",
        },
      ]);
    }
    return apiFetch.get(`/integrations/${type}`);
  },

  upsert: (
    type: IntegrationType,
    name: string,
    body: IntegrationBody,
  ): Promise<void> => {
    if (import.meta.env.DEV) return devDelay<void>(undefined);
    return apiFetch.put(`/integrations/${type}/${name}`, { body });
  },

  delete: (type: IntegrationType, name: string): Promise<void> => {
    if (import.meta.env.DEV) return devDelay<void>(undefined);
    return apiFetch.delete(`/integrations/${type}/${name}`);
  },
};

export const connections = {
  getAll: (): Promise<Connection[]> => {
    if (import.meta.env.DEV) {
      return devDelay<Connection[]>([{ name: "datadog-connection-1" }]);
    }
    return apiFetch.get("/connections");
  },

  upsert: (name: string, body: ConnectionBody): Promise<void> => {
    if (import.meta.env.DEV) return devDelay<void>(undefined);
    return apiFetch.put(`/connections/${name}`, { body });
  },

  delete: (name: string): Promise<void> => {
    if (import.meta.env.DEV) return devDelay<void>(undefined);
    return apiFetch.delete(`/connections/${name}`);
  },
};
