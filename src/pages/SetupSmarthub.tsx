import { AsyncButton } from "@components/AsyncButton";
import { Input } from "@components/formInputs/Input";
import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import {
  SetupSmarthubDialog,
  type DialogErrorInfo,
} from "@components/SetupSmarthubDialog";
import { ViewTitle } from "@components/ViewTitle";
import { ConnectError } from "@connectrpc/connect";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { InstallStatus } from "@mydecisiveai/octant-client";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { useOctantStore } from "@store/octantStore";
import type { FormFields } from "@types";
import { useAdvanceInstallAndConnect } from "@utils/useAdvanceInstallAndConnect";
import { useState } from "react";
import { ERROR_MODAL_ACT, ERROR_SEVERITY } from "../constants/error";
import { SmarthubCopy as copy } from "../copy/install/SetupSmarthub.copy";
import { useFormValidation } from "../fieldValidation/useFormValidation";
import { validateRequired } from "../fieldValidation/validateRequired";
import { installServiceClient } from "../services/install";

const formSpec: FormFields = {
  namespace: [validateRequired],
};

export function SetupSmarthub() {
  const advanceInstallFlow = useAdvanceInstallAndConnect();
  const { callbacks, fieldErrors } = useFormValidation(formSpec);
  const connectionName = useInstallAndConnectStore(
    (state) => state.connectionName,
  );
  const mdaiVersion = useInstallAndConnectStore((state) => state.mdaiVersion);
  const setFormField = useInstallAndConnectStore((state) => state.setFormField);
  const setOctantState = useOctantStore((state) => state.setState);
  const setOctantConnectionScope = useOctantStore(
    (state) => state.setInConnectionScope,
  );

  const [namespace, setNamespace] = useState<string>("mdai");

  const [installError, setInstallError] = useState<DialogErrorInfo | null>(
    null,
  );
  const [showDialog, setShowDialog] = useState(false);
  const [hasInstalled, setHasInstalled] = useState(false);

  const handleInstall = async () => {
    if (!hasInstalled) {
      try {
        await installServiceClient.installMDAIHub({
          namespace,
          connectionName,
          mdaiVersion,
        });

        setHasInstalled(true);
      } catch (e) {
        setInstallError({
          ...copy.installErrorModal,
          networkErrorInfo: e instanceof ConnectError ? e.message : String(e),
        });
        setShowDialog(true);
        return false;
      }
    }
    try {
      for await (const res of installServiceClient.getInstallStatus({
        connectionName,
      })) {
        switch (res.installStatus) {
          case InstallStatus.INSTALLED:
            setOctantState("hubInstalled", true);
            setOctantConnectionScope("namespace", namespace);
            setFormField("namespace", namespace);
            return true;
          case InstallStatus.TIMEOUT:
            setInstallError(copy.installStatusTimeoutModal);

            setShowDialog(true);

            return false;
          case InstallStatus.ERROR:
          default:
            continue;
        }
      }

      setInstallError(copy.installStatusErrorModal);

      setShowDialog(true);

      return false;
    } catch (e) {
      setInstallError({
        header: copy.genericFormErrorTxt,
        severity: ERROR_SEVERITY.ERROR,
        body:
          e instanceof Error || e instanceof ConnectError
            ? e.message
            : String(e),
        actions: [
          {
            text: "Close",
            act: [ERROR_MODAL_ACT.CLOSE],
          },
        ],
      });
      return false;
    }
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
          onChange={(e) => setNamespace(e.target.value)}
          helperText={copy.k8sNsInput.helperText}
        />
      </Stack>
      <SetupSmarthubDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        errorInfo={installError}
      />
      <ButtonRow>
        <AsyncButton
          isSubmit
          asyncFunction={handleInstall}
          canAsync={!fieldErrors.namespace}
          loadingText={copy.loadingTxt}
          text={copy.cta.initial}
          onSuccess={advanceInstallFlow}
        />
        <Typography variant="chipLabel">{copy.infoTxt}</Typography>
      </ButtonRow>
    </FlowCenterColumn>
  );
}
