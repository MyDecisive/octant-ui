import CloseIcon from "@mui/icons-material/Close";
import { Alert } from "@components/Alert";
import IconButton from "@mui/material/IconButton";
import MuiSnackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import "./Snackbar.css";

interface SnackbarProps {
  open: boolean;
  message?: string;
  title?: string;
  description?: string;
  severity?: "neutral" | "error";
  action?: ReactNode;
  onClose?: () => void;
}

export function Snackbar({
  open,
  message,
  title,
  description,
  severity = "neutral",
  action,
  onClose,
}: SnackbarProps) {
  const handleClose = (_: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    onClose?.();
  };
  const alertVariant =
    severity === "error" ? "snackbarError" : "snackbarNeutral";

  return (
    <MuiSnackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={handleClose}
      className="mdai-snackbar"
    >
      <Alert
        className="mdai-snackbar-alert"
        variant={alertVariant}
        severity={severity === "error" ? "error" : undefined}
        icon={severity === "neutral" ? false : undefined}
        title={title}
        description={message ?? description}
        action={
          (action || onClose) && (
            <Stack
              className="mdai-snackbar-actions"
              direction="row"
              alignItems="center"
              gap={2}
            >
              {action}
              {onClose && (
                <IconButton
                  size="small"
                  aria-label="Dismiss notification"
                  onClick={onClose}
                  disableRipple
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )
        }
      />
    </MuiSnackbar>
  );
}
