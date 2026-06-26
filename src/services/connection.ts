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
// TODO: move to utils
// TODO: Is this really the best/most robust way to convert a validatorRunId to a date?
const VALIDATOR_RUN_ID_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})(?:\.(\d+))?$/;

export function validatorRunIdToDate(validatorRunId: string): Date | null {
  const match = validatorRunId.match(VALIDATOR_RUN_ID_PATTERN);
  if (!match) return null;

  const [, year, month, day, hour, minute, second, fraction = ""] = match;
  const milliseconds = Number(fraction.padEnd(3, "0").slice(0, 3));
  const timestamp = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
    milliseconds,
  );

  return Number.isNaN(timestamp) ? null : new Date(timestamp);
}

function sortValidatorRunIds(left: string, right: string) {
  const leftDate = validatorRunIdToDate(left);
  const rightDate = validatorRunIdToDate(right);

  if (leftDate && rightDate) return leftDate.getTime() - rightDate.getTime();
  if (leftDate) return 1;
  if (rightDate) return -1;

  return left.localeCompare(right);
}

export async function getLatestValidatorRunId(
  scope: Pick<ConnectionScope, "connectionName" | "namespace">,
): Promise<string | undefined> {
  const { validatorRunIds } =
    await connectionServiceClient.getConnectionValidatorRunIds({ scope });

  return [...validatorRunIds].sort(sortValidatorRunIds).at(-1);
}

export async function createValidatorRunId(
  scope: Pick<ConnectionScope, "connectionName" | "namespace">,
): Promise<string> {
  const { validatorRunId } =
    await connectionServiceClient.createConnectionValidatorRun({ scope });
  return validatorRunId;
}

export async function createOrGetValidatorRunId(
  scope: Pick<ConnectionScope, "connectionName" | "namespace">,
): Promise<string> {
  try {
    return await createValidatorRunId(scope);
  } catch (e) {
    if (
      e instanceof ConnectError &&
      e.message.toLowerCase().includes(IN_PROGRESS_ERROR)
    ) {
      const latestId = await getLatestValidatorRunId(scope);
      if (!latestId) throw new Error("No existing validator run IDs found");
      return latestId;
    }
    throw e;
  }
}
