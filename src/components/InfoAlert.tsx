import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

export default function InfoAlert({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Stack spacing={2}>
      <Alert severity="info">
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Stack>
  );
}
