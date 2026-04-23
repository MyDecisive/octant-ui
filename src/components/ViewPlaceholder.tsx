import type { BaseFlowViewProps } from "@types";
import { ButtonRow } from "./layout/ButtonRow";
import { FlowCenterColumn } from "./layout/FlowCenterColumn";
import { NextButton } from "./NextButton";

export function ViewPlaceholder({ viewKey }: BaseFlowViewProps) {
  return (
    <FlowCenterColumn>
      <div>{`this is a placeholder for the ${viewKey} component`}</div>
      <ButtonRow>
        <NextButton disabled={false} />
      </ButtonRow>
    </FlowCenterColumn>
  );
}
