import Button from "@mui/material/Button";
import type { BaseFlowViewProps } from "@types";
import { ButtonRow } from "./layout/ButtonRow";
import { CenterColumn } from "./layout/CenterColumn";

export function ViewPlaceholder({
  viewKey,
  onClickProgress,
}: BaseFlowViewProps) {
  return (
    <CenterColumn>
      <div>{`this is a placeholder for the ${viewKey} component`}</div>
      <ButtonRow>
        <Button
          variant="contained"
          size="small"
          type={"button"}
          onClick={onClickProgress}
        >
          Next
        </Button>
      </ButtonRow>
    </CenterColumn>
  );
}
