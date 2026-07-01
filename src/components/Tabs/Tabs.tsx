import type { SearchFieldProps, TabItem } from "@app-types/components";
import { SearchField } from "@components/SearchField";
import Stack from "@mui/material/Stack";
import MuiTab from "@mui/material/Tab";
import MuiTabs from "@mui/material/Tabs";
import { TabLabel } from "./TabLabel";
import { TabPanel } from "./TabPanel";

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
              label={
                typeof item.label === "string" ? (
                  item.label
                ) : (
                  <TabLabel {...item.label} />
                )
              }
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
