import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Toolbar } from "@mui/x-data-grid";
import classNames from "classnames";

interface TableFooterProps {
  total: number;
}

export function SummaryTableToolbar({ total }: TableFooterProps) {
  return (
    <Toolbar className={classNames("mdai-summary-table-toolbar")}>
      <Stack alignItems={"flex-end"} direction={"row"} gap={1}>
        <Typography bold variant="h5">
          Overall estimated cost
        </Typography>
        <Tooltip
          slotProps={{
            tooltip: {
              className: "mdai-summary-table-tooltip",
            },
          }}
          title={
            <Stack gap={1}>
              <Typography variant="body2" bold>
                Estimated data charges is based on average rates
              </Typography>

              <Typography variant="body2" color="secondary">
                This also reflects only the data send to this hub. Your total
                costs may be higher.
              </Typography>
              <Stack
                alignItems={"flex-end"}
                direction={"row"}
                justifyContent={"flex-end"}
              >
                <Button
                  className="mdai-summary-table-tooltip-cta-button"
                  variant="text"
                  endIcon={<ArrowOutwardRoundedIcon />}
                >
                  See full production costs
                </Button>
              </Stack>
            </Stack>
          }
          placement="bottom"
          arrow
        >
          <ErrorOutlineRoundedIcon color="secondary" />
        </Tooltip>
      </Stack>
      <Stack alignItems={"flex-end"} direction={"row"} gap={0.5}>
        <Typography
          variant="caption"
          color="secondary"
        >{`For the last 24h`}</Typography>
        <Typography
          bold
          variant="h5"
        >{`$${total.toLocaleString()}`}</Typography>
      </Stack>
    </Toolbar>
  );
}
