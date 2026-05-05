import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import "./SearchField.css";

export interface SearchFieldProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ options, value, onChange }: SearchFieldProps) {
  return (
    <Autocomplete
      freeSolo
      className="search-field-autocomplete"
      options={options}
      inputValue={value}
      clearIcon={<Typography fontSize={12}>Clear</Typography>}
      clearText="Clear"
      slotProps={{
        clearIndicator: {
          disableRipple: true,
        },
      }}
      onInputChange={(_, nextValue) => {
        onChange(nextValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for service"
          placeholder="Search for service"
          size="small"
        />
      )}
    />
  );
}
