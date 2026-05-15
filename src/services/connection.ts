import {
  ConnectError,
  createClient,
  createRouterTransport,
} from "@connectrpc/connect";
import {
  type ConnectionScope,
  ConnectionService,
  IntegrationType,
  MLTType,
} from "@mydecisiveai/octant-client";
import { transport } from "./transport";

const mockTransport = createRouterTransport(({ service }) => {
  service(ConnectionService, {
    getConnections: (...args) => {
      console.log("ConnectionService.getConnections", args);
      return { connectionNames: ["datadog-prod", "datadog-staging"] };
    },
    getConnection: (...args) => {
      console.log("ConnectionService.getConnection", args);
      return {
        telemetryTypes: [MLTType.MLT_TYPE_LOG, MLTType.MLT_TYPE_TRACE],
        deploymentType: 0,
        destinations: [
          { type: IntegrationType.DATADOG, integrationName: "datadog-prod" },
        ],
      };
    },
    createConnection: (...args) => {
      console.log("ConnectionService.createConnection", args);
      return {};
    },
    deleteConnection: (...args) => {
      console.log("ConnectionService.deleteConnection", args);
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

export const connectionServiceClient = createClient(
  ConnectionService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);

const IN_PROGRESS_ERROR = "another operation is already in progress";

export async function createOrGetValidatorRunId(
  scope: Pick<ConnectionScope, "connectionName" | "namespace">,
): Promise<string> {
  try {
    const { validatorRunId } =
      await connectionServiceClient.createConnectionValidatorRun({ scope });
    return validatorRunId;
  } catch (e) {
    if (
      e instanceof ConnectError &&
      e.message.toLowerCase().includes(IN_PROGRESS_ERROR)
    ) {
      const { validatorRunIds } =
        await connectionServiceClient.getConnectionValidatorRunIds({ scope });
      const [firstId] = validatorRunIds;
      if (!firstId) throw new Error("No existing validator run IDs found");
      return firstId;
    }
    throw e;
  }
}
