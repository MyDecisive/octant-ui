import { ButtonRow } from "@components/layout/ButtonRow";
import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { NextButton } from "@components/NextButton";
import { ViewTitle } from "@components/ViewTitle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useOctantConnectStore } from "@store";

export function ArgoInstall() {
  const argoAgreement = useOctantConnectStore(
    (state) => state.form.argoAgreement,
  );
  const setFormField = useOctantConnectStore((state) => state.setFormField);

  return (
    <FlowCenterColumn>
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
            disableRipple
          />
        }
        label="I understand and consent this application to make changes to the development environment."
      />
      <ButtonRow>
        <NextButton disabled={!argoAgreement} />
      </ButtonRow>
    </FlowCenterColumn>
  );
}
