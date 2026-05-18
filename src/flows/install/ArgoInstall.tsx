import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { NextButton } from "@components/NextButton";
import { ViewTitle } from "@components/ViewTitle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useConnectStore } from "@store/connectStore";
import DeployArgoCopy from "../../copy/ArgoInstall.copy";

export function ArgoInstall() {
  const argoAgreement = useConnectStore((state) => state.form.argoAgreement);
  const setFormField = useConnectStore((state) => state.setFormField);

  return (
    <FlowCenterColumn>
      <ViewTitle
        title={DeployArgoCopy.header}
        description={DeployArgoCopy.subheader}
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
        label={DeployArgoCopy.checkboxTxt}
      />
      <NextButton
        ctaTxt={DeployArgoCopy.cta}
        disabled={!argoAgreement}
      />
    </FlowCenterColumn>
  );
}
