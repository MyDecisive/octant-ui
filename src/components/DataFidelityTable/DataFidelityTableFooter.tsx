import Button, { type ButtonProps } from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { GridFooterContainer } from "@mui/x-data-grid";
import { useOctantConnectStore } from "@store";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useShallow } from "zustand/shallow";
import { connections } from "../../services/api";
import type { FidelityCellValues, RowType } from "./types";

function determineButtonProps(
  loading: boolean,
  shouldRetry: boolean | null,
  isValid: boolean,
): {
  text: string;
  variant: ButtonProps["variant"];
  disabled: boolean;
  color?: ButtonProps["color"];
} {
  if (loading) {
    return {
      text: "Connecting...",
      disabled: false,
      variant: "secondary",
    };
  }

  if (isValid) {
    return {
      text: "Done",
      disabled: true,
      variant: "contained",
      color: "success",
    };
  }

  return {
    text: shouldRetry ? "Re-validate" : "Test and validate data",
    disabled: false,
    variant: "secondary",
  };
}

export function DataFidelityTableFooter({
  setRows,
  setIsValid,
}: {
  setRows: Dispatch<SetStateAction<RowType[]>>;
  setIsValid: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [shouldRetry, setShouldRetry] = useState<boolean | null>(null);

  const { connectionName } = useOctantConnectStore(
    useShallow((state) => ({
      connectionName: state.form.connectionName,
    })),
  );

  const handleTestButtonClick = () => {
    setLoading(true);
    setRows((currentRows) =>
      currentRows.map((row) => ({
        ...row,
        value: "loading",
      })),
    );
    void connections
      .getStatus(connectionName!)
      .then((response) => {
        const allValid = Object.entries(response).some(([key, value]) => {
          return key !== "details" && value !== true;
        });
        if (allValid) {
          setShouldRetry(false);
          setIsValid(true);
        } else {
          setShouldRetry(true);
        }
        setRows((currentRows) => {
          return currentRows.map(({ id, ...rest }) => {
            if (id === "details") {
              return {
                id,
                ...rest,
                value: response[id],
              };
            }
            return {
              id,
              ...rest,
              value: response[id] as FidelityCellValues,
            };
          });
        });
      })
      .then(() => {
        setIsValid(true);
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
  };

  const { text, variant, color } = determineButtonProps(
    loading,
    shouldRetry,
    shouldRetry != null && !shouldRetry,
  );

  return (
    <GridFooterContainer>
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
    </GridFooterContainer>
  );
}
