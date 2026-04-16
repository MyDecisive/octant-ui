import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import "./SimpleCard.css";

interface SimpleCardProps {
  title: string;
  description?: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export function SimpleCard({
  title,
  description,
  headerAction,
  footer,
  children,
}: SimpleCardProps) {
  return (
    <Card className="simple-card-container">
      <CardContent className="simple-card-content">
        <Stack gap={2} className="simple-card-main-content">
          <CardHeader
            className="simple-card-header"
            action={headerAction}
            title={title}
            subheader={description}
            slotProps={{
              title: {
                variant: "body2",
                className: "simple-card-title",
              },
              subheader: {
                variant: "body2",
                className: "simple-card-description",
              },
            }}
          />
          {children}
          {footer && <CardActions className="simple-card-footer">{footer}</CardActions>}
        </Stack>
      </CardContent>
    </Card>
  );
}
