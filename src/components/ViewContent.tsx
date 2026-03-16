import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { JSX } from "react";

interface ViewContentProps {
  buttonText?: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
  formContent: JSX.Element;
  sidebarContent?: JSX.Element;
}

export function ViewContent({
  buttonText = "Next",
  onButtonClick,
  buttonDisabled,
  formContent,
  sidebarContent,
}: ViewContentProps) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "466px auto", gap: 3 }}>
      <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
        {formContent}
        <Button
          variant="contained"
          size="small"
          type={"button"}
          onClick={onButtonClick}
          sx={{ alignSelf: "flex-start", textTransform: "none" }}
          disabled={buttonDisabled}
        >
          {buttonText}
        </Button>
      </Box>
      {sidebarContent && (
        <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
          {sidebarContent}
        </Box>
      )}
    </Box>
  );
}
