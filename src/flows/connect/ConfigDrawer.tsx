import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "./ConfigDrawer.css";

export function ConfigDrawer() {
  return (
    <Stack
      className="config-drawer-container"
      gap={1}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {/** TODO: turn this into  a code snippet somehow */}
      <Typography>Expand config view +</Typography>
    </Stack>
  );
}
