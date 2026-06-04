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

// Declaring this icon here since it does not exist in the MUI icon set. Pulled from mocks.
function DatabaseOff() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"><path fill="#000" d="M18.375 19.8 0 1.425 1.4 0l18.4 18.4zM10.6 18.2q-3.775 0-6.387-1.162Q1.6 15.875 1.6 14.2v-10q0-.65.438-1.238.437-.587 1.237-1.087l6.3 6.3q-1.8-.075-3.325-.45t-2.65-1v3q1.275.725 3.075 1.1t3.925.375q.5 0 .975-.012t.95-.063l1.75 1.75q-.85.175-1.775.25t-1.9.075q-2.125 0-3.925-.375t-3.075-1.1V14.2q.225.725 2.437 1.363a16.4 16.4 0 0 0 7.776.312q1.611-.325 2.662-.8l1.45 1.45q-1.226.775-3.138 1.225t-4.187.45m8.75-3.075-1.75-1.75v-1.65a8 8 0 0 1-.55.275q-.275.125-.575.25l-1.525-1.525q.75-.2 1.413-.437a8 8 0 0 0 1.237-.563v-3q-1.025.575-2.35.925t-2.9.475l-1.9-1.9q1.1 0 2.3-.175t2.238-.462q1.036-.288 1.75-.65.712-.363.862-.713-.274-.725-2.513-1.375A16 16 0 0 0 10.6 2.2q-.925 0-1.887.125-.963.125-1.838.325L5.225 1Q6.35.625 7.725.413A19 19 0 0 1 10.6.2q3.725 0 6.362 1.175T19.6 4.2v10q0 .25-.062.475-.063.225-.188.45"/></svg>)
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
          <DatabaseOff />
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
