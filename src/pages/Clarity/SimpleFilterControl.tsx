import type { UIFilterType } from "@app-types/enums";
import { FILTER_TYPES } from "@constants/enums";
import { ClarityCopy } from "../../copy/clarity/Clarity.copy";
import { RatioFilterControl } from "./RatioFilterControl/RatioFilterControl";
import { RatioFilterControlEmptyState } from "./RatioFilterControl/RatioFilterControlEmptyState";
import { useManageFilter } from "./useManageFilter";

// TODO: Units constant
function getCopyByType(type: UIFilterType) {
  if (type === FILTER_TYPES.LOG) {
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
  type: UIFilterType;
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
