import Typography from "@mui/material/Typography";
import { Toolbar } from "@mui/x-data-grid";

export function TableToolbar({ label }: { label: string }) {
  return (
    <Toolbar className="mdai-table-toolbar">
      <Typography variant="h5">{label}</Typography>
    </Toolbar>
  );
}
