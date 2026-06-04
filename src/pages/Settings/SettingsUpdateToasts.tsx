import { Snackbar } from "@components/Snackbar";
import { useSettingsStore } from "@store/settingsStore";
import { useShallow } from "zustand/shallow";

export function SettingsUpdateToasts() {
  const { dismiss, error, loadingDismissed, status } = useSettingsStore(
    useShallow(({ dismiss, error, loadingDismissed, status }) => ({
      dismiss,
      error,
      loadingDismissed,
      status,
    })),
  );

  if (status === "idle") return null;

  return (
    <>
      <Snackbar
        open={status === "loading" && !loadingDismissed}
        severity="neutral"
        title="Applying updates ..."
        description="This may take a few moments. Feel free to monitor connection status in System health."
        onClose={dismiss}
      />
      <Snackbar
        open={status === "success"}
        severity="neutral"
        message="New settings applied"
        onClose={dismiss}
      />
      <Snackbar
        open={status === "error"}
        severity="error"
        title="Settings update failed"
        description={error}
        onClose={dismiss}
      />
    </>
  );
}
