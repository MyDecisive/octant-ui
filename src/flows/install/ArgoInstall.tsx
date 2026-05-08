import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { NextButton } from "@components/NextButton";
import { ViewTitle } from "@components/ViewTitle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useConnectStore } from "@store/connectStore";

export function ArgoInstall() {
  const argoAgreement = useConnectStore((state) => state.form.argoAgreement);
  const setFormField = useConnectStore((state) => state.setFormField);

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
      <NextButton disabled={!argoAgreement} />
    </FlowCenterColumn>
  );
}
