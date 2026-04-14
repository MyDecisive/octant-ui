import { Input } from "@components/formInputs/Input";
import { ButtonRow } from "@components/layout/ButtonRow";
import { CenterColumn } from "@components/layout/CenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useOctantConnectStore } from "@store";
import type { BaseFlowViewProps } from "@types";
import { useEffect, useState } from "react";

interface InstallStatus {
  status: "install" | "installing" | "error" | "installed";
  attempts: number;
  error: string | null;
}

export function SetupSmarthub({ onClickProgress }: BaseFlowViewProps) {
  const namespace = useOctantConnectStore((state) => state.form.namespace);
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  // TODO: Refine/Refactor below once API implemented
  const [installStatus, setInstallStatus] = useState<InstallStatus>({
    status: "install",
    attempts: 0,
    error: null,
  });

  useEffect(() => {
    if (installStatus.status !== "installing") {
      return;
    }

    const timer = window.setTimeout(() => {
      if (installStatus.attempts === 1) {
        setInstallStatus((currentStatus) => ({
          ...currentStatus,
          status: "error",
          error:
            "Something went wrong while trying to install Smarthub. Please review your settings and try again.",
        }));
        return;
      }
      setInstallStatus((currentStatus) => ({
        ...currentStatus,
        status: "installed",
        error: null,
      }));
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [installStatus]);

  const handleInstallClick = () => {
    if (
      installStatus.status === "installing" ||
      installStatus.status === "installed"
    ) {
      return;
    }
    setInstallStatus((currentStatus) => ({
      status: "installing",
      attempts: currentStatus.attempts + 1,
      error: null,
    }));
  };

  const installButtonText =
    installStatus.status === "installing"
      ? "Installing..."
      : installStatus.status === "error"
        ? "Retry install"
        : installStatus.status === "installed"
          ? "Installed"
          : "Install";

  return (
    <CenterColumn>
      <ViewTitle
        title="Set up and install your Smarthub"
        description="Tell us where you’d like the Smarthub live and how you want to us preserve important data for you. When you’re ready run a quick test to make sure the hub is running smoothly in your environment."
      />
      <Input
        label="Kubernetes namespace"
        title="Namespace"
        value={namespace}
        placeholder="mdai"
        onChange={(e) => setFormField("namespace", e.target.value)}
      />

      <ButtonRow>
        <Button
          className="view-content-main-column-button"
          variant={
            installStatus.status === "installed"
              ? "successDisabled"
              : "contained"
          }
          size="small"
          type={"button"}
          onClick={handleInstallClick}
          disabled={
            installStatus.status === "installing" ||
            installStatus.status === "installed"
          }
        >
          {installButtonText}
        </Button>
        <Button
          className="view-content-main-column-button"
          variant="contained"
          size="small"
          type={"button"}
          onClick={onClickProgress}
          disabled={installStatus.status !== "installed"}
        >
          Next
        </Button>
      </ButtonRow>
      {installStatus.error && (
        <Typography variant="body2" color="error">
          {installStatus.error}
        </Typography>
      )}
    </CenterColumn>
  );
}
