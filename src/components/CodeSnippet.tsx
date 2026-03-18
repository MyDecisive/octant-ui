import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import "./CodeSnippet.css";

interface CodeSnippetProps {
  code: string;
  copyButton?: boolean;
}

export default function CodeSnippet({
  code,
  copyButton = true,
}: CodeSnippetProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Box className="code-snippet-container">
      <Box className="code-snippet-content">
        <pre>
          <code>{code}</code>
        </pre>
      </Box>
      {copyButton && (
        <IconButton
          onClick={() => {
            void copyCodeToClipboard();
          }}
          size="small"
          className="code-snippet-copy-button"
          aria-label="Copy code to clipboard"
          disableRipple
        >
          {isCopied ? (
            <DoneIcon fontSize="small" />
          ) : (
            <ContentCopyIcon fontSize="small" />
          )}
        </IconButton>
      )}
    </Box>
  );
}
