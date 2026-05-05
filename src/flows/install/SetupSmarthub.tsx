import { AsyncNextButton } from "@components/AsyncNextButton";
import { ErrorDialog } from "@components/ErrorDialog";
import { Input } from "@components/formInputs/Input";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { InstallStatus } from "@mydecisiveai/octant-client";
import { useOctantConnectStore } from "@store";
import { useState } from "react";
import { installServiceClient } from "../../services/install";

export function SetupSmarthub() {
  const namespace = useOctantConnectStore((state) => state.form.namespace);
  const connectionName = useOctantConnectStore(
    (state) => state.form.connectionName,
  );
  const mdaiVersion = useOctantConnectStore((state) => state.form.mdaiVersion);
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  const [installError, setInstallError] = useState<string | null>(null);

  const handleInstall = async () => {
    try {
      await installServiceClient.installMDAIHub({
        namespace,
        connectionName,
        mdaiVersion,
      });

      for await (const res of installServiceClient.getInstallStatus({
        connectionName,
      })) {
        switch (res.installStatus) {
          case InstallStatus.ERROR:
            setInstallError(
              res.details?.map((detail) => detail.message).join("\n"),
            );
            return false;
          case InstallStatus.INSTALLED:
            return true;
          default:
            continue;
        }
      }

      return true;
    } catch (e) {
      setInstallError(e instanceof Error ? e.message : "Something went wrong");
      return false;
    }
  };

  return (
    <FlowCenterColumn>
      <ViewTitle
        title="Set up and install your Smarthub"
        description="Tell us where you’d like the Smarthub to live and how you want us to preserve important data for you. When you’re ready, we'll run a quick test to make sure the hub is running smoothly in your environment."
      />
      <Stack gap={1}>
        <Typography>Namespace</Typography>
        <Input
          label="Kubernetes namespace"
          value={namespace}
          placeholder="mdai"
          onChange={(e) => setFormField("namespace", e.target.value)}
        />
      </Stack>
      <ErrorDialog
        open={!!installError}
        onClose={() => setInstallError(null)}
      />
      <AsyncNextButton
        asyncFunction={handleInstall}
        canAsync={namespace.trim().length > 0}
        loadingText={"Installing"}
      />
    </FlowCenterColumn>
  );
}
