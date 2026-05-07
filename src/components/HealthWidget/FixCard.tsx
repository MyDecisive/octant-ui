import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export interface FixInfo {
  label?: string;
  description?: ReactNode;
  actions?: {
    onClick: () => void;
    text: string;
  }[];
}

export function FixCard({ label, description, actions }: FixInfo) {
  return (
    <Card className="health-widget-fix-card">
      <CardHeader
        className="health-widget-fix-card-header"
        disableTypography
        title={
          <Typography variant="body2" bold>
            {label}
          </Typography>
        }
      />
      <CardContent className="health-widget-fix-card-content">
        {description}
      </CardContent>
      <CardActions className="health-widget-fix-card-actions">
        {actions?.map(({ text, onClick }) => (
          <Button key={text} onClick={onClick} variant="contained">
            {text}
          </Button>
        ))}
      </CardActions>
    </Card>
  );
}
