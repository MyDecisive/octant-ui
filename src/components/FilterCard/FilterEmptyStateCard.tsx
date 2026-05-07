import { CardHeader } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "./FilterEmptyStateCard.css";

export interface FilterEmptyStateCardProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
}

export function FilterEmptyStateCard({
  title,
  description,
  actionLabel,
  onAction,
}: FilterEmptyStateCardProps) {
  return (
    <Card className="filter-card-empty-state-container">
      <CardContent className="filter-card-empty-state-content">
        <CardHeader
          title={title}
          subheader={description}
          slotProps={{
            title: {
              variant: "h6",
            },
            subheader: {
              variant: "body1",
            },
          }}
        />
        <Button variant="contained" size="small" onClick={onAction}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
