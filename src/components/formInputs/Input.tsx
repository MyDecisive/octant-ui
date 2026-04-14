import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { type ChangeEvent, type FocusEventHandler } from "react";

interface InputProps {
  label?: string;
  title?: string;
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
  title,
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
    <Stack sx={{ maxWidth: 360 }} gap={1}>
      {title && <Typography variant="body1">{title}</Typography>}
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
    </Stack>
  );
}
