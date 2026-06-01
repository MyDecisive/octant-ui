import { ConnectError, createClient } from "@connectrpc/connect";
import {
  type ConnectionScope,
  ConnectionService,
} from "@mydecisiveai/octant-client";
import { mockTransport } from "./mockData/connection.mock";
import { transport } from "./transport";

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
