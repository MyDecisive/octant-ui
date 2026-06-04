import { Snackbar } from "@components/Snackbar";
import {
  useSettingsStore,
  type SettingsStatus,
} from "@store/settingsStore";
import type { ComponentProps } from "react";
import { useShallow } from "zustand/shallow";

type SnackbarProps = Omit<ComponentProps<typeof Snackbar>, "onClose">;

function determineSnackbarProps(
  status: SettingsStatus,
  error: string | undefined,
  loadingDismissed: boolean,
): SnackbarProps | null {
  switch (status) {
    case "loading":
      return {
        open: !loadingDismissed,
        severity: "neutral",
        title: "Applying updates ...",
        description:
          "This may take a few moments. Feel free to monitor connection status in System health.",
      };
    case "success":
      return {
        open: true,
        severity: "neutral",
        message: "New settings applied",
      };
    case "error":
      return {
        open: true,
        severity: "error",
        title: "Settings update failed",
        description: error,
      };
    case "idle":
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
