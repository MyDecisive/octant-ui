import { RichMenuItem } from "@components/RichMenuItem";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { type ChipProps } from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MuiSelect, {
  type SelectProps as MuiSelectProps,
  type SelectChangeEvent,
} from "@mui/material/Select";
import classNames from "classnames";
import "./Select.css";

export interface SelectOption {
  label?: string;
  helperText?: string;
  chip?: ChipProps;
  value: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  helperText?: string;
  errorText?: string;
  selected: string;
  onChange: (event: SelectChangeEvent) => void;
  size?: MuiSelectProps["size"];
}

export function Select({
  disabled,
  label,
  options,
  selected,
  onChange,
  className,
  helperText,
  errorText,
  size,
}: SelectProps) {
  return (
    <FormControl
      className={classNames("mdai-select-container", className)}
      fullWidth
      variant="outlined"
      disabled={disabled}
    >
      {label && <InputLabel id={"select-label-id"}>{label}</InputLabel>}
      <MuiSelect
        id="select-menu"
        labelId="select-label-id"
        className="mdai-select-menu"
        value={selected}
        size={size}
        label={label}
        disabled={disabled}
        onChange={onChange}
        IconComponent={KeyboardArrowDown}
        renderValue={(value) => {
          const valueOption = options.find((opt) => opt.value === value);
          return (
            <RichMenuItem disabled={disabled} value={value} {...valueOption} />
          );
        }}
        MenuProps={{
          className: "mdai-select-menu-options-container",
        }}
      >
        {options.map(({ label, value, chip, helperText: optionHelperText }) => (
          <RichMenuItem
            className="mdai-select-menu-item"
            key={value}
            label={label}
            disabled={disabled}
            chip={chip}
            value={value}
            helperText={optionHelperText}
          />
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {errorText && <FormHelperText color="error">{errorText}</FormHelperText>}
    </FormControl>
  );
}
