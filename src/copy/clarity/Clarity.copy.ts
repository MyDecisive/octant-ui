import type { InputProps } from "@components/formInputs/Input";

type CopyState = {
  header?: string;
  body?: string;
  cta?: string;
};

type EmptyStateCopy = {
  title: string;
  subtitle: string;
  cta: string;
};

type FilterStatusCopy = {
  na: string;
  ke: string;
};

type TelemetryRowsCopy = {
  ingested: string;
  routed: string;
  dropped: string;
};

type FilterCard = {
  status: FilterStatusCopy;
  rows: TelemetryRowsCopy;
  slider: string;
  toggle: string;
  ctas: {
    apply: string;
    cancel: string;
  };
};

type FilterCopy = {
  title: string;
  emptyState: EmptyStateCopy;
};

type BaseCostTableCopy<TColumns extends Record<string, string>> = {
  title: string;
  tooltip: CopyState;
  columns: TColumns;
  pagination: string;
  tec: string;
  noData: CopyState;
  connectionIssue: CopyState;
};

type LogTableColumnsCopy = {
  service: string;
  sent: string;
  pTotal: string;
  estimatedCost: string;
};

type TraceTableColumnsCopy = {
  rootSpans: string;
  spanBreadth: string;
  invocations: string;
  spanDepth: string;
  estimatedCost: string;
};

type ClarityCopyConfig = {
  header: string;
  timerange: {
    label: string;
    timerangeOptions: {
      T24H: string;
      T30D: string;
      TP30D: string;
    };
    status: {
      processing: string;
      storage: string;
      lt1M: string;
    };
  };
  overall: {
    title: string;
    tooltip: CopyState;
    columns: {
      type: string;
      export: string;
      rate: string;
      pTotal: string;
      total: string;
    };
    rows: {
      l: string;
      t: string;
    };
  };
  filterCard: FilterCard;
  logFilter: FilterCopy;
  traceFilter: FilterCopy;
  search: InputProps;
  logsTable: BaseCostTableCopy<LogTableColumnsCopy>;
  traceTable: BaseCostTableCopy<TraceTableColumnsCopy>;
  overallErrorState: CopyState;
};

const defineFilterCopy = (copy: FilterCopy): FilterCopy => copy;

const defineCostTableCopy = <TColumns extends Record<string, string>>(
  copy: BaseCostTableCopy<TColumns>,
): BaseCostTableCopy<TColumns> => copy;

export const ClarityCopy = {
  // CH-01
  header: "Deploy via ArgoCD",
  timerange: {
    // CH-02
    label: "Time range",
    timerangeOptions: {
      // CH-03
      T24H: "1 day",
      // CH-04
      T30D: "30 days",
      // CH-05
      TP30D: "Previous 30 days",
    },
    status: {
      // CH-06
      processing: "Processing",
      // CH-07
      storage: "Limited by Retention Settings (legend)",
      // CH-08
      lt1M: "Less than one month of data available",
    },
  },
  overall: {
    // CH-09
    title: "Approximate Datadog ingest costs",
    tooltip: {
      // CH-10
      header: "Estimated data charges is based on average rates",
      // CH-11
      body: "This also reflects only the data send to this hub. Your total costs may be higher.",
      // CH-12
      cta: "See full production costs",
    },
    columns: {
      // CH-17
      type: "Type",
      // CH-18
      export: "Data Exported",
      // CH-19
      rate: "Rate",
      // CH-20
      pTotal: "% of Total",
      // CH-21
      total: "Total",
    },
    rows: {
      // CH-22
      l: "Logs",
      // CH-23
      t: "Traces",
    },
  },
  filterCard: {
    status: {
      // CH-25
      // CH-38
      na: "None applied",
      // CH-26
      // CH-39
      ke: "Keep errors",
    },
    rows: {
      // CH-27
      // CH-40
      ingested: "Ingested",
      // CH-28
      // CH-41
      routed: "Routed",
      // CH-29
      // CH-42
      dropped: "Dropped",
    },
    // CH-30
    // CH-43
    slider: "Sampling Rate",
    // CH-31
    // CH-44
    toggle: "Always keep errors",
    ctas: {
      // CH-32
      // CH-45
      cancel: "Cancel",
      // CH-33
      // CH-46
      apply: "Apply",
    },
  },
  logFilter: defineFilterCopy({
    // CH-24
    title: "Log filters",
    emptyState: {
      // CH-34
      title: "Logs not configured",
      // CH-35
      subtitle:
        "SmartHub is not receiving log data. Configure your log sources to begin monitoring and controlling your telemetry spend.",
      // CH-36
      cta: "Configure logs",
    },
  }),
  traceFilter: defineFilterCopy({
    // CH-37
    title: "Trace filters",
    emptyState: {
      // CH-47
      title: "Traces not configured",
      // CH-48
      subtitle:
        "SmartHub is not receiving trace data. Configure your tracing source to begin monitoring and controlling your telemetry spend.",
      // CH-49
      cta: "Configure Traces",
    },
  }),
  search: {
    // CH-50
    placeholder: "Search services...",
    // CH-51
    // ctaClear: "Clear",
  },
  logsTable: defineCostTableCopy<LogTableColumnsCopy>({
    // CH-52
    title: "Top Log Sources by Cost",
    tooltip: {
      body: "Showing top 250 results. Refine your search to narrow down results.",
    },
    columns: {
      // CH-53
      service: "Service / Source",
      // CH-54
      sent: "Log count",
      // CH-55
      pTotal: "% of Total",
      // CH-56
      estimatedCost: "Estimated Cost",
    },
    // CH-57
    pagination: "Rows per page",
    // CH-58
    tec: "Total estimated cost",
    noData: {
      // CH-59
      header: "No logs yet",
      // CH-60
      body: "",
      // CH-61
      cta: "Configure Logs",
    },
    connectionIssue: {
      // CH-62
      header: "Pipeline connection error",
      // CH-63
      body: "SmartHub isn't receiving any log data. Configure a log source in your pipeline settings to begin routing data to this environment.",
      // CH-64
      cta: "Check System Health",
    },
  }),
  traceTable: defineCostTableCopy<TraceTableColumnsCopy>({
    // CH-65
    title: "Top Traces by Cost",
    tooltip: {
      body: "Showing top 250 results. Refine your search to narrow down results.",
    },
    columns: {
      // CH-66
      rootSpans: "Root Spans (by Service)",
      // CH-67
      spanBreadth: "Spans per Trace (Avg)",
      // CH-68
      invocations: "Trace Count",
      // CH-69
      spanDepth: "Data Volume",
      // CH-70
      estimatedCost: "Estimated Cost",
    },
    // CH-71
    pagination: "Rows per page",
    // CH-72
    tec: "Total estimated cost",
    noData: {
      // CH-73
      header: "No traces yet",
      // CH-74
      body: "",
      // CH-75
      cta: "Configure Traces",
    },
    connectionIssue: {
      // CH-76
      header: "Pipeline connection error",
      // CH-77
      body: "Traces are enabled, but SmartHub is not receiving data. Verify your agent configuration and check system health for dropped connections.",
      // CH-78
      cta: "Check System Health",
    },
  }),
  overallErrorState: {
    // CH-79
    header: "Pipeline connection error",
    // CH-80
    body: "No incoming data detected. Verify your pipeline configuration and agent connections to restore visibility.",
    // CH-81
    cta: "Check System Health",
  },
} satisfies ClarityCopyConfig;
