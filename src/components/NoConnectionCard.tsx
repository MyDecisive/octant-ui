import LinkOffRounded from "@mui/icons-material/LinkOffRounded";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import "./NoConnectionCard.css";

export function NoConnectionCard() {
  return (
    <Card className="no-connection-card-container">
      <CardContent className="no-connection-card-content">
        <LinkOffRounded
          aria-hidden="true"
          className="no-connection-card-icon"
        />
        <CardHeader
          title={"Looks like there’s a connection issue"}
          subheader={
            "We may not have visibility into your data.  Let’s review and manage your pipeline to make sure everything is connected."
          }
        />
        <Button
          className="no-connection-card-button"
          variant="secondary"
          size="small"
          onClick={() => {}}
        >
          Go to Connections
        </Button>
      </CardContent>
    </Card>
  );
}
