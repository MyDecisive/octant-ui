import { CopyButton } from "@components/CopyButton";
import Box from "@mui/material/Box";
import "./CodeSnippet.css";

interface CodeSnippetProps {
  code: string;
  copyButton?: boolean;
  maxHeight?: string;
}

export function CodeSnippet({
  code,
  copyButton = true,
  maxHeight = "100vh",
}: CodeSnippetProps) {
  return (
    <Box className="code-snippet-container" sx={{ maxHeight: maxHeight }}>
      <Box className="code-snippet-content">
        {copyButton && (
          <CopyButton text={code} ariaLabel="Copy code to clipboard" />
        )}
        <pre>
          <code>{code}</code>
        </pre>
      </Box>
    </Box>
  );
}
