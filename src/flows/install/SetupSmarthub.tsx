import { AsyncButtonRow } from "@components/AsyncButtonRow";
import { Input } from "@components/formInputs/Input";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useOctantConnectStore } from "@store";
import { useRef } from "react";

export function SetupSmarthub() {
  const namespace = useOctantConnectStore((state) => state.form.namespace);
  const setFormField = useOctantConnectStore((state) => state.setFormField);
  const installAttemptRef = useRef(0);

  const handleInstall = () =>
    new Promise<void>((resolve, reject) => {
      installAttemptRef.current += 1;
      window.setTimeout(() => {
        if (installAttemptRef.current === 1) {
          reject(
            new Error(
              "Something went wrong while trying to install Smarthub. Review your settings.",
            ),
          );
          return;
        }
        resolve();
      }, 2000);
    });

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

      <AsyncButtonRow
        asyncFunction={handleInstall}
        canAsync={namespace.trim().length > 0}
        retries={1}
        asyncButtonText={{
          text: "Install",
          loading: "Installing...",
          done: "Installed",
          retry: "Retry install",
          error: "Install failed",
        }}
      />
    </FlowCenterColumn>
  );
}
