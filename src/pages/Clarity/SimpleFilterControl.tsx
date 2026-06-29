import { FilterTypes } from "@types";
import { ClarityCopy } from "../../copy/clarity/Clarity.copy";
import { RatioFilterControl } from "./RatioFilterControl/RatioFilterControl";
import { RatioFilterControlEmptyState } from "./RatioFilterControl/RatioFilterControlEmptyState";
import { useManageFilter } from "./useManageFilter";

// TODO: Units constant
function getCopyByType(type: FilterTypes) {
  if (type === FilterTypes.LOG) {
    return {
      unit: "GB",
      ...ClarityCopy.logFilter,
    };
  }

  return {
    unit: "MM Spans",
    ...ClarityCopy.traceFilter,
  };
}

export function SimpleFilterControl({
  type,
  defaultExpanded,
}: {
  defaultExpanded?: boolean;
  type: FilterTypes;
}) {
  const { controlData, loading, handleApplyFilter, configured } =
    useManageFilter(type);

  const { title, emptyState, unit } = getCopyByType(type);

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
      defaultExpanded={defaultExpanded}
      {...controlData}
      unit={unit}
      onApplyFilter={handleApplyFilter}
      title={title}
    />
  );
}
