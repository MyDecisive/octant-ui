import { Alert } from "@components/Alert";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
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

interface NoConnectionCardLink {
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}

interface NoConnectionCardProps {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  alerts?: NoConnectionCardAlert[];
  actionLabel?: string;
  link?: NoConnectionCardLink;
  onButtonClick?: () => void;
}

export function NoConnectionCard({
  actionLabel,
  alerts,
  description,
  link,
  onButtonClick,
  title,
  icon = <DatabaseOff />,
}: NoConnectionCardProps) {
  const hasPrimaryAction = !!onButtonClick && !!actionLabel;
  const hasLinkAction = !!link?.label && (!!link.href || !!link.onClick);
  const linkTarget = link?.external ? "_blank" : undefined;
  const linkRel = linkTarget ? "noopener noreferrer" : undefined;

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
        {(hasPrimaryAction || hasLinkAction) && (
          <div className="no-connection-card-actions">
            {hasPrimaryAction && (
              <Button variant="secondary" size="small" onClick={onButtonClick}>
                {actionLabel}
              </Button>
            )}
            {hasLinkAction && link.href && (
              <Button
                className="no-connection-card-link"
                href={link.href}
                rel={linkRel}
                size="small"
                target={linkTarget}
                variant="text"
              >
                {link.label}
              </Button>
            )}
            {hasLinkAction && !link.href && (
              <Button
                className="no-connection-card-link"
                onClick={link.onClick}
                size="small"
                variant="text"
              >
                {link.label}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
