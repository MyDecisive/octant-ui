import { Snackbar } from "@components/Snackbar";
import {
  useSettingsStore,
  type SettingsStatus,
} from "@store/settingsStore";
import type { ComponentProps } from "react";
import { useShallow } from "zustand/shallow";
import { ASYNC_STATUS } from "../../constants/status";

type SnackbarProps = Omit<ComponentProps<typeof Snackbar>, "onClose">;

function determineSnackbarProps(
  status: SettingsStatus,
  error: string | undefined,
  loadingDismissed: boolean,
): SnackbarProps | null {
  switch (status) {
    case ASYNC_STATUS.LOADING:
      return {
        open: !loadingDismissed,
        severity: "neutral",
        title: "Applying updates ...",
        description:
          "This may take a few moments. Feel free to monitor connection status in System health.",
      };
    case ASYNC_STATUS.SUCCESS:
      return {
        open: true,
        severity: "neutral",
        message: "New settings applied",
      };
    case ASYNC_STATUS.ERROR:
      return {
        open: true,
        severity: "error",
        title: "Settings update failed",
        description: error,
      };
    case ASYNC_STATUS.IDLE:
      return null;
  }
}

export function SettingsUpdateToasts() {
  const { dismiss, error, loadingDismissed, status } = useSettingsStore(
    useShallow(({ dismiss, error, loadingDismissed, status }) => ({
      dismiss,
      error,
      loadingDismissed,
      status,
    })),
  );
  const snackbarProps = determineSnackbarProps(
    status,
    error,
    loadingDismissed,
  );

  if (!snackbarProps) return null;

  return <Snackbar {...snackbarProps} onClose={dismiss} />;
}
