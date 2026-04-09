import Box from "@mui/material/Box";
import Button, { type ButtonProps } from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import "./SimpleCard.css";

interface SimpleCardProps {
  title: string;
  description?: string;
  content?: ReactNode;
  link?: {
    text: string;
    href: string;
  };
  button?: ButtonProps & {
    onClick: () => void;
    text: string;
  };
}

export function SimpleCard({
  title,
  description,
  link,
  button,
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
        {link && (
          <Button
            variant="text"
            target="_blank"
            rel="noopener noreferrer"
            href={link.href}
            size="small"
            className="simple-card-link"
            disableRipple
          >
            {link.text}
          </Button>
        )}
        {button && (
          <Button
            variant="text"
            size="small"
            className="simple-card-button"
            disableRipple
            onClick={button.onClick}
            loading={button.loading}
          >
            {button.text}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
