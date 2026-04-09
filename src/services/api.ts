import type { IntegrationType, ManifestPayload } from "@types";
import { apiFetch, BASE_URL } from "@utils/apiFetch";

interface Integration {
  name: string;
}

export interface DatadogIntegrationBody {
  apiKey: string;
  url: string;
}

export interface ArgoCdIntegrationBody {
  accountToken: string;
  apiUrl: string;
}

type IntegrationBody = DatadogIntegrationBody | ArgoCdIntegrationBody;

interface Connection {
  name: string;
}

const devDelay = <T>(value: T, ms = 800): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const integrations = {
  getAll: (type: IntegrationType): Promise<Integration[]> => {
    if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true") {
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
    if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true")
      return devDelay<void>(undefined);
    return apiFetch.put(`/integrations/${type}/${name}`, { body });
  },

  delete: (type: IntegrationType, name: string): Promise<void> => {
    if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true")
      return devDelay<void>(undefined);
    return apiFetch.delete(`/integrations/${type}/${name}`);
  },
};

export const connections = {
  generateManifests: (
    connectionName: string,
    body: ManifestPayload,
  ): Promise<Response> => {
    if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true") {
      return devDelay<Response>(new Response(null, { status: 200 }));
    }
    return fetch(`${BASE_URL}/connections/${connectionName}/manifests/yaml`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },
  getAll: (): Promise<Connection[]> => {
    if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true") {
      return devDelay<Connection[]>([{ name: "datadog-connection-1" }]);
    }
    return apiFetch.get("/connections");
  },

  upsert: (name: string, body: ManifestPayload): Promise<void> => {
    if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true") {
      console.log("connections.upsert args", { name, body });
      return devDelay<void>(undefined);
    }
    return apiFetch.put(`/connections/${name}`, { body });
  },

  delete: (name: string): Promise<void> => {
    if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true")
      return devDelay<void>(undefined);
    return apiFetch.delete(`/connections/${name}`);
  },
};
