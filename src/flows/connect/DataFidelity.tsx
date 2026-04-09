import { ViewContent } from "@components/ViewContent";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { ButtonProps } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import type { BaseFlowViewProps } from "@types";
import { useCallback, useState } from "react";

import { useOctantConnectStore } from "@store";
import { connections } from "../../services/api";
import "./DataFidelity.css";

type FidelityCellValues = "loading" | boolean | null;

interface DataFidelityStatus {
  id: string;
  connection: "Datadog";
  receivingData: FidelityCellValues;
  sendingData: FidelityCellValues;
  dataIntegrity: FidelityCellValues;
  details: FidelityCellValues;
}

const initialRows: DataFidelityStatus[] = [
  {
    id: "datadog",
    connection: "Datadog",
    receivingData: null,
    sendingData: null,
    dataIntegrity: null,
    details: null,
  },
];

function FidelityCell({
  value,
}: GridRenderCellParams<DataFidelityStatus, FidelityCellValues>) {
  if (value === false) {
    return <CancelIcon color="error" />;
  }
  if (value === true) {
    return <CheckCircleIcon color="success" />;
  }

  if (value === "loading") {
    return <CircularProgress size="1rem" color="secondary" />;
  }

  return "-";
}

const baseColumn: Partial<GridColDef<DataFidelityStatus>> = {
  flex: 2,
  cellClassName: "data-fidelity-table-cell",
  headerClassName: "data-fidelity-table-header-cell",
  align: "left",
  headerAlign: "left",
  type: "string",
};

const columns: GridColDef<DataFidelityStatus>[] = [
  {
    ...baseColumn,
    field: "connection",
    headerName: "Connection",
  },
  {
    ...baseColumn,
    field: "receivingData",
    headerName: "Receiving data",
    renderCell: FidelityCell,
  },
  {
    ...baseColumn,
    field: "sendingData",
    headerName: "Sending data",
    renderCell: FidelityCell,
  },
  {
    ...baseColumn,
    field: "dataIntegrity",
    headerName: "Data integrity",
    renderCell: FidelityCell,
  },
  {
    ...baseColumn,
    flex: 3,
    field: "details",
    headerName: "Details",
    renderCell: ({ value }: GridRenderCellParams) => {
      if (value == null || value == "") {
        return "-";
      }

      return <>{value}</>;
    },
  },
];

function determineButtonProps(
  loading: boolean,
  hasTested: boolean,
): {
  text: string;
  variant: ButtonProps["variant"];
  color?: ButtonProps["color"];
} {
  if (loading) {
    return {
      text: "Connecting...",
      variant: "secondary",
    };
  }

  if (hasTested) {
    return {
      text: "Done",
      variant: "contained",
      color: "success",
    };
  }

  return {
    text: "Test and validate data",
    variant: "secondary",
  };
}

export function DataFidelity({ onClickProgress }: BaseFlowViewProps) {
  const [rows, setRows] = useState<DataFidelityStatus[]>(initialRows);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTestedAtLeastOnce, setHasTested] = useState(false);
  const [error, setError] = useState<string | null>();
  const connectionName = useOctantConnectStore(
    (state) => state.form.connectionName,
  );

  const handleTestButtonClick = useCallback(() => {
    setLoading(true);
    setRows((currentRows) =>
      currentRows.map((row) => ({
        ...row,
        receivingData: "loading",
        sendingData: "loading",
        dataIntegrity: "loading",
      })),
    );

    void connections
      .getStatus(connectionName!)
      .then((response) => {
        setRows((currentRows) =>
          currentRows.map((row) => ({
            ...row,
            receivingData: response.receivingData,
            sendingData: response.sendingData,
            dataIntegrity: response.dataIntegrity,
          })),
        );
      })
      .then(() => {
        setHasTested(true);
      })
      .catch((error: unknown) => {
        console.log("error getting connection status", error);
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while trying to determine the status of your collector",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [connectionName]);

  const { text, variant, color } = determineButtonProps(
    loading,
    hasTestedAtLeastOnce,
  );

  return (
    <ViewContent
      title="Test Smarthub's connection and data fidelity"
      description="Check the flow between to your data source and destination. We'll also validate data quality and guide you through any fixes if needed.  Once the connection is successful, log in to Datadog to make sure data is flowing through."
      wideMainColumn
      mainContent={
        <>
          <Box>
            <DataGrid
              className="data-fidelity-table"
              autoHeight
              density="compact"
              disableAutosize
              disableColumnFilter
              disableColumnMenu
              disableColumnResize
              disableColumnSorting
              disableRowSelectionOnClick
              hideFooter
              rows={rows}
              columns={columns}
            />
          </Box>
          <Button
            className="data-fidelity-action-button"
            onClick={handleTestButtonClick}
            loadingPosition="start"
            loading={loading}
            disabled={loading}
            variant={variant}
            color={color}
            size="small"
          >
            {text}
          </Button>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </>
      }
      buttonDisabled={!hasTestedAtLeastOnce}
      onButtonClick={onClickProgress}
    />
  );
}
