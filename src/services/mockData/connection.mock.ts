import type { MessageInitShape } from "@bufbuild/protobuf";
import { createRouterTransport } from "@connectrpc/connect";
import {
  ConnectionDataSchema,
  ConnectionService,
  DeploymentType,
  IntegrationType,
  MLTType,
} from "@mydecisiveai/octant-client";

type MockConnectionData = MessageInitShape<typeof ConnectionDataSchema>;

const connections = new Map<string, MockConnectionData>([
  [
    "datadog-prod",
    {
      scope: {
        connectionName: "datadog-prod",
        namespace: "default",
      },
      telemetryTypes: [MLTType.MLT_TYPE_LOG, MLTType.MLT_TYPE_TRACE],
      deployment: {
        type: DeploymentType.ARGO_SIDELOAD,
        integrationName: "datadog-prod",
      },
      destinations: [
        { type: IntegrationType.DATADOG, integrationName: "datadog-prod" },
      ],
    },
  ],
  [
    "datadog-staging",
    {
      scope: {
        connectionName: "datadog-staging",
        namespace: "default",
      },
      telemetryTypes: [MLTType.MLT_TYPE_LOG],
      deployment: {
        type: DeploymentType.ARGO_SIDELOAD,
        integrationName: "datadog-staging",
      },
      destinations: [
        { type: IntegrationType.DATADOG, integrationName: "datadog-staging" },
      ],
    },
  ],
]);

export function setMockConnectionTelemetryTypes({
  connectionName,
  namespace,
  telemetryTypes,
}: {
  connectionName: string;
  namespace?: string;
  telemetryTypes: MLTType[];
}) {
  const existingConnection = connections.get(connectionName);
  const nextConnection: MockConnectionData = {
    scope: {
      connectionName,
      namespace: namespace ?? existingConnection?.scope?.namespace ?? "default",
    },
    telemetryTypes,
    deployment: existingConnection?.deployment,
    destinations: existingConnection?.destinations,
  };

  connections.set(connectionName, nextConnection);
}

export const mockTransport = createRouterTransport(({ service }) => {
  service(ConnectionService, {
    getConnections: (...args) => {
      console.log("ConnectionService.getConnections", args);
      return { connectionNames: Array.from(connections.keys()) };
    },
    getConnection: (request) => {
      console.log("ConnectionService.getConnection", request);
      const connectionData = connections.get(request.connectionName);
      return {
        connectionData,
      };
    },
    createConnection: (request) => {
      console.log("ConnectionService.createConnection", request);
      const { connectionData } = request;
      if (connectionData?.scope?.connectionName) {
        connections.set(connectionData.scope.connectionName, connectionData);
      }
      return {};
    },
    deleteConnection: (request) => {
      console.log("ConnectionService.deleteConnection", request);
      connections.delete(request.connectionName);
      return {};
    },
    getConnectionValidatorRunIds: (...args) => {
      console.log("ConnectionService.getConnectionValidatorRunIds", args);
      return { validatorRunIds: ["mock-run-id-1"] };
    },
    createConnectionValidatorRun: (...args) => {
      console.log("ConnectionService.createConnectionValidatorRun", args);
      return { validatorRunId: "mock-run-id-1" };
    },
    deleteConnectionValidator: (...args) => {
      console.log("ConnectionService.deleteConnectionValidator", args);
      return {};
    },
    getConnectionStatus: (...args) => {
      console.log("ConnectionService.getConnectionStatus", args);
      return {
        receivingData: true,
        sendingData: true,
        dataIntegrity: true,
        clientsConnected: true,
        validationResults: {
          logs: { parity: true, policy: true },
          metrics: { parity: true, policy: false },
          traces: { parity: false, policy: true },
        },
      };
    },
    generateManifests: async function* (...args) {
      console.log("ConnectionService.generateManifests", args);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockContent = new TextEncoder().encode("mock-manifest-content");
      yield {
        data: mockContent,
        total: BigInt(mockContent.byteLength),
        type: "application/zip",
      };
    },
  });
});
