import LinkOffRounded from "@mui/icons-material/LinkOffRounded";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import type { ReactNode } from "react";
import "./NoConnectionCard.css";

interface NoConnectionCardProps {
  title: ReactNode;
  description: ReactNode;
  actionLabel?: string;
  onButtonClick?: () => void;
}

export function NoConnectionCard({
  actionLabel,
  description,
  onButtonClick,
  title,
}: NoConnectionCardProps) {
  return (
    <Card className="no-connection-card-container">
      <CardContent className="no-connection-card-content">
        <LinkOffRounded
          aria-hidden="true"
          className="no-connection-card-icon"
        />
        <CardHeader title={title} subheader={description} />
        <Button variant="secondary" size="small" onClick={onButtonClick}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
