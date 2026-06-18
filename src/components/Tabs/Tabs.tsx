import { SearchField, type SearchFieldProps } from "@components/SearchField";
import Stack from "@mui/material/Stack";
import MuiTab from "@mui/material/Tab";
import MuiTabs from "@mui/material/Tabs";
import type { ReactNode } from "react";
import { TabPanel } from "./TabPanel";

export interface TabItem {
  value: string;
  label: ReactNode;
  children: ReactNode;
}

interface TabsProps {
  activeValue: string;
  items: TabItem[];
  onChange: (value: string) => void;
  search?: SearchFieldProps;
}

export function Tabs({ activeValue, items, onChange, search }: TabsProps) {
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
              label={item.label}
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
