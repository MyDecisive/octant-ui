import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
          <Stack direction="row" gap={3} className="simple-card-header">
            <Box className="simple-card-header-copy">
              <Typography variant="body2" className="simple-card-title">
                {title}
              </Typography>

              {description && (
                <Typography variant="body2" className="simple-card-description">
                  {description}
                </Typography>
              )}
            </Box>
            {headerAction && (
              <Box className="simple-card-header-action">{headerAction}</Box>
            )}
          </Stack>
          {children}
          {footer && <Box className="simple-card-footer">{footer}</Box>}
        </Stack>
      </CardContent>
    </Card>
  );
}
