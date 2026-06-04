import Button from "@mui/material/Button";
import { useState } from "react";

interface AsyncButtonProps {
  asyncFunction: () => Promise<boolean>;
  canAsync: boolean;
  text?: string;
  loadingText?: string;
  isSubmit?: boolean;
  onSuccess?: () => void;
}

export function AsyncButton({
  asyncFunction,
  canAsync,
  text = "Next",
  loadingText,
  isSubmit,
  onSuccess,
}: AsyncButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAsyncCall = () => {
    setLoading(true);
    void asyncFunction()
      .then((success) => {
        if (success) {
          onSuccess?.();
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
      disabled={!canAsync || loading}
      color={buttonColor}
      loading={loading}
    >
      {buttonText}
    </Button>
  );
}
