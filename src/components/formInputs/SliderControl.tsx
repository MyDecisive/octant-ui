import Slider, {
  type SliderOwnProps as MuiSliderControlProps,
} from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "./SliderControl.css";

interface SliderControlProps extends MuiSliderControlProps<number> {
  label: string;
  valueUnits?: string;
}

export function SliderControl({
  label,
  valueUnits,
  ...rest
}: SliderControlProps) {
  return (
    <Stack gap={0.5} className="slider-control-container">
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography className="slider-control-label" variant="chipLabel">
          {label}
        </Typography>
        {valueUnits != "" && (
          <Typography>{`${rest.value}${valueUnits}`}</Typography>
        )}
      </Stack>
      <Slider className="slider-control-input" {...rest} />
    </Stack>
  );
}
