import Button from "@mui/material/Button";
import { useOctantConnectStore } from "@store";
import { useState } from "react";

interface AsyncButtonProps {
  asyncFunction: () => Promise<boolean>;
  canAsync: boolean;
  text?: string;
  loadingText?: string;
  isSubmit?: boolean;
}

export function AsyncNextButton({
  asyncFunction,
  canAsync,
  text = "Next",
  loadingText,
  isSubmit,
}: AsyncButtonProps) {
  const [loading, setLoading] = useState(false);
  const advanceInstallFlow = useOctantConnectStore(
    (state) => state.advanceInstallFlow,
  );

  const handleAsyncCall = () => {
    setLoading(true);
    void asyncFunction()
      .then((success) => {
        if (success) {
          advanceInstallFlow();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const buttonColor = canAsync ? "primary" : "secondary";
  const buttonText = loading ? (loadingText ?? text) : text;

  return (
    <Button
      className="flow-async-button"
      variant="contained"
      size="small"
      type={isSubmit ? "submit" : "button"}
      loadingPosition="start"
      onClick={handleAsyncCall}
      disabled={!canAsync}
      color={buttonColor}
      loading={loading}
    >
      {buttonText}
    </Button>
  );
}
