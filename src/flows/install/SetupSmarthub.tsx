import { AsyncNextButton } from "@components/AsyncNextButton";
import { Input } from "@components/formInputs/Input";
import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { SetupSmarthubDialog } from "@components/SetupSmarthubDialog";
import { ViewTitle } from "@components/ViewTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  InstallStatus,
  type GetInstallStatusResponse,
} from "@mydecisiveai/octant-client";
import { useConnectStore } from "@store/connectStore";
import { useOctantStore } from "@store/octantStore";
import type { FormFields } from "@types";
import { useAdvanceInstallAndConnect } from "@utils/useAdvanceInstallAndConnect";
import { useState } from "react";
import { SmarthubCopy as copy } from "../../copy/install/SetupSmarthub.copy";
import { useFormValidation } from "../../fieldValidation/useFormValidation";
import { validateRequired } from "../../fieldValidation/validateRequired";
import { installServiceClient } from "../../services/install";

const formSpec: FormFields = {
  namespace: [validateRequired],
};

export function SetupSmarthub() {
  const advanceInstallFlow = useAdvanceInstallAndConnect();
  const { callbacks, fieldErrors } = useFormValidation(formSpec);
  const namespace = useConnectStore((state) => state.form.namespace);
  const connectionName = useConnectStore((state) => state.form.connectionName);
  const mdaiVersion = useConnectStore((state) => state.form.mdaiVersion);
  const setFormField = useConnectStore((state) => state.setFormField);
  const setState = useOctantStore((state) => state.setState);

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
            setState("namespace", namespace);
            return true;
          case InstallStatus.TIMEOUT:
            setDialogStatus("warn");
            if (latestRes) {
              setInstallError(
                latestRes.details
                  .filter(({ message }) => !!message)
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
            .filter(({ message }) => !!message)
            .map(({ name, message }) => `${name}: ${message}`)
            .join("\n"),
        );
      }

      setShowDialog(true);

      return false;
    } catch (e) {
      setInstallError(
        e instanceof Error ? e.message : copy.genericFormErrorTxt,
      );
      return false;
    }
  };

  const handleContinueFromDialog = () => {
    setState("namespace", namespace);
    advanceInstallFlow();
  };

  return (
    <FlowCenterColumn isForm>
      <ViewTitle title={copy.header} description={copy.subheader} />
      <Stack gap={1}>
        <Typography>{copy.nsHeader}</Typography>
        <Input
          label={copy.k8sNsInput.label}
          value={namespace}
          {...callbacks.namespace}
          placeholder={copy.k8sNsInput.placeholder}
          onChange={(e) => setFormField("namespace", e.target.value)}
          helperText={copy.k8sNsInput.helperText}
        />
      </Stack>
      <SetupSmarthubDialog
        status={dialogStatus}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onContinue={handleContinueFromDialog}
        errorInfo={installError}
      />
      <ButtonRow>
        <AsyncNextButton
          isSubmit
          asyncFunction={handleInstall}
          canAsync={!fieldErrors.namespace}
          loadingText={copy.loadingTxt}
          text={copy.cta.initial}
        />
        <Typography variant="chipLabel">{copy.infoTxt}</Typography>
      </ButtonRow>
    </FlowCenterColumn>
  );
}
