import { AsyncNextButton } from "@components/AsyncNextButton";
import { Input } from "@components/formInputs/Input";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { SetupSmarthubDialog } from "@components/SetupSmarthubDialog";
import { ViewTitle } from "@components/ViewTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  InstallStatus,
  type GetInstallStatusResponse,
} from "@mydecisiveai/octant-client";
import { useOctantConnectStore } from "@store/connectStore";
import type { FormFields } from "@types";
import { useState } from "react";
import { useFormValidation } from "../../fieldValidation/useFormValidation";
import { validateRequired } from "../../fieldValidation/validateRequired";
import { installServiceClient } from "../../services/install";

const formSpec: FormFields = {
  namespace: [validateRequired],
};

export function SetupSmarthub() {
  const { callbacks, fieldErrors } = useFormValidation(formSpec);
  const namespace = useOctantConnectStore((state) => state.form.namespace);
  const connectionName = useOctantConnectStore(
    (state) => state.form.connectionName,
  );
  const mdaiVersion = useOctantConnectStore((state) => state.form.mdaiVersion);
  const setFormField = useOctantConnectStore((state) => state.setFormField);
  const advanceInstallFlow = useOctantConnectStore(
    (state) => state.advanceInstallFlow,
  );

  const [dialogStatus, setDialogStatus] = useState<"error" | "warn">("warn");
  const [installError, setInstallError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [hasInstalled, setHasInstalled] = useState(false);

  const handleInstall = async () => {
    try {
      if (!hasInstalled) {
        await installServiceClient.installMDAIHub({
          namespace,
          connectionName,
          mdaiVersion,
        });

        setHasInstalled(true);
      }

      let latestRes: GetInstallStatusResponse | undefined = undefined;
      let latestError: GetInstallStatusResponse | undefined = undefined;

      for await (const res of installServiceClient.getInstallStatus({
        connectionName,
      })) {
        switch (res.installStatus) {
          case InstallStatus.INSTALLED:
            return true;
          case InstallStatus.TIMEOUT:
            setDialogStatus("warn");
            if (latestRes) {
              setInstallError(
                latestRes.details
                  .map(({ name, message }) => `${name}: ${message}`)
                  .join("\n"),
              );
            }

            setShowDialog(true);

            return false;
          case InstallStatus.ERROR:
            latestError = res;
            continue;
          default:
            latestRes = res;
            continue;
        }
      }

      setDialogStatus("error");
      if (latestError) {
        setInstallError(
          latestError.details
            .map(({ name, message }) => `${name}: ${message}`)
            .join("\n"),
        );
      }

      setShowDialog(true);

      return false;
    } catch (e) {
      setInstallError(e instanceof Error ? e.message : "Something went wrong");
      return false;
    }
  };

  return (
    <FlowCenterColumn isForm>
      <ViewTitle
        title="Set up and install your Smarthub"
        description="Tell us where you’d like the Smarthub to live and how you want us to preserve important data for you. When you’re ready, we'll run a quick test to make sure the hub is running smoothly in your environment."
      />
      <Stack gap={1}>
        <Typography>Namespace</Typography>
        <Input
          label="Kubernetes namespace"
          value={namespace}
          {...callbacks.namespace}
          placeholder="mdai"
          onChange={(e) => setFormField("namespace", e.target.value)}
        />
      </Stack>
      <SetupSmarthubDialog
        status={dialogStatus}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onContinue={advanceInstallFlow}
        errorInfo={installError}
      />
      <AsyncNextButton
        isSubmit
        asyncFunction={handleInstall}
        canAsync={!fieldErrors.namespace}
        loadingText={"Installing"}
      />
    </FlowCenterColumn>
  );
}
