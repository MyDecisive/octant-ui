import { CodeSnippet } from "@components/CodeSnippet";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
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
  const { title, content, code, link } = FIX_CONTENT[fixType];
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
          <DialogContentText component={"div"}>
            <span
              className="fix-dialog-content-container"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {link && (
              <Link
                className="fix-dialog-content-external-link"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.text}
                <ArrowOutwardRoundedIcon />
              </Link>
            )}
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
