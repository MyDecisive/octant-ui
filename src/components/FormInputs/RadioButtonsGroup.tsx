import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import type { ChangeEvent } from "react";

interface RowRadioButtonsGroupProps {
  values: { label: string; value: string }[];
  selected: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioButtonsGroup({
  values,
  selected,
  onChange,
}: RowRadioButtonsGroupProps) {
  return (
    <FormControl>
      <FormLabel
        id="demo-row-radio-buttons-group-label"
        sx={{ color: "text.secondary", mb: 0.5 }}
      >
        Export Type
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={selected}
        onChange={onChange}
        sx={{
          columnGap: 1.5,
          "& .MuiFormControlLabel-label": {
            fontSize: "0.95rem",
            color: "text.primary",
          },
        }}
      >
        {values.map(({ label, value }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio size="small" />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
