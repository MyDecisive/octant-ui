import type { RichTooltipProps } from "@app-types/components";
import Stack from "@mui/material/Stack";
import MuiTooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { mergeSlotPropsClassNames } from "@utils/mergeSlotPropsClassNames";
import classNames from "classnames";

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
