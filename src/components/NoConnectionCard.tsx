import { Alert } from "@components/Alert";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import type { ComponentProps, ReactNode } from "react";
import DatabaseOff from "../assets/database-off.svg?react";
import "./NoConnectionCard.css";

type NoConnectionCardAlert = Pick<
  ComponentProps<typeof Alert>,
  "description" | "severity" | "title"
>;

interface NoConnectionCardProps {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  alerts?: NoConnectionCardAlert[];
  actions?: ReactNode;
}

export function NoConnectionCard({
  actions,
  alerts,
  description,
  title,
  icon = <DatabaseOff />,
}: NoConnectionCardProps) {
  return (
    <Card className="no-connection-card-container">
      <CardContent className="no-connection-card-content">
        <CardHeader
          className="no-connection-card-content-title"
          title={
            <Stack direction="row" spacing={2} alignItems="center">
              {icon}
              <Typography variant="h5">{title}</Typography>
            </Stack>
          }
          subheader={description}
        />
        {!!alerts?.length && (
          <Stack className="no-connection-card-alerts" gap={1}>
            {alerts.map((alert, index) => (
              <Alert
                key={`no-connection-card-alert-${index.toString()}`}
                {...alert}
              />
            ))}
          </Stack>
        )}
        {actions && <div className="no-connection-card-actions">{actions}</div>}
      </CardContent>
    </Card>
  );
}
