import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import DatabaseOffIcon from "../assets/database-off.svg?react";
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
        <CardHeader className="no-connection-card-content-title" title={<Stack direction="row" spacing={2} alignItems="center">
          <DatabaseOffIcon />
          <Typography variant="h5">{title}</Typography>
        </Stack>} subheader={description} />
        {!!onButtonClick && (<div className="no-connection-card-button-container">
          <Button variant="secondary" size="small" onClick={onButtonClick}>
            {actionLabel}
          </Button>
        </div>)}
      </CardContent>
    </Card>
  );
}
