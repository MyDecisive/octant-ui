import { CodeSnippet } from "@components/CodeSnippet";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import type { DataFidelityDetails } from "@types";
import { FIX_CONTENT } from "./constants";
import "./SeeFixDialog.css";

interface SeeFixDialogProps {
  fixType: DataFidelityDetails;
  open: boolean;
  onClose: () => void;
}

export function SeeFixDialog({ fixType, open, onClose }: SeeFixDialogProps) {
  const { title, content, code } = FIX_CONTENT[fixType];
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fix-dialog-container"
      slotProps={{
        paper: {
          className: "fix-dialog-container",
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} gap={3}>
          <DialogContentText>
            <div
              className="fix-dialog-content-container"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </DialogContentText>
          <CodeSnippet code={code} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          gap={1}
          justifyContent="flex-end"
          alignItems={"center"}
        >
          <Button variant="text" onClick={onClose}>
            Done
          </Button>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
