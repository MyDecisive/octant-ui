import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function ConfigDrawer() {
  return (
    <Stack
      gap={1}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        py: 3,
        px: 4.5,
        width: "100%",
        borderRadius: 2,
        background: "#454545",
      }}
    >
      {/** TODO: turn this into  a code snippet somehow */}
      <Typography>Expand config view +</Typography>
    </Stack>
  );
}
