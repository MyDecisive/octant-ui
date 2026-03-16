import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { type SelectChangeEvent } from "@mui/material/Select";

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

const TypeSafeIconComponent = () => <KeyboardArrowDown />;

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
