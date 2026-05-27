import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import "./CopyButton.css";

interface CopyButtonProps {
  ariaLabel?: string;
  text: string;
}

export function CopyButton({
  ariaLabel = "Copy to clipboard",
  text,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <IconButton
      onClick={() => {
        void copyToClipboard();
      }}
      size="small"
      className="copy-button"
      aria-label={ariaLabel}
      disableRipple
    >
      {isCopied ? (
        <DoneIcon fontSize="small" />
      ) : (
        <ContentCopyIcon fontSize="small" />
      )}
    </IconButton>
  );
}
