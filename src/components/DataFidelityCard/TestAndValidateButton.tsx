import Button, { type ButtonProps } from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useOctantConnectStore } from "@store/connectStore";
import type { FidelityState } from "@types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useShallow } from "zustand/shallow";
import { connections } from "../../services/api";

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
      disabled: true,
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

function createLoadingDataFidelity(): FidelityState {
  return {
    receivingData: "loading",
    sendingData: "loading",
    dataIntegrity: "loading",
    details: "loading",
  };
}

// TODO: remove Demo code
function createSuccessfulDataFidelity(): FidelityState {
  return {
    receivingData: true,
    sendingData: true,
    dataIntegrity: true,
    details: null,
  };
}

export function TestAndValidateButton({
  setDataFidelity,
  setIsValid,
}: {
  setDataFidelity: Dispatch<SetStateAction<FidelityState>>;
  setIsValid: Dispatch<SetStateAction<boolean>>;
}) {
  // TODO: remove Demo code
  const demoSuccessAttempt = 3;
  const isDemoMode =
    import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true";
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [shouldRetry, setShouldRetry] = useState<boolean | null>(null);
  // TODO: remove Demo code
  const [attemptCount, setAttemptCount] = useState(0);

  const { connectionName } = useOctantConnectStore(
    useShallow((state) => ({
      connectionName: state.form.connectionName,
    })),
  );

  const handleTestButtonClick = () => {
    // TODO: remove Demo code
    const nextAttempt = attemptCount + 1;

    setLoading(true);
    // TODO: remove Demo code
    setError(null);
    setAttemptCount(nextAttempt);
    setDataFidelity(createLoadingDataFidelity());

    // TODO: remove Demo code
    if (isDemoMode && nextAttempt >= demoSuccessAttempt) {
      setShouldRetry(false);
      setIsValid(true);
      setDataFidelity(createSuccessfulDataFidelity());
      setLoading(false);
      return;
    }

    void connections
      .getStatus(connectionName!)
      .then((response) => {
        const didNotPass = Object.values(response).some((value) => {
          return value === false;
        });
        if (didNotPass) {
          setShouldRetry(true);
        } else {
          setShouldRetry(false);
          setIsValid(true);
        }
        setDataFidelity(response);
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

  const { text, variant, color, disabled } = determineButtonProps(
    loading,
    shouldRetry,
    shouldRetry != null && !shouldRetry,
  );

  return (
    <>
      <Button
        className="data-fidelity-action-button"
        onClick={handleTestButtonClick}
        loadingPosition="start"
        loading={loading}
        disabled={disabled}
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
  );
}
