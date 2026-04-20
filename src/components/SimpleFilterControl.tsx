import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { Accordion } from "./Accordion";
import { SliderControl } from "./formInputs/SliderControl";
import "./SimpleFilterControl.css";

interface SimpleFilterControlProps {
  volumeFilter?: number;
  persistErrors?: boolean;
}

export function SimpleFilterControl({
  volumeFilter,
  persistErrors,
}: SimpleFilterControlProps) {
  const hasVolumeFilter = !!volumeFilter;
  const hasPersistErrors = !!persistErrors;

  const showFilterChips = hasPersistErrors || hasVolumeFilter;
  return (
    <Accordion
      className="simple-filter-control"
      title={
        <Stack>
          <Typography variant="h5">Filters</Typography>
          {showFilterChips && (
            <Stack direction={"row"} gap={0.5}>
              {hasVolumeFilter && (
                <Chip
                  variant="outlined"
                  clickable={false}
                  label={`Volume-${volumeFilter.toString()}%`}
                />
              )}
              {hasPersistErrors && (
                <Chip
                  variant="outlined"
                  clickable={false}
                  label={`Errors - ${persistErrors ? "On" : "Off"}`}
                />
              )}
            </Stack>
          )}
        </Stack>
      }
      content={
        <Stack className="simple-filter-control-content-container" gap={1}>
          <SliderControl
            value={volumeFilter ?? 0}
            label="Volume to filter"
            valueUnits="%"
          />
          <Divider />
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack>
              <Typography variant="h6">Persist Errors</Typography>
              <Typography variant="caption">Always keep errors</Typography>
            </Stack>
            <Switch value={persistErrors} />
          </Stack>
          <Stack
            className="filter-widget-button-container"
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Button variant="text" size="small">
              Cancel
            </Button>
            <Button variant="text" size="small">
              Apply
            </Button>
          </Stack>
        </Stack>
      }
    />
  );
}
