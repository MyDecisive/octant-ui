import { FilterTypes } from "@types";
import { ClarityCopy } from "../../copy/clarity/Clarity.copy";
import {
  RatioFilterControl,
  type RatioFilterControlProps,
} from "./RatioFilterControl/RatioFilterControl";
import { RatioFilterControlEmptyState } from "./RatioFilterControl/RatioFilterControlEmptyState";
import { useManageFilter } from "./useManageFilter";

const { title, emptyState } = ClarityCopy.logFilter;

export type DataTypeFilterControlProps = Pick<
  RatioFilterControlProps,
  "received" | "sent" | "filtered" | "defaultExpanded"
>;

export function LogsFilterControl(props: DataTypeFilterControlProps) {
  const { filter, loading, handleApplyFilter, configured } = useManageFilter(
    FilterTypes.LOG,
  );

  if (!configured) {
    return (
      <RatioFilterControlEmptyState
        title={emptyState.title}
        description={emptyState.subtitle}
        actionLabel={emptyState.cta}
      />
    );
  }

  return (
    <RatioFilterControl
      loading={loading}
      {...filter}
      {...props}
      unit="GB"
      onApplyFilter={handleApplyFilter}
      title={title}
    />
  );
}
