import { RichTooltip } from "@components/RichTooltip";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import type { TooltipProps } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Toolbar } from "@mui/x-data-grid";
import classNames from "classnames";
import type { ReactElement } from "react";

export interface TableToolbarTooltip {
  icon?: ReactElement;
  header?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
}

interface TableToolbarProps {
  label?: string;
  summaryTable?: boolean;
  timeRangeLabel?: string;
  tooltip?: TableToolbarTooltip;
  tooltipPlacement?: TooltipProps["placement"];
  total?: string;
}

export function TableToolbar({
  label,
  summaryTable = false,
  timeRangeLabel,
  tooltip,
  tooltipPlacement = "bottom",
  total,
}: TableToolbarProps) {
  return (
    <Toolbar
      className={classNames("mdai-table-toolbar", {
        "mdai-summary-table-toolbar": summaryTable,
      })}
    >
      <Stack alignItems="flex-end" direction="row" gap={1}>
        <Typography variant="h5" className="mdai-table-toolbar-label">
          {label}
        </Typography>
        {tooltip && (
          <RichTooltip
            placement={tooltipPlacement}
            slotProps={{
              tooltip: {
                className: "mdai-table-toolbar-tooltip",
              },
            }}
            title={tooltip.header}
            description={tooltip.body}
            actions={
              tooltip.cta && (
                <Button
                  className="mdai-table-toolbar-tooltip-cta-button"
                  variant="text"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  component="a"
                  href={tooltip.ctaHref ?? ""}
                  target={tooltip.ctaExternal ? "_blank" : undefined}
                  rel={tooltip.ctaExternal ? "noreferrer" : undefined}
                >
                  {tooltip.cta}
                </Button>
              )
            }
          >
            {tooltip.icon ?? <ErrorOutlineRoundedIcon color="secondary" />}
          </RichTooltip>
        )}
      </Stack>
      {summaryTable && (
        <Stack alignItems="flex-end" direction="row" gap={0.5}>
          <Typography variant="caption" color="secondary">
            {timeRangeLabel}
          </Typography>
          <Typography data-bold="true" variant="h5">{`$${total}`}</Typography>
        </Stack>
      )}
    </Toolbar>
  );
}
