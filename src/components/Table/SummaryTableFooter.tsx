import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  GridFooterContainer,
  type GridFooterContainerProps,
} from "@mui/x-data-grid";
import classNames from "classnames";

interface TableFooterProps extends GridFooterContainerProps {
  total?: number;
  label?: string;
}

export function SummaryTableFooter({
  total,
  label,
  className,
  ...rest
}: TableFooterProps) {
  return (
    <GridFooterContainer
      className={classNames("mdai-summary-table-footer", className)}
      {...rest}
    >
      <Stack direction={"column"}>
        <Typography data-bold="true" variant="h5">
          Estimated Total Cost
        </Typography>
        <Typography data-bold="true" variant="caption">{`For - ${label}`}</Typography>
      </Stack>
      {total != null && (
        <Typography
          data-bold="true"
          variant="h5"
        >{`$${total.toLocaleString()}`}</Typography>
      )}
    </GridFooterContainer>
  );
}
