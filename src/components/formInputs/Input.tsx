import { InputEndAdornment } from "@components/InputEndAdornment";
import TextField from "@mui/material/TextField";
import { type ChangeEventHandler, type FocusEventHandler } from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  tooltip?: string;
  success?: boolean;
  error?: boolean;
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
  success,
  error,
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
      error={error}
      fullWidth
      slotProps={{
        input: {
          endAdornment: (
            <InputEndAdornment
              tooltip={tooltip}
              success={success}
              error={error}
            />
          ),
        },
      }}
    />
  );
}
