import Stack from "@mui/material/Stack";
import MuiTooltip, {
  type TooltipProps as MuiTooltipProps,
} from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { mergeSlotPropsClassNames } from "@utils/mergeSlotPropsClassNames";
import classNames from "classnames";
import type { ReactNode } from "react";

interface RichTooltipProps extends Omit<MuiTooltipProps, "title"> {
  title?: string;
  description?: string;
  actions?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  actionRowClassName?: string;
}

const baseSlotProps: NonNullable<RichTooltipProps["slotProps"]> = {
  tooltip: {
    className: "mdai-rich-tooltip",
  },
};

export function RichTooltip({
  title,
  description,
  actions,
  children,
  slotProps,
  titleClassName,
  descriptionClassName,
  actionRowClassName,
  ...rest
}: RichTooltipProps) {
  const mergedSlotProps = mergeSlotPropsClassNames<
    NonNullable<RichTooltipProps["slotProps"]>
  >(baseSlotProps, slotProps);
  return (
    <MuiTooltip
      arrow
      {...rest}
      slotProps={mergedSlotProps}
      title={
        <Stack gap={1}>
          {title && (
            <Typography
              className={classNames("mui-rich-tooltip-title", titleClassName)}
              variant="body2"
              data-bold="true"
            >
              {title}
            </Typography>
          )}
          {description && (
            <Typography
              className={classNames(
                "mui-rich-tooltip-description",
                descriptionClassName,
              )}
              variant="body2"
              color="secondary"
            >
              {description}
            </Typography>
          )}
          {actions && (
            <Stack
              alignItems={"flex-end"}
              direction={"row"}
              justifyContent={"flex-end"}
              className={classNames(
                "mui-rich-tooltip-actions-row",
                actionRowClassName,
              )}
            >
              {actions}
            </Stack>
          )}
        </Stack>
      }
    >
      {children}
    </MuiTooltip>
  );
}
