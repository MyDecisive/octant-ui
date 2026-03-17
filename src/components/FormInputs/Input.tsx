import { Stack, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { type ChangeEvent, type ReactElement } from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  required?: boolean;
  tooltip?: ReactElement;
  helperText?: string;
}

export function Input({
  label,
  value,
  onChange,
  required = false,
  tooltip,
  placeholder,
  helperText,
}: InputProps) {
  return (
    <Stack sx={{ maxWidth: 360 }}>
      <TextField
        label={label}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        size="small"
        required={required}
        helperText={helperText}
        fullWidth
        slotProps={{
          input: {
            endAdornment: tooltip ? (
              <InputAdornment position="end">{tooltip}</InputAdornment>
            ) : undefined,
          },
        }}
      />
    </Stack>
  );
}
