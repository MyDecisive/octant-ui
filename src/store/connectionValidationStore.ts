import type { UIConnectionScope } from "@app-types/contracts";
import type { AsyncStatus } from "@app-types/enums";
import { ConnectError } from "@connectrpc/connect";
import { ASYNC_STATUS } from "@constants/enums";
import type { GetConnectionStatusResponse } from "@mydecisiveai/octant-client";
import { createInFlightRequestCache } from "@utils/createInFlightRequestCache";
import { create } from "zustand";
import {
  connectionServiceClient,
  connectionValidationWaitMs,
  createOrGetValidatorRunId,
  createValidatorRunId,
  getLatestValidatorRunId,
  validatorRunIdToDate,
} from "../services/connection";

// TODO: Move to constants
export const DEFAULT_CONNECTION_VALIDATION_WAIT_MS = connectionValidationWaitMs;

interface ValidatorRun extends UIConnectionScope {
  runId: string;
}

interface ValidateConnectionParams {
  scope: UIConnectionScope;
  waitForNewRunMs?: number;
}

type ValidationOperation = "loadLatestOrCreate" | "revalidate";

interface ConnectionValidationState {
  status: AsyncStatus;
  error?: string;
  connectionStatus: GetConnectionStatusResponse | null;
  validatorRun: ValidatorRun | null;
  loadLatestOrCreate: (
    params: ValidateConnectionParams,
  ) => Promise<GetConnectionStatusResponse | null>;
  revalidate: (
    params: ValidateConnectionParams,
  ) => Promise<GetConnectionStatusResponse | null>;
}

const validations =
  createInFlightRequestCache<GetConnectionStatusResponse | null>();

function getErrorMessage(error: unknown) {
  if (error instanceof Error || error instanceof ConnectError) {
    return error.message;
  }

  return "Something went wrong while checking connection status";
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validatorRunIdToTimestamp(validatorRunId: string) {
  return validatorRunIdToDate(validatorRunId)?.toISOString();
}

async function getConnectionStatusForRun(
  scope: UIConnectionScope,
  runId: string,
) {
  return connectionServiceClient.getConnectionStatus({
    scope,
    validatorRunId: runId,
  });
}

function getValidationRequestKey(
  operation: ValidationOperation,
  scope: UIConnectionScope,
) {
  return [operation, scope.connectionName ?? "", scope.namespace ?? ""].join(
    ":",
  );
}

export const useConnectionValidationStore = create<ConnectionValidationState>()(
  (set) => {
    async function runValidation(
      operation: ValidationOperation,
      params: ValidateConnectionParams,
      getRunId: () => Promise<{ runId: string; isNewRun: boolean }>,
    ) {
      const { scope, waitForNewRunMs = DEFAULT_CONNECTION_VALIDATION_WAIT_MS } =
        params;
      const requestKey = getValidationRequestKey(operation, scope);

      return validations.run(requestKey, async () => {
        set({ status: ASYNC_STATUS.LOADING, error: undefined });

        try {
          const { runId, isNewRun } = await getRunId();
          set({ validatorRun: { ...scope, runId } });

          if (isNewRun) {
            await wait(waitForNewRunMs);
          }

          const nextConnectionStatus = await getConnectionStatusForRun(
            scope,
            runId,
          );

          set({
            status: ASYNC_STATUS.SUCCESS,
            error: undefined,
            connectionStatus: nextConnectionStatus,
            validatorRun: { ...scope, runId },
          });
          return nextConnectionStatus;
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
          set({
            status: ASYNC_STATUS.ERROR,
            error: getErrorMessage(error),
          });
          return null;
        }
      });
    }

    return {
      status: ASYNC_STATUS.IDLE,
      connectionStatus: null,
      validatorRun: null,
      loadLatestOrCreate: (params) =>
        runValidation("loadLatestOrCreate", params, async () => {
          const latestRunId = await getLatestValidatorRunId(params.scope);
          if (latestRunId) return { runId: latestRunId, isNewRun: false };

          return {
            runId: await createOrGetValidatorRunId(params.scope),
            isNewRun: true,
          };
        }),
      revalidate: (params) =>
        runValidation("revalidate", params, async () => ({
          runId: await createValidatorRunId(params.scope),
          isNewRun: true,
        })),
    };
  },
);

export function selectConnectionValidationView({
  connectionStatus,
  error,
  loadLatestOrCreate,
  revalidate,
  status,
  validatorRun,
}: ConnectionValidationState) {
  return {
    connectionStatus,
    error,
    loadLatestOrCreate,
    loading: status === ASYNC_STATUS.LOADING,
    revalidate,
    validatorRunId: validatorRun?.runId,
    timestamp: validatorRun
      ? validatorRunIdToTimestamp(validatorRun.runId)
      : undefined,
  };
}
