import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { StatusRowState } from "@types";
import { useMemo } from "react";
import "./StatusCard.css";
import { createColumnDefinitionsForDataTable } from "./Table/createColumnDefinitionsForDataTable";
import { Table } from "./Table/Table";

interface StatusRowData {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  value: string | StatusRowState;
}

export interface StatusCardProps {
  label: string;
  lastSuccessful: string;
  rows: StatusRowData[];
}

const columns = createColumnDefinitionsForDataTable<
  StatusRowData & { id: string }
>([
  {
    align: "left",
    field: "label",
    headerClassName: "status-card-header-cell",
  },
  {
    align: "right",
    field: "value",
    cellClassName: "status-card-value-cell",
    headerClassName: "status-card-header-cell",
    renderCell: ({ value }) => {
      switch (value) {
        case "loading":
          return <CircularProgress size="1rem" color="secondary" />;
        case false:
          return <CancelIcon color="error" />;
        case true:
          return <CheckCircleIcon color="success" />;
        case null:
          return "-";
        default:
          return value as string;
      }
    },
  },
]);

export function StatusCard({ label, lastSuccessful, rows }: StatusCardProps) {
  const rowsWithId = useMemo(() => {
    return rows.map((row, index) => ({
      id: `${row.label}-${index.toString()}`,
      ...row,
    }));
  }, [rows]);
  return (
    <Table<StatusRowData & { id: string }>
      className="status-card-table"
      hideFooter
      columnHeaderHeight={0}
      header={
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          className="status-card-label-row"
        >
          <Typography variant="body2" bold>
            {label}
          </Typography>
          <Typography
            variant="body2"
            color="secondary"
          >{`Last successful state on ${lastSuccessful}`}</Typography>
        </Stack>
      }
      rows={rowsWithId}
      columns={columns}
    />
  );
}
