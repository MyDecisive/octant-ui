import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
        <Button variant="contained" size="small" onClick={onAction}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
