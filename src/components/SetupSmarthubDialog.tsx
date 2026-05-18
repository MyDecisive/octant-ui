import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import type { ReactNode } from "react";
import "./SetupSmarthubDialog.css";
import { SmarthubCopy as copy } from "../copy/install/SetupSmarthub.copy";

interface SetupSmarthubDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue?: () => void;
  errorInfo?: ReactNode;
  status: "error" | "warn";
}

const contentByStatus = {
  error: {
    title: {
      icon: <ErrorOutlineRoundedIcon color="error" />,
      text: copy.errModal.header,
    },
    content: copy.errModal.body,
    createActions: (onClose: () => void) => (
      <>
        <Button onClick={onClose} variant="text">
          {copy.errModal.cta}
        </Button>
      </>
    ),
  },
  warn: {
    title: {
      icon: <WarningAmberIcon color="warning" />,
      text: copy.warnModal.header,
    },
    content: copy.warnModal.body,
    createActions: (onClose: () => void, onContinue?: () => void) => (
      <>
        <Button onClick={onClose} variant="text">
          {copy.warnModal.cta1}
        </Button>
        <Button onClick={onContinue} variant="contained">
          {copy.warnModal.cta2}
        </Button>
      </>
    ),
  },
};

export function SetupSmarthubDialog({
  open,
  onClose,
  status,
  onContinue,
  errorInfo,
}: SetupSmarthubDialogProps) {
  const { title, content, createActions } = contentByStatus[status];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <DialogTitle id="error-dialog-title">
        {title.icon}
        {title.text}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="error-dialog-description">
          {content}
          {errorInfo && (
            <pre className="error-dialog-error-info-content">{errorInfo}</pre>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>{createActions(onClose, onContinue)}</DialogActions>
    </Dialog>
  );
}
