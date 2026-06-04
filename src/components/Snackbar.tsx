import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import IconButton from "@mui/material/IconButton";
import MuiSnackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import classNames from "classnames";
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

  return (
    <MuiSnackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={handleClose}
      className="mdai-snackbar"
    >
      <SnackbarContent
        className={classNames("mdai-snackbar-content", {
          "mdai-snackbar-neutral": severity === "neutral",
          "mdai-snackbar-error": severity === "error",
        })}
        message={
          <Stack direction="row" gap={1.5} alignItems="center">
            {severity === "error" && <ErrorOutlineIcon fontSize="small" />}
            <Stack gap={0.5}>
              {title && (
                <Typography variant="body2" data-bold="true">
                  {title}
                </Typography>
              )}
              {(message || description) && (
                <Typography variant="body2">
                  {message ?? description}
                </Typography>
              )}
            </Stack>
          </Stack>
        }
        action={
          <Stack direction="row" alignItems="center" gap={2}>
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
        }
      />
    </MuiSnackbar>
  );
}
