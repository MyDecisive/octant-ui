import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MuiDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import "./Dialog.css";

interface DialogProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

export function Dialog({
  open,
  title,
  description,
  children,
  actions,
  icon,
  onClose,
  showCloseButton = false,
  closeOnBackdropClick = true,
}: DialogProps) {
  const handleClose = (_: unknown, reason?: string) => {
    if (!closeOnBackdropClick && reason === "backdropClick") return;
    onClose();
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          className: "mdai-dialog-paper",
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="flex-start" gap={1}>
          {icon}
          <Typography variant="body2" data-bold="true" component="span">
            {title}
          </Typography>
        </Stack>
        {showCloseButton && (
          <IconButton
            aria-label="Close dialog"
            onClick={onClose}
            size="small"
            disableRipple
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>
      {(description || children) && (
        <DialogContent className="mdai-dialog-content">
          {description && (
            <DialogContentText>{description}</DialogContentText>
          )}
          {children}
        </DialogContent>
      )}
      {actions && (
        <DialogActions className="mdai-dialog-actions">{actions}</DialogActions>
      )}
    </MuiDialog>
  );
}
