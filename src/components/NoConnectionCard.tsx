import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
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
        <CardHeader className="no-connection-card-content-title" title={<Stack direction="row" spacing={2} alignItems="center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.375 19.8L0 1.425L1.4 0L19.8 18.4L18.375 19.8ZM10.6 18.2C8.08333 18.2 5.95417 17.8125 4.2125 17.0375C2.47083 16.2625 1.6 15.3167 1.6 14.2V4.2C1.6 3.76667 1.74583 3.35417 2.0375 2.9625C2.32917 2.57083 2.74167 2.20833 3.275 1.875L9.575 8.175C8.375 8.125 7.26667 7.975 6.25 7.725C5.23333 7.475 4.35 7.14167 3.6 6.725V9.725C4.45 10.2083 5.475 10.575 6.675 10.825C7.875 11.075 9.18333 11.2 10.6 11.2C10.9333 11.2 11.2583 11.1958 11.575 11.1875C11.8917 11.1792 12.2083 11.1583 12.525 11.125L14.275 12.875C13.7083 12.9917 13.1167 13.075 12.5 13.125C11.8833 13.175 11.25 13.2 10.6 13.2C9.18333 13.2 7.875 13.075 6.675 12.825C5.475 12.575 4.45 12.2083 3.6 11.725V14.2C3.75 14.6833 4.5625 15.1375 6.0375 15.5625C7.5125 15.9875 9.03333 16.2 10.6 16.2C11.6667 16.2 12.7375 16.0917 13.8125 15.875C14.8875 15.6583 15.775 15.3917 16.475 15.075L17.925 16.525C17.1083 17.0417 16.0625 17.45 14.7875 17.75C13.5125 18.05 12.1167 18.2 10.6 18.2ZM19.35 15.125L17.6 13.375V11.725C17.4167 11.825 17.2333 11.9167 17.05 12C16.8667 12.0833 16.675 12.1667 16.475 12.25L14.95 10.725C15.45 10.5917 15.9208 10.4458 16.3625 10.2875C16.8042 10.1292 17.2167 9.94167 17.6 9.725V6.725C16.9167 7.10833 16.1333 7.41667 15.25 7.65C14.3667 7.88333 13.4 8.04167 12.35 8.125L10.45 6.225C11.1833 6.225 11.95 6.16667 12.75 6.05C13.55 5.93333 14.2958 5.77917 14.9875 5.5875C15.6792 5.39583 16.2625 5.17917 16.7375 4.9375C17.2125 4.69583 17.5 4.45833 17.6 4.225C17.4167 3.74167 16.5792 3.28333 15.0875 2.85C13.5958 2.41667 12.1 2.2 10.6 2.2C9.98333 2.2 9.35417 2.24167 8.7125 2.325C8.07083 2.40833 7.45833 2.51667 6.875 2.65L5.225 1C5.975 0.75 6.80833 0.554167 7.725 0.4125C8.64167 0.270833 9.6 0.2 10.6 0.2C13.0833 0.2 15.2042 0.591667 16.9625 1.375C18.7208 2.15833 19.6 3.1 19.6 4.2V14.2C19.6 14.3667 19.5792 14.525 19.5375 14.675C19.4958 14.825 19.4333 14.975 19.35 15.125Z" fill="black" />
          </svg>
          <Typography variant="h5">{title}</Typography>
        </Stack>} subheader={description} />
        <div className="no-connection-card-button-container">
        <Button variant="secondary" size="small" onClick={onButtonClick}>
          {actionLabel}
        </Button>
        </div>
      </CardContent>
    </Card>
  );
}
