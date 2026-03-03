import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

type IntegrationOption = {
  label: string;
  value: string;
};

type IntegrationSelectProps = {
  label?: string;
  value: string;
  options: IntegrationOption[];
  onChange: (value: string) => void;
};

export function IntegrationSelect({
  label = "Select integration",
  value,
  options,
  onChange,
}: IntegrationSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel sx={{ color: "#616161" }}>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={handleChange}
        sx={{
          backgroundColor: "#ffffff",
          color: "#171717",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cfcfcf" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9e9e9e" },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
