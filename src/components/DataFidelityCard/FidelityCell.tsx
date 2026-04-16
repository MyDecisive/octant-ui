import { SeeFixDialog } from "@components/SeeFixDialog/SeeFixDialog";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import type { DataFidelityDetails, DataState } from "@types";
import { useState } from "react";

export function FidelityCell({
  value,
}: {
  value: null | DataState | DataFidelityDetails;
}) {
  const [open, setOpen] = useState(false);
  switch (value) {
    case "loading":
      return <CircularProgress size="1rem" color="secondary" />;
    case false:
      return <CancelIcon color="error" />;
    case true:
      return <CheckCircleIcon color="success" />;
    case "notReceiving":
    case "notSending":
    case "missingFields":
    case "oom":
    case "resourceLimit":
      return (
        <>
          <Button variant="text" onClick={() => setOpen(true)}>
            See fix
          </Button>
          <SeeFixDialog
            open={open}
            onClose={() => setOpen(false)}
            fixType={value}
          />
        </>
      );
    default:
      return "-";
  }
}
