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
  targetIcon?: ReactElement;
  header?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  placement?: TooltipProps["placement"];
}

interface TableToolbarProps {
  label?: string;
  summaryTable?: boolean;
  timeRangeLabel?: string;
  tooltip?: TableToolbarTooltip;
  total?: string;
}

export function TableToolbar({
  label,
  summaryTable = false,
  timeRangeLabel,
  tooltip,
  total,
}: TableToolbarProps) {
  return (
    <Toolbar
      className={classNames("mdai-table-toolbar", {
        "mdai-summary-table-toolbar": summaryTable,
      })}
    >
      <Stack alignItems="flex-end" direction="row" gap={1}>
        <Typography
          variant={summaryTable ? "h5" : "body2"}
          className="mdai-table-toolbar-label"
          data-bold="true"
        >
          {label}
        </Typography>
        {tooltip && (
          <RichTooltip
            placement={tooltip.placement ?? "bottom"}
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
                  endIcon={
                    tooltip.ctaExternal ? (
                      <ArrowOutwardRoundedIcon />
                    ) : undefined
                  }
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
            {tooltip.targetIcon ?? (
              <ErrorOutlineRoundedIcon color="secondary" />
            )}
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
