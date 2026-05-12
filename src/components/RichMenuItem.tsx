import Chip, { type ChipProps } from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import classNames from "classnames";

interface RichMenuItemProps {
  label?: string;
  helperText?: string;
  chip?: ChipProps;
  value: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Built to support the various modes of display for options in the Timepicker version of the
 * Select component, this can be used in other Menus if needed.
 */
export function RichMenuItem({
  label,
  helperText,
  chip,
  value,
  disabled,
  className,
}: RichMenuItemProps) {
  return (
    <MenuItem
      disabled={disabled}
      className={classNames("mdai-rich-menu-item", className)}
      value={value}
    >
      <span>{label || value}</span>
      {chip && <Chip {...chip} />}
      {helperText && (
        <Typography className="option-helper-text" color="textDisabled">
          {helperText}
        </Typography>
      )}
    </MenuItem>
  );
}
