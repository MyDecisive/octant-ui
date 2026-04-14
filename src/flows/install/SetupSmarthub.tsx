import { Input } from "@components/formInputs/Input";
import { ButtonRow } from "@components/layout/ButtonRow";
import { CenterColumn } from "@components/layout/CenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Button from "@mui/material/Button";
import { useOctantConnectStore } from "@store";
import type { BaseFlowViewProps } from "@types";

export function SetupSmarthub({ onClickProgress }: BaseFlowViewProps) {
  const namespace = useOctantConnectStore((state) => state.form.namespace);
  const setFormField = useOctantConnectStore((state) => state.setFormField);

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
          variant="contained"
          size="small"
          type={"button"}
          onClick={onClickProgress}
        >
          Next
        </Button>
      </ButtonRow>
    </CenterColumn>
  );
}
