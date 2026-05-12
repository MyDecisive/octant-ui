import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  GridFooterContainer,
  GridPagination,
  type GridFooterContainerProps,
} from "@mui/x-data-grid";
import classNames from "classnames";

interface TableFooterProps extends GridFooterContainerProps {
  total?: string;
  label?: string;
  hideFooterPagination?: boolean;
}

export function TableFooter({
  total,
  label,
  hideFooterPagination,
  className,
  ...rest
}: TableFooterProps) {
  return (
    <GridFooterContainer
      className={classNames("mdai-table-footer", className)}
      {...rest}
    >
      {!hideFooterPagination && <GridPagination />}
      <Stack
        className="mdai-table-footer-text-container"
        direction="row"
        alignItems={"center"}
        gap={3}
        justifyContent={"flex-end"}
      >
        <Typography variant="body2">{label}</Typography>
        {total != null && (
          <Typography variant="body2">{`$${total.toLocaleString()}`}</Typography>
        )}
      </Stack>
    </GridFooterContainer>
  );
}
