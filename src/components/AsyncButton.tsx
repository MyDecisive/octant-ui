import Button, { type ButtonProps } from "@mui/material/Button";
import { useState, type MouseEvent } from "react";

export function AsyncButton(props: ButtonProps) {
  const [wasClicked, setWasClicked] = useState(false);

  const { loading, children, onClick, color } = props;

  const showFinal = wasClicked && !loading;

  const buttonText = showFinal ? "Done" : children;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setWasClicked(true);
    onClick?.(e);
  };

  const buttonColor = showFinal ? "success" : color;

  const buttonVariant = showFinal ? "contained" : "secondary";

  return (
    <Button
      {...props}
      onClick={handleClick}
      color={buttonColor}
      variant={buttonVariant}
      loadingPosition="start"
    >
      {buttonText}
    </Button>
  );
}
