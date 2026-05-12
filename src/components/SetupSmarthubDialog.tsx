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
      text: "Install failed",
    },
    content: `Unknown issue. Check our <troubleshooting guide [insert docs link]> for support. When you’re ready, come back and try installing again.`,
    createActions: (onClose: () => void) => (
      <>
        <Button onClick={onClose} variant="text">
          I'm back and ready to retry install
        </Button>
      </>
    ),
  },
  warn: {
    title: {
      icon: <WarningAmberIcon color="warning" />,
      text: "Still waiting",
    },
    content: `We're still not sure whether or not things are running correctly. What would you like to do?`,
    createActions: (onClose: () => void, onContinue?: () => void) => (
      <>
        <Button onClick={onClose} variant="text">
          Keep waiting
        </Button>
        <Button onClick={onContinue} variant="contained">
          It's ok, let's keep going
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
