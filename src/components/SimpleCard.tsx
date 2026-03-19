import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import "./SimpleCard.css";

interface SimpleCardProps {
  title: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
  content?: ReactNode;
}

export function SimpleCard({
  title,
  description,
  linkText,
  linkHref,
  content,
}: SimpleCardProps) {
  return (
    <Card className="simple-card-container">
      <CardContent className="simple-card-content">
        <Stack gap={2} className="simple-card-main-content">
          <Box>
            <Typography variant="body2" className="simple-card-title">
              {title}
            </Typography>

            {description && (
              <Typography variant="body2" className="simple-card-description">
                {description}
              </Typography>
            )}
          </Box>
          {content}
        </Stack>
        {linkText && linkHref && (
          <Button
            variant="text"
            target="_blank"
            rel="noopener noreferrer"
            href={linkHref}
            size="small"
            className="simple-card-link"
            disableRipple
          >
            {linkText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
