import type { BaseFlowViewProps } from "@types";
import { CenterColumn } from "./layout/CenterColumn";

export function ViewPlaceholder({ viewKey }: BaseFlowViewProps) {
  return (
    <CenterColumn>
      <div>{`this is a placeholder for the ${viewKey} component`}</div>
    </CenterColumn>
  );
}
