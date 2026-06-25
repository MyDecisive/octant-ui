import { Dialog } from "@components/Dialog";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useInstallAndConnectStore } from "@store/installAndConnectStore";
import { useLocation } from "wouter";
import { ROUTES } from "../constants/routing";
import { DeployArgoCopy as copy } from "../copy/install/ArgoInstall.copy";

export function ArgoInstallDialog() {
  const [location] = useLocation();
  const argoAgreement = useInstallAndConnectStore(
    (state) => state.argoAgreement,
  );
  const setFormField = useInstallAndConnectStore((state) => state.setFormField);
  const lastCompletedStep = useInstallAndConnectStore(
    (state) => state.lastCompletedStep,
  );

  const showDialog =
    !argoAgreement &&
    ![ROUTES.SPLASH, ROUTES.INSTALL, `${ROUTES.INSTALL}/1`].includes(location);

  const handleClose = () => {
    if (lastCompletedStep === -1 || !lastCompletedStep) {
      setFormField("lastCompletedStep", 1);
    }
    setFormField("argoAgreement", true);
  };

  return (
    <Dialog
      open={showDialog}
      onClose={handleClose}
      title={copy.header}
      description={copy.subheader}
      actions={
        <Stack direction={"column"} alignItems={"flex-end"}>
          <Typography>{copy.continueNotice}</Typography>
          <Button onClick={handleClose}>{copy.ctaAlt}</Button>
        </Stack>
      }
    />
  );
}
