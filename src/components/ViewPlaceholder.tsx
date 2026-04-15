import type { BaseFlowViewProps } from "@types";
import { ButtonRow } from "./layout/ButtonRow";
import { CenterColumn } from "./layout/CenterColumn";
import { NextButton } from "./NextButton";

export function ViewPlaceholder({ viewKey }: BaseFlowViewProps) {
  return (
    <CenterColumn>
      <div>{`this is a placeholder for the ${viewKey} component`}</div>
      <ButtonRow>
        <NextButton disabled={false} />
      </ButtonRow>
    </CenterColumn>
  );
}
