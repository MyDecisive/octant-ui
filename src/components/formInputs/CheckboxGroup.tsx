import type { InputValidationErrors } from "@app-types/validation";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { getErrorOrHelperText } from "@utils/getErrorOrHelperText";
import { useState, type ChangeEvent, type FocusEventHandler } from "react";
import { hasValidationError } from "../../fieldValidation/hasValidationError";

interface CheckBoxGroupProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selectedValues: string[]) => void;
  label?: string;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  validate?: (value?: string[]) => InputValidationErrors;
  onValidation?: (error: InputValidationErrors) => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
}

export function CheckboxGroup({
  options,
  selected,
  onChange,
  label,
  onFocus,
  onBlur,
  helperText,
  error,
  disabled,
  validate,
  onValidation,
}: CheckBoxGroupProps) {
  const [validationErrors, setValidationErrors] =
    useState<InputValidationErrors | null>(null);

  const handleValidate = (value?: string[]) => {
    const errors = validate?.(value);
    setValidationErrors(errors);
    onValidation?.(errors);
  };

  const handleCheckedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (validationErrors) {
      setValidationErrors(null);
      onValidation?.(undefined);
    }

    const nextSelected = checked
      ? selected.includes(value)
        ? selected
        : [...selected, value]
      : selected.filter((item) => item !== value);

    onChange(nextSelected);
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    handleValidate(selected);
    onBlur?.(e);
  };

  const fieldError = error ?? hasValidationError(validationErrors);

  const fieldHelperText = getErrorOrHelperText(
    validationErrors,
    helperText,
    error,
  );

  return (
    <FormControl
      onFocus={onFocus}
      onBlur={handleBlur}
      error={fieldError}
      disabled={disabled}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <FormGroup>
        {options.map(({ label, value }) => (
          <FormControlLabel
            key={value}
            control={
              <Checkbox
                checked={selected.includes(value)}
                onChange={handleCheckedChange}
                value={value}
                disabled={disabled}
                disableRipple
              />
            }
            label={label}
          />
        ))}
      </FormGroup>
      {fieldHelperText && <FormHelperText>{fieldHelperText}</FormHelperText>}
    </FormControl>
  );
}
