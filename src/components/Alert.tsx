import MuiAlert, {
  type AlertProps as MuiAlertProps,
} from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

interface AlertProps extends MuiAlertProps {
  title?: string;
  description?: string;
}

export function Alert({ title, description, ...rest }: AlertProps) {
  return (
    <MuiAlert {...rest}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description}
    </MuiAlert>
  );
}
