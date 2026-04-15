import Stack from "@mui/material/Stack";
import "./TabPanel.css";
interface TabPanelProps {
  children?: React.ReactNode;
  panelGap?: number;
  value: string;
  activeValue: string;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, activeValue, panelGap = 2, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${value}`}
      aria-labelledby={`simple-tab-${value}`}
      className={`octant-tab-panel${activeValue === value ? " visible" : ""}`}
      {...other}
    >
      {activeValue === value && <Stack gap={panelGap}>{children}</Stack>}
    </div>
  );
}
