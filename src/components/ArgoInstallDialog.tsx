import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
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
    ![ROUTES.SPLASH, `${ROUTES.INSTALL}/1`].includes(location);

  const handleClose = () => {
    if (lastCompletedStep === -1) {
      setFormField("lastCompletedStep", 1);
    }
    setFormField("argoAgreement", true);
  };

  return (
    <Dialog open={showDialog} onClose={handleClose}>
      <DialogTitle>{copy.header}</DialogTitle>
      <DialogContent>
        <DialogContentText>{copy.subheader}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack direction={"column"}>
          <Typography>{copy.continueNotice}</Typography>
          <Button onClick={handleClose}>{copy.ctaAlt}</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
