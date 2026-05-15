import { RichTooltip } from "@components/RichTooltip";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Toolbar } from "@mui/x-data-grid";
import classNames from "classnames";

interface SummaryTableToolbarProps {
  timeRangeLabel?: string;
  total?: string;
}

export function SummaryTableToolbar({
  timeRangeLabel,
  total,
}: SummaryTableToolbarProps) {
  return (
    <Toolbar className={classNames("mdai-summary-table-toolbar")}>
      <Stack alignItems={"flex-end"} direction={"row"} gap={1}>
        <Typography data-bold="true" variant="h5">
          Overall estimated cost
        </Typography>
        <RichTooltip
          slotProps={{
            tooltip: {
              className: "mdai-summary-table-tooltip",
            },
          }}
          title="Estimated data charges is based on average rates"
          description="This also reflects only the data send to this hub. Your total
                costs may be higher."
          actions={
            <Button
              className="mdai-summary-table-tooltip-cta-button"
              variant="text"
              endIcon={<ArrowOutwardRoundedIcon />}
            >
              See full production costs
            </Button>
          }
        >
          <ErrorOutlineRoundedIcon color="secondary" />
        </RichTooltip>
      </Stack>
      <Stack alignItems={"flex-end"} direction={"row"} gap={0.5}>
        <Typography variant="caption" color="secondary">
          {timeRangeLabel}
        </Typography>
        <Typography data-bold="true" variant="h5">{`$${total}`}</Typography>
      </Stack>
    </Toolbar>
  );
}
