import { Typography } from "@mui/material";
import Button, { type ButtonProps } from "@mui/material/Button";
import { useState } from "react";
import { ButtonRow } from "./layout/ButtonRow";
import { NextButton } from "./NextButton";

interface AsyncButtonText {
  text: string;
  loading?: string;
  done?: string;
  error?: string;
  retry?: string;
}

interface AsyncButtonRowProps {
  asyncFunction: () => Promise<unknown>;
  canAsync: boolean;
  retries?: number;
  asyncButtonText: AsyncButtonText;
}

export function AsyncButtonRow({
  asyncFunction,
  canAsync,
  retries = 0,
  asyncButtonText,
}: AsyncButtonRowProps) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleAsyncCall = () => {
    setError(null);
    setLoading(true);
    setAttempts((curr) => curr + 1);
    void asyncFunction()
      .then(() => {
        setError(null);
        setDone(true);
      })
      .catch((err: unknown) => {
        console.error("Async action failed", err);
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while completing this step. Please try again.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const canRetry = attempts <= retries;

  const buttonProps = getAsyncButtonProps(
    asyncButtonText,
    canAsync,
    canRetry,
    loading,
    done,
    error,
  );

  return (
    <>
      <ButtonRow>
        <Button
          variant="contained"
          size="small"
          type={"button"}
          onClick={handleAsyncCall}
          disabled={buttonProps.disabled}
          color={buttonProps.color}
          loading={buttonProps.loading}
        >
          {buttonProps.text}
        </Button>
        <NextButton disabled={!done} />
      </ButtonRow>
      {error != null && (
        <Typography variant="body2" color="error">
          {error}
          {canRetry && ` Please try again.`}
        </Typography>
      )}
    </>
  );
}

function getAsyncButtonProps(
  textOptions: AsyncButtonText,
  canAsync: boolean,
  canRetry: boolean,
  loading: boolean,
  done: boolean,
  error: string | null,
): {
  text: string;
  color: ButtonProps["color"];
  disabled: boolean;
  loading: boolean;
} {
  if (loading) {
    return {
      text: textOptions.loading ?? textOptions.text,
      disabled: true,
      loading: textOptions.loading ? false : true,
      color: "secondary",
    };
  }

  if (done) {
    return {
      text: textOptions.done ?? textOptions.text,
      disabled: true,
      loading: false,
      color: "success",
    };
  }

  if (error) {
    // TODO: handle error case
    if (canRetry) {
      return {
        text: textOptions.retry ?? textOptions.text,
        disabled: false,
        loading: false,
        color: "primary",
      };
    }
    return {
      text: textOptions.error ?? textOptions.text,
      disabled: false,
      loading: false,
      color: "secondary",
    };
  }

  if (canAsync) {
    return {
      text: textOptions.text,
      disabled: false,
      loading: false,
      color: "primary",
    };
  }

  return {
    text: textOptions.text,
    disabled: true,
    loading: false,
    color: "secondary",
  };
}
