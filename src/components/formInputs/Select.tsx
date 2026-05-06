import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Chip, { type ChipProps } from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, {
  type SelectProps as MuiSelectProps,
  type SelectChangeEvent,
} from "@mui/material/Select";
import Typography from "@mui/material/Typography";
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
        MenuProps={{
          className: "mdai-select-menu-options-container",
        }}
      >
        {options.map(({ label, value, chip, helperText: optionHelperText }) => (
          <MenuItem className="mdai-select-menu-item" key={value} value={value}>
            <span>{label || value}</span>
            {chip && <Chip {...chip} />}
            {optionHelperText && (
              <Typography className="option-helper-text" color="textDisabled">
                {optionHelperText}
              </Typography>
            )}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {errorText && <FormHelperText color="error">{errorText}</FormHelperText>}
    </FormControl>
  );
}
