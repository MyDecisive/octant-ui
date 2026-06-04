import MuiAlert, { type AlertProps as MuiAlertProps } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

interface AlertProps extends MuiAlertProps {
  title?: string;
  description?: string;
}

export function Alert({ title, description, children, ...rest }: AlertProps) {
  return (
    <MuiAlert {...rest}>
      {children ?? (
        <>
          {title && <AlertTitle>{title}</AlertTitle>}
          {description}
        </>
      )}
    </MuiAlert>
  );
}
