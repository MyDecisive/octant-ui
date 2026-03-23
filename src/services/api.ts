import type { ConnectionPayload, IntegrationType } from "@types";
import { apiFetch } from "@utils/apiFetch";

interface Integration {
  name: string;
}

export interface DatadogIntegrationBody {
  apiKey: string;
  url: string;
}

export interface ArgoCdIntegrationBody {
  accountToken: string;
}

type IntegrationBody = DatadogIntegrationBody | ArgoCdIntegrationBody;

interface Connection {
  name: string;
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

  upsert: (name: string, body: ConnectionPayload): Promise<void> => {
    if (import.meta.env.DEV) return devDelay<void>(undefined);
    return apiFetch.put(`/connections/${name}`, { body });
  },

  delete: (name: string): Promise<void> => {
    if (import.meta.env.DEV) return devDelay<void>(undefined);
    return apiFetch.delete(`/connections/${name}`);
  },
};
