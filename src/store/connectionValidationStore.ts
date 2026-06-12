import { ConnectError } from "@connectrpc/connect";
import type {
  ConnectionScope,
  GetConnectionStatusResponse,
} from "@mydecisiveai/octant-client";
import { create } from "zustand";
import {
  connectionServiceClient,
  createOrGetValidatorRunId,
  createValidatorRunId,
  getLatestValidatorRunId,
  validatorRunIdToDate,
} from "../services/connection";

export type ConnectionValidationStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export const DEFAULT_CONNECTION_VALIDATION_WAIT_MS = 90_000;

export type ConnectionValidationScope = Pick<
  ConnectionScope,
  "connectionName" | "namespace"
>;

interface ValidatorRun extends ConnectionValidationScope {
  runId: string;
}

interface ValidateConnectionParams {
  scope: ConnectionValidationScope;
  waitForNewRunMs?: number;
}

interface ConnectionValidationState {
  status: ConnectionValidationStatus;
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

let inFlightValidation: Promise<GetConnectionStatusResponse | null> | null =
  null;

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
  scope: ConnectionValidationScope,
  runId: string,
) {
  return connectionServiceClient.getConnectionStatus({
    scope,
    validatorRunId: runId,
  });
}

export const useConnectionValidationStore =
  create<ConnectionValidationState>()((set) => {
    async function runValidation(
      params: ValidateConnectionParams,
      getRunId: () => Promise<{ runId: string; isNewRun: boolean }>,
    ) {
      const {
        scope,
        waitForNewRunMs = DEFAULT_CONNECTION_VALIDATION_WAIT_MS,
      } = params;

      if (inFlightValidation) {
        return inFlightValidation;
      }

      const validation = (async () => {
        set({ status: "loading", error: undefined });

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
            status: "success",
            error: undefined,
            connectionStatus: nextConnectionStatus,
            validatorRun: { ...scope, runId },
          });
          return nextConnectionStatus;
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
          set({
            status: "error",
            error: getErrorMessage(error),
          });
          return null;
        } finally {
          inFlightValidation = null;
        }
      })();

      inFlightValidation = validation;
      return validation;
    }

    return {
      status: "idle",
      connectionStatus: null,
      validatorRun: null,
      loadLatestOrCreate: (params) =>
        runValidation(params, async () => {
          const latestRunId = await getLatestValidatorRunId(params.scope);
          if (latestRunId) return { runId: latestRunId, isNewRun: false };

          return {
            runId: await createOrGetValidatorRunId(params.scope),
            isNewRun: true,
          };
        }),
      revalidate: (params) =>
        runValidation(params, async () => ({
          runId: await createValidatorRunId(params.scope),
          isNewRun: true,
        })),
    };
  });
