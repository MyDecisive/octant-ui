import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { type ChangeEvent, type FocusEventHandler } from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  required?: boolean;
  tooltip?: string;
  helperText?: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export function Input({
  label,
  value,
  onChange,
  required = false,
  tooltip,
  placeholder,
  helperText,
  onFocus,
  onBlur,
}: InputProps) {
  return (
    <TextField
      label={label}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      size="small"
      required={required}
      helperText={helperText}
      fullWidth
      slotProps={{
        input: {
          endAdornment: tooltip ? (
            <InputAdornment position="end">
              <Tooltip title={tooltip} placement="right" arrow>
                <InfoOutlinedIcon />
              </Tooltip>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
