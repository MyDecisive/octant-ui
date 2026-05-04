import { InputEndAdornment } from "@components/InputEndAdornment";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import type { InputValidationErrors } from "@types";
import debounce from "debounce";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
} from "react";

interface InputProps extends Omit<TextFieldProps<"outlined">, "variant"> {
  tooltip?: string;
  success?: boolean;
  validate?: (value?: string) => InputValidationErrors;
  onValidation?: (error: InputValidationErrors) => void;
  value?: string;
  helperText?: string;
}

function hasValidationError(maybeErrors: InputValidationErrors | null) {
  if (maybeErrors == null) {
    return false;
  }

  return maybeErrors.length > 0;
}

function getErrorOrHelperText(
  validationErrors: InputValidationErrors | null,
  helperText?: string,
  errorProp?: boolean,
) {
  if (!errorProp && !validationErrors) {
    return helperText;
  }

  if (errorProp) {
    return helperText;
  }

  if (validationErrors) {
    return Array.isArray(validationErrors)
      ? validationErrors[0]
      : validationErrors;
  }

  return undefined;
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
}: InputProps) {
  const [validationErrors, setValidationErrors] =
    useState<InputValidationErrors | null>(null);

  const handleValidate = (value?: string) => {
    const errors = validate?.(value);
    setValidationErrors(errors);
    onValidation?.(errors);
  };

  const debouncedValidate = useMemo(() => debounce(handleValidate, 400), []);

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    handleValidate(value);
    onBlur?.(e);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;

    if (validationErrors) {
      setValidationErrors(null);
      onValidation?.(undefined);
    }

    onChange?.(e);

    if (validationErrors !== null) {
      debouncedValidate(value);
    }
  };

  const fieldError = error ?? hasValidationError(validationErrors);

  const fieldHelperText = getErrorOrHelperText(
    validationErrors,
    helperText,
    error,
  );

  useEffect(() => () => debouncedValidate.clear(), [debouncedValidate]);

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
