import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import { useCallback, type ChangeEvent, type FocusEventHandler } from "react";

interface CheckBoxGroupProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selectedValues: string[]) => void;
  label?: string;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
}

export function CheckboxGroup({
  options,
  selected,
  onChange,
  label,
  onFocus,
  onBlur,
}: CheckBoxGroupProps) {
  const handleCheckedChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = event.target;

      const nextSelected = checked
        ? selected.includes(value)
          ? selected
          : [...selected, value]
        : selected.filter((item) => item !== value);

      onChange(nextSelected);
    },
    [selected, onChange],
  );

  return (
    <FormControl onFocus={onFocus} onBlur={onBlur}>
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
              />
            }
            label={label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}
