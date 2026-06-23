import { FilterTypes } from "@types";
import { ClarityCopy } from "../../copy/clarity/Clarity.copy";
import {
  RatioFilterControl,
  type RatioFilterControlProps,
} from "./RatioFilterControl/RatioFilterControl";
import { RatioFilterControlEmptyState } from "./RatioFilterControl/RatioFilterControlEmptyState";
import { useManageFilter } from "./useManageFilter";

const { title, emptyState } = ClarityCopy.traceFilter;

export type DataTypeFilterControlProps = Pick<
  RatioFilterControlProps,
  "received" | "sent" | "filtered" | "defaultExpanded"
>;

export function TracesFilterControl(props: DataTypeFilterControlProps) {
  const { filter, loading, handleApplyFilter, configured } = useManageFilter(
    FilterTypes.TRACE,
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
      unit="MM Spans"
      onApplyFilter={handleApplyFilter}
      title={title}
    />
  );
}
