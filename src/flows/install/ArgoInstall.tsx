import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { NextButton } from "@components/NextButton";
import { ViewTitle } from "@components/ViewTitle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useConnectStore } from "@store/connectStore";
import { DeployArgoCopy as copy} from "../../copy/install/ArgoInstall.copy";

export function ArgoInstall() {
  const argoAgreement = useConnectStore((state) => state.argoAgreement);
  const setFormField = useConnectStore((state) => state.setFormField);

  return (
    <FlowCenterColumn>
      <ViewTitle
        title={copy.header}
        description={copy.subheader}
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
        label={copy.checkboxTxt}
      />
      <NextButton
        ctaTxt={copy.cta}
        disabled={!argoAgreement}
      />
    </FlowCenterColumn>
  );
}
