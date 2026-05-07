import type { HealthWidgetProps } from "./HealthWidget";

export function determineWidgetAccordionProps({
  status,
  fix,
  facets,
}: HealthWidgetProps) {
  if (status === "loading") {
    return {
      summaryClassName: "no-close",
      hideExpandIcon: true,
      defaultExpanded: false,
      expanded: false,
    };
  }
  if (!facets) {
    if (status === "error" && !!fix) {
      return {
        summaryClassName: "no-close",
        hideExpandIcon: true,
        defaultExpanded: true,
        expanded: true,
      };
    }

    if (status === "operational" && !fix) {
      return {
        summaryClassName: "no-close",
        hideExpandIcon: true,
        expanded: false,
        defaultExpanded: false,
      };
    }
  }

  return {};
}
