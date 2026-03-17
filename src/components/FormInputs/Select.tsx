import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { type SelectChangeEvent } from "@mui/material/Select";
import "./Select.css";

interface SelectOption {
  label?: string;
  value: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  disabled?: boolean;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}

const TypeSafeIconComponent = () => (
  <KeyboardArrowDown className="select-custom-caret" />
);

export function Select({
  disabled,
  label,
  options,
  value,
  onChange,
}: SelectProps) {
  return (
    <FormControl>
      {label && <InputLabel id={"select-label-id"}>{label}</InputLabel>}
      <MuiSelect
        id="select-menu"
        labelId="select-label-id"
        value={value}
        label={label}
        disabled={disabled}
        onChange={onChange}
        IconComponent={TypeSafeIconComponent}
      >
        {options.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label || value}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
