import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { type ChangeEvent, useMemo } from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  required?: boolean;
  tooltip?: string;
  filledTooltipIcon?: boolean;
  helperText?: string;
}

export function Input({
  label,
  value,
  onChange,
  required = false,
  tooltip,
  filledTooltipIcon,
  placeholder,
  helperText,
}: InputProps) {
  const TooltipIcon = useMemo(() => {
    return filledTooltipIcon ? InfoIcon : InfoOutlinedIcon;
  }, [filledTooltipIcon]);

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
              <InputAdornment position="end">
                <Tooltip title={tooltip} placement="right" arrow>
                  <TooltipIcon />
                </Tooltip>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
    </Stack>
  );
}
