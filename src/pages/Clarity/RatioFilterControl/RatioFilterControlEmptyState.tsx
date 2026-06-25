import { CardHeader } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useLocation } from "wouter";
import { ROUTES } from "../../../constants/routing";
import "./RatioFilterControlEmptyState.css";

interface FilterEmptyStateCardProps {
  title: string;
  description: string;
  actionLabel: string;
}

export function RatioFilterControlEmptyState({
  title,
  description,
  actionLabel,
}: FilterEmptyStateCardProps) {
  const [, navigate] = useLocation();

  return (
    <Card className="ratio-filter-control-empty-state-container">
      <CardContent className="ratio-filter-control-empty-state-content">
        <CardHeader
          title={title}
          subheader={description}
          slotProps={{
            title: {
              variant: "h6",
            },
            subheader: {
              variant: "body2",
            },
          }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(ROUTES.SETTINGS)}
        >
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
