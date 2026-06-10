import { Table, type TableProps } from "@components/Table/Table";
import type { Overall } from "@mydecisiveai/octant-client";
import { FilterTypes, type BaseRowDefinition } from "@types";
import { ClarityCopy } from "../../copy/clarity/Clarity.copy";
import {
  logsColumns,
  traceColumns,
  type LogData,
  type SpanData,
} from "./constants";
import { TabsEmptyState } from "./TabsEmptyStates";

type ClarityTabTableConfig<TRow extends BaseRowDefinition> = Pick<
  TableProps<TRow>,
  "columns" | "footerLabel" | "label" | "toolbarTooltip"
> & {
  getTotal: (data: Overall | null) => string;
};

type ClarityRowsByType = {
  [FilterTypes.LOG]: LogData;
  [FilterTypes.TRACE]: SpanData;
};

interface BaseClarityTabTableProps {
  configured: boolean;
  data: Overall | null;
  hasData: boolean;
  loading: boolean;
  onClearSearch: () => void;
  onRefreshData: () => Promise<void>;
  percentSampled?: number;
  searchQuery: string;
}

type ClarityTabTableProps = BaseClarityTabTableProps &
  {
    [DataType in FilterTypes]: {
      dataType: DataType;
      rows: TableProps<ClarityRowsByType[DataType]>["rows"];
    };
  }[FilterTypes];

interface ClarityTabTableContentProps<
  TRow extends BaseRowDefinition,
> extends BaseClarityTabTableProps {
  config: ClarityTabTableConfig<TRow>;
  rows: TableProps<TRow>["rows"];
  dataType: FilterTypes;
}

const tableConfigs = {
  [FilterTypes.LOG]: {
    label: ClarityCopy.logsTable.title,
    toolbarTooltip: {
      ...ClarityCopy.logsTable.tooltip,
      placement: "right",
    },
    columns: logsColumns,
    footerLabel: ClarityCopy.logsTable.tec,
    getTotal: (data) =>
      data?.log?.cost ? data.log.cost.toLocaleString() : "-",
  },
  [FilterTypes.TRACE]: {
    label: ClarityCopy.traceTable.title,
    toolbarTooltip: {
      ...ClarityCopy.traceTable.tooltip,
      placement: "right",
    },
    columns: traceColumns,
    footerLabel: ClarityCopy.traceTable.tec,
    getTotal: (data) =>
      data?.trace?.cost ? data.trace.cost.toLocaleString() : "-",
  },
} satisfies {
  [K in FilterTypes]: ClarityTabTableConfig<ClarityRowsByType[K]>;
};

function ClarityTabTableContent<TRow extends BaseRowDefinition>({
  config,
  configured,
  data,
  hasData,
  loading,
  onClearSearch,
  onRefreshData,
  percentSampled,
  rows,
  searchQuery,
  dataType,
}: ClarityTabTableContentProps<TRow>) {
  if (!configured || (!loading && rows.length === 0)) {
    return (
      <TabsEmptyState
        dataType={dataType}
        configured={configured}
        hasData={hasData}
        percentSampled={percentSampled}
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
        onRefreshData={onRefreshData}
      />
    );
  }

  return (
    <Table<TRow>
      label={config.label}
      toolbarTooltip={config.toolbarTooltip}
      columns={config.columns}
      rows={rows}
      loading={loading}
      showToolbar
      footerLabel={config.footerLabel}
      total={config.getTotal(data)}
    />
  );
}

export function ClarityTabTable(props: ClarityTabTableProps) {
  if (props.dataType === FilterTypes.LOG) {
    return (
      <ClarityTabTableContent
        {...props}
        config={tableConfigs[FilterTypes.LOG]}
      />
    );
  }

  return (
    <ClarityTabTableContent
      {...props}
      config={tableConfigs[FilterTypes.TRACE]}
    />
  );
}
