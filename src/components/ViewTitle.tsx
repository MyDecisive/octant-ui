import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import "./ViewTitle.css";

interface ViewTitleProps {
  title: ReactNode;
  description?: ReactNode;
}

export function ViewTitle({ title, description }: ViewTitleProps) {
  return (
    <Stack gap={1} alignItems={"flex-start"} alignSelf={"stretch"}>
      <Typography className="view-title-title" variant="h5">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" className="view-title-description">
          {description}
        </Typography>
      )}
    </Stack>
  );
}
