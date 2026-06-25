import type { FixCardProps } from "@app-types/components";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

export function FixCard({ label, description, actions }: FixCardProps) {
  return (
    <Card className="health-widget-fix-card">
      <CardHeader
        className="health-widget-fix-card-header"
        disableTypography
        title={
          <Typography variant="body2" data-bold="true">
            {label}
          </Typography>
        }
      />
      <CardContent className="health-widget-fix-card-content">
        {description}
      </CardContent>
      <CardActions className="health-widget-fix-card-actions">
        {actions?.map(({ text, onClick, href }) =>
          href ? (
            <Button
              key={text}
              variant="contained"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {text}
            </Button>
          ) : (
            <Button key={text} onClick={onClick} variant="contained">
              {text}
            </Button>
          ),
        )}
      </CardActions>
    </Card>
  );
}
