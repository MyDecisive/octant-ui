import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import type { ChangeEvent } from "react";

interface CheckBoxGroupProps {
  values: { label: string; value: string }[];
  selected: string[];
  onChange: (selectedValues: string[]) => void;
}

export default function CheckboxGroup({
  values,
  selected,
  onChange,
}: CheckBoxGroupProps) {
  const handleCheckedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    const nextSelected = checked
      ? selected.includes(value)
        ? selected
        : [...selected, value]
      : selected.filter((item) => item !== value);

    onChange(nextSelected);
  };

  return (
    <FormGroup sx={{ rowGap: 0.5 }}>
      {values.map(({ label, value }) => (
        <FormControlLabel
          key={value}
          control={
            <Checkbox
              size="small"
              checked={selected.includes(value)}
              onChange={handleCheckedChange}
              value={value}
            />
          }
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: "0.95rem",
              color: "text.primary",
            },
          }}
          label={label}
        />
      ))}
    </FormGroup>
  );
}
