import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  GridFooterContainer,
  GridPagination,
  type GridFooterContainerProps,
} from "@mui/x-data-grid";

interface TableFooterProps extends GridFooterContainerProps {
  total?: number;
  label: string;
}

export function TableFooter({ total, label, ...rest }: TableFooterProps) {
  return (
    <GridFooterContainer className="mdai-table-footer" {...rest}>
      <GridPagination />
      <Stack
        className="mdai-table-footer-text"
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
