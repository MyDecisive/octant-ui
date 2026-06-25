import type { InputValidationErrors } from "@app-types/validation";
import { InputEndAdornment } from "@components/InputEndAdornment";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { getErrorOrHelperText } from "@utils/getErrorOrHelperText";
import {
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
} from "react";
import { hasValidationError } from "../../fieldValidation/hasValidationError";

export interface InputProps extends Omit<
  TextFieldProps<"outlined">,
  "variant"
> {
  tooltip?: string;
  success?: boolean;
  validate?: (value?: string) => InputValidationErrors;
  onValidation?: (error: InputValidationErrors) => void;
  value?: string;
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
  onFocus,
  onBlur,
  success,
  error,
  validate,
  onValidation,
  ...rest
}: InputProps) {
  const [validationErrors, setValidationErrors] =
    useState<InputValidationErrors | null>(null);

  const handleValidate = (value?: string) => {
    const errors = validate?.(value);
    setValidationErrors(errors);
    onValidation?.(errors);
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    handleValidate(value);
    onBlur?.(e);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (validationErrors) {
      setValidationErrors(null);
      onValidation?.(undefined);
    }

    onChange?.(e);
  };

  const fieldError = error ?? hasValidationError(validationErrors);

  const fieldHelperText = getErrorOrHelperText(
    validationErrors,
    helperText,
    error,
  );

  return (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={handleBlur}
      size="small"
      required={required}
      helperText={fieldHelperText}
      error={fieldError}
      fullWidth
      {...rest}
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
