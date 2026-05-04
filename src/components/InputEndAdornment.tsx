import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import type { SvgIconProps } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";

interface InputEndAdornmentProps {
  tooltip?: string;
  success?: boolean;
  error?: boolean;
  loading?: boolean;
}

export function InputEndAdornment({
  tooltip,
  success,
  error,
  loading,
}: InputEndAdornmentProps) {
  if (loading) {
    return (
      <InputAdornment position="end">
        <CircularProgress size="1rem" color="secondary" />
      </InputAdornment>
    );
  }

  if (!tooltip && !error && !success) {
    return undefined;
  }

  let Icon = InfoRoundedIcon;
  let color: SvgIconProps["color"] = "secondary";

  if (success) {
    Icon = CheckCircleIcon;
    color = "success";
  }

  if (error) {
    Icon = CancelRoundedIcon;
    color = "error";
  }

  return (
    <InputAdornment position="end">
      {tooltip ? (
        <Tooltip title={tooltip} placement="right" arrow>
          <Icon color={color} />
        </Tooltip>
      ) : (
        <Icon color={color} />
      )}
    </InputAdornment>
  );
}
