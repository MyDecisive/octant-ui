import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import type { AlertProps } from "@app-types/components";

export function Alert({ title, description, ...rest }: AlertProps) {
  return (
    <MuiAlert {...rest}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description}
    </MuiAlert>
  );
}
