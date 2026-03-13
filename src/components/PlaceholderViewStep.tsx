import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export function PlaceholderViewStep({
  onClickProgress,
  viewKey,
}: {
  onClickProgress: () => void;
  viewKey?: string;
}) {
  return (
    <Box>
      {`This is a placeholder view step for ${viewKey || "some"} step`}
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
  );
}
