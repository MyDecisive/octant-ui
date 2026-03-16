import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface ViewTitleProps {
  title: string;
  description?: ReactNode;
}

export function ViewTitle({ title, description }: ViewTitleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "flex-start",
        alignSelf: "stretch",
      }}
    >
      <Typography variant="h5">{title}</Typography>
      {description && <Typography variant="body2">{description}</Typography>}
    </Box>
  );
}
