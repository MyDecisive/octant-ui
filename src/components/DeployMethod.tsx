import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export function DeployMethod({
  onClickProgress,
}: {
  onClickProgress: () => void;
}) {
  return (
    <Box>
      <Paper>
        <Box>
          <Typography variant="h5">
            Deploy Directly to Your Argo CD Server?
          </Typography>
          <Typography variant="body2">
            We are about to create some Argo apps. Let us know if you’re
            comfortable with us directly pushing those apps to your Argo CD
            server on your behalf.
          </Typography>
          <Typography variant="body2">
            Note: Do not deploy to a branch that is actively in development (ex.
            production environment).
          </Typography>
          <Button
            variant="contained"
            size="small"
            type={"button"}
            onClick={onClickProgress}
            sx={{ alignSelf: "flex-start", textTransform: "none" }}
          >
            I'm ready
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
