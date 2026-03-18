import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { ButtonProps } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { ViewContent } from "../../components/ViewContent";
import type { BaseFlowViewProps } from "../../types";

import "./DataFidelity.css";

type FidelityCellValues = "loading" | "good" | "bad" | null;

interface DataFidelityStatus {
  id: string;
  connection: "Datadog";
  receiving: FidelityCellValues;
  sending: FidelityCellValues;
  integrity: FidelityCellValues;
  details: FidelityCellValues;
}

const initialRows: DataFidelityStatus[] = [
  {
    id: "datadog",
    connection: "Datadog",
    receiving: null,
    sending: null,
    integrity: null,
    details: null,
  },
];

function FidelityCell({
  value,
}: GridRenderCellParams<DataFidelityStatus, FidelityCellValues>) {
  if (value === "bad") {
    return <CancelIcon color="error" />;
  }
  if (value === "good") {
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
    field: "receiving",
    headerName: "Receiving data",
    renderCell: FidelityCell,
  },
  {
    ...baseColumn,
    field: "sending",
    headerName: "Sending data",
    renderCell: FidelityCell,
  },
  {
    ...baseColumn,
    field: "integrity",
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

async function fakeTestDataFidelity() {
  return await new Promise((resolve) => setTimeout(resolve, 30000));
}

function generateFidelityValue() {
  return Math.random() > 0.8 ? "bad" : "good";
}

export function DataFidelity({ onClickProgress }: BaseFlowViewProps) {
  const [rows, setRows] = useState<DataFidelityStatus[]>(initialRows);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTestedAtLeastOnce, setHasTested] = useState(false);

  const handleTestButtonClick = useCallback(() => {
    setLoading(true);
    setRows((currentRows) =>
      currentRows.map((row) => ({
        ...row,
        receiving: "loading",
        sending: "loading",
        integrity: "loading",
      })),
    );
    void fakeTestDataFidelity()
      .then(() => {
        setRows((currentRows) =>
          currentRows.map((row) => ({
            ...row,
            receiving: generateFidelityValue(),
            sending: generateFidelityValue(),
            integrity: generateFidelityValue(),
          })),
        );
      })
      .then(() => {
        setLoading(false);
        setHasTested(true);
      });
  }, []);

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
            onClick={handleTestButtonClick}
            loading={loading}
            disabled={loading}
            variant={variant}
            color={color}
          >
            {text}
          </Button>
        </>
      }
      buttonDisabled={!hasTestedAtLeastOnce}
      onButtonClick={onClickProgress}
    />
  );
}
