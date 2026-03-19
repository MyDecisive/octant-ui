import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import type { JSX, ReactNode } from "react";
import { ViewTitle } from "./ViewTitle";

import "./ViewContent.css";

interface ViewContentProps {
  buttonText?: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
  formContent: JSX.Element;
  sidebarContent?: JSX.Element;
  title: string;
  description?: ReactNode;
}

export function ViewContent({
  buttonText = "Next",
  onButtonClick,
  buttonDisabled,
  formContent,
  title,
  description,
  sidebarContent,
}: ViewContentProps) {
  return (
    <Stack gap={3} className="view-content-container" direction={"row"}>
      <Stack gap={3} className="view-content-main-column">
        <ViewTitle title={title} description={description} />
        {formContent}
        {onButtonClick && (
          <Button
            variant="contained"
            size="small"
            type={"button"}
            onClick={onButtonClick}
            disabled={buttonDisabled}
          >
            {buttonText}
          </Button>
        )}
      </Stack>
      {sidebarContent && (
        <Stack className="view-content-sidebar-column" gap={3}>
          {sidebarContent}
        </Stack>
      )}
    </Stack>
  );
}
