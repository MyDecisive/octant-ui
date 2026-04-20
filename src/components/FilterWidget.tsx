import {
  Button,
  Chip,
  Divider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Accordion } from "./Accordion";
import "./FilterWidget.css";
import { SliderControl } from "./formInputs/SliderControl";

interface FilterWidgetProps {
  volumeFilter?: number;
  persistErrors?: boolean;
}

export function FilterWidget({
  volumeFilter,
  persistErrors,
}: FilterWidgetProps) {
  const hasVolumeFilter = volumeFilter != undefined;
  const hasPersistErrors = persistErrors != undefined;

  const showFilterChips = hasPersistErrors || hasVolumeFilter;
  return (
    <Accordion
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
        <Stack className="filter-widget-content-container" gap={1}>
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
