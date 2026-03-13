import { Stack, SvgIcon, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import type { ChangeEvent } from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  required?: boolean;
  tooltip?: string;
}

export function Input({
  label,
  value,
  onChange,
  required = false,
  tooltip,
}: InputProps) {
  return (
    <Stack sx={{ maxWidth: 360 }}>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        size="small"
        required={required}
        fullWidth
        slotProps={{
          input: {
            endAdornment: tooltip ? (
              <InputAdornment position="end">
                <Tooltip title={tooltip} placement="right" arrow>
                  <SvgIcon sx={{ fontSize: 18, color: "text.secondary" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 15C9.45 15 9 14.55 9 14V10C9 9.45 9.45 9 10 9C10.55 9 11 9.45 11 10V14C11 14.55 10.55 15 10 15ZM11 7H9V5H11V7Z"
                        fill="currentColor"
                        fillOpacity="0.72"
                      />
                    </svg>
                  </SvgIcon>
                </Tooltip>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
    </Stack>
  );
}
