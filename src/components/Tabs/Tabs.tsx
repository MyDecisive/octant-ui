import { SearchField, type SearchFieldProps } from "@components/SearchField";
import Stack from "@mui/material/Stack";
import MuiTab from "@mui/material/Tab";
import MuiTabs from "@mui/material/Tabs";
import type { ReactNode } from "react";
import { HoverPopover } from "./HoverPopover";
import { TabLabel } from "./TabLabel";
import { TabPanel } from "./TabPanel";

export interface TabItem {
  value: string;
  label: string;
  missingData?: boolean;
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
      <TabLabel
        label={item.label}
        loading={loading}
        missingData={item.missingData}
        resultCount={item.resultCount}
        showResultCounts={showResultCounts}
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
