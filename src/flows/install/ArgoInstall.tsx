import { ButtonRow } from "@components/layout/ButtonRow";
import { CenterColumn } from "@components/layout/CenterColumn";
import { ViewTitle } from "@components/ViewTitle";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useOctantConnectStore } from "@store";
import type { BaseFlowViewProps } from "@types";

export function ArgoInstall({ onClickProgress }: BaseFlowViewProps) {
  const argoAgreement = useOctantConnectStore(
    (state) => state.form.argoAgreement,
  );
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  return (
    <CenterColumn>
      <ViewTitle
        title="Install via ArgoCD"
        description="Octant will install and create Argo apps to deploy the Smarthub and all your settings"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={argoAgreement}
            onChange={(event) =>
              setFormField("argoAgreement", event.target.checked)
            }
          />
        }
        label="I understand and consent this application to make changes to the development environment."
      />
      <ButtonRow>
        <Button
          className="view-content-main-column-button"
          variant="contained"
          size="small"
          type={"button"}
          onClick={onClickProgress}
          disabled={!argoAgreement}
        >
          Next
        </Button>
      </ButtonRow>
    </CenterColumn>
  );
}
