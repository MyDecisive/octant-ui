import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./ErrorDialog.css";

export function ErrorDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <DialogTitle id="error-dialog-title">
        <ErrorOutlineRoundedIcon color="error" />
        Install failed
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="error-dialog-description">
          {`Unknown issue. Check our <troubleshooting guide [insert docs link]> for support. When you’re ready, come back and try installing again.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          I'm back and ready to retry install
        </Button>
      </DialogActions>
    </Dialog>
  );
}
