import { SearchField, type SearchFieldProps } from "@components/SearchField";
import Stack from "@mui/material/Stack";
import MuiTab from "@mui/material/Tab";
import MuiTabs from "@mui/material/Tabs";
import type { ReactNode } from "react";
import { HoverPopover } from "./HoverPopover";
import { LoadingTabLabel } from "./LoadingTabLabel";
import { TabPanel } from "./TabPanel";

export interface TabItem {
  value: string;
  label: string;
  resultCount?: number;
  children: ReactNode;
}

interface TabsProps {
  activeValue: string;
  items: TabItem[];
  onChange: (value: string) => void;
  loading?: boolean;
  loadingMessage?: string;
  search?: SearchFieldProps;
  showLoadingPopover?: boolean;
  showResultCounts?: boolean;
}

function formatTabLabel(
  { label, resultCount }: TabItem,
  showResultCounts: boolean,
) {
  if (showResultCounts && resultCount !== undefined) {
    return `${label} (${resultCount.toString()})`;
  }

  return label;
}

export function Tabs({
  activeValue,
  items,
  loading = false,
  loadingMessage,
  onChange,
  search,
  showLoadingPopover = false,
  showResultCounts = false,
}: TabsProps) {
  function renderTabLabel(item: TabItem) {
    const tabLabel = (
      <LoadingTabLabel
        label={formatTabLabel(item, showResultCounts)}
        loading={loading}
      />
    );

    if (!loading || !showLoadingPopover) {
      return tabLabel;
    }

    return (
      <HoverPopover message={loadingMessage ?? "Data is still loading"}>
        {tabLabel}
      </HoverPopover>
    );
  }

  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <MuiTabs
          value={activeValue}
          onChange={(_, nextValue: string) => {
            onChange(nextValue);
          }}
        >
          {items.map((item) => (
            <MuiTab
              key={item.value}
              id={`simple-tab-${item.value}`}
              aria-controls={`simple-tabpanel-${item.value}`}
              label={renderTabLabel(item)}
              value={item.value}
            />
          ))}
        </MuiTabs>
        {search && <SearchField {...search} />}
      </Stack>
      {items.map((item) => (
        <TabPanel key={item.value} value={item.value} activeValue={activeValue}>
          {item.children}
        </TabPanel>
      ))}
    </>
  );
}
