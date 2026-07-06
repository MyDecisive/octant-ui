import CloseIcon from "@mui/icons-material/Close";
import { Alert } from "@components/Alert";
import IconButton from "@mui/material/IconButton";
import MuiSnackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import type { AlertProps } from "@app-types/components";
import type { ReactNode } from "react";
import "./Snackbar.css";

interface SnackbarProps {
  open: boolean;
  title?: string;
  description?: string;
  severity?: AlertProps["severity"];
  action?: ReactNode;
  onClose?: () => void;
}

export function Snackbar({
  open,
  title,
  description,
  severity,
  action,
  onClose,
}: SnackbarProps) {
  const handleClose = (_: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    onClose?.();
  };

  return (
    <MuiSnackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={handleClose}
      className="mdai-snackbar"
    >
      <Alert
        className="mdai-snackbar-alert"
        variant={"snackbar"}
        severity={severity}
        icon={severity === "neutral" ? false : undefined}
        title={title}
        description={description}
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
