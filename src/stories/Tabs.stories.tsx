import { Tabs, type TabItem } from "@components/Tabs/Tabs";
import { WarningAmberRounded } from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { formatTabLabel } from "../pages/Clarity/formatTabLabel";

interface TabsStoryArgs extends ComponentProps<typeof Tabs> {
  missingData: boolean;
  resultCount: number;
  loading?: boolean;
}

const tabs: {
  label: string;
  value: string;
  filler: string;
}[] = [
  {
    label: "Logs",
    value: "logs",
    filler: "Log tab content",
  },
  {
    label: "Traces",
    value: "traces",
    filler: "Trace tab content",
  },
];

const meta: Meta<TabsStoryArgs> = {
  title: "Layout/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    controls: {
      include: ["loading", "showLoadingPopover", "missingData", "resultCount"],
    },
    docs: {
      source: {
        // Keep Storybook from recursively stringifying `items.children`, which can contain React elements and crash the preview source formatter.
        code: `<Tabs
  activeValue={activeValue}
  items={items}
  loading={loading}
  onChange={setActiveValue}
  showLoadingPopover={showLoadingPopover}
  showResultCounts={resultCount > 0}
/>`,
        type: "code",
      },
    },
  },
  argTypes: {
    loading: {
      control: "boolean",
    },
    missingData: {
      control: "boolean",
    },
    resultCount: {
      control: {
        type: "number",
        min: 0,
        step: 1,
      },
    },
  },
  args: {
    activeValue: "logs",
    items: [],
    onChange: () => undefined,
    loading: false,
    missingData: false,
    resultCount: 0,
  },
};

export default meta;

type Story = StoryObj<TabsStoryArgs>;

function RenderTabs(args: TabsStoryArgs) {
  const [activeValue, setActiveValue] = useState(tabs[0].value);
  const items: TabItem[] = tabs.map(({ label, value, filler }) => ({
    label: {
      text:
        args.resultCount != undefined
          ? formatTabLabel(label, args.resultCount)
          : label,
      loading: args.loading,
      tooltip: args.loading ? "Data is still loading" : undefined,
      startIcon: args.missingData ? (
        <WarningAmberRounded fontSize="small" />
      ) : undefined,
    },
    value,
    resultCount: args.resultCount,
    children: (
      <Card sx={{ minWidth: 275, p: 5 }}>
        <CardContent>
          <Typography variant="body2">{filler}</Typography>
        </CardContent>
      </Card>
    ),
  }));

  return (
    <Stack width={774} spacing={2}>
      <Tabs activeValue={activeValue} items={items} onChange={setActiveValue} />
    </Stack>
  );
}

export const Default: Story = {
  render: RenderTabs,
};

export const Loading: Story = {
  args: {
    loading: true,
    resultCount: 0,
  },
  render: RenderTabs,
};

export const ResultCount: Story = {
  args: {
    loading: false,
    resultCount: 17,
  },
  render: RenderTabs,
};

export const MissingData: Story = {
  args: {
    loading: false,
    missingData: true,
    resultCount: 0,
  },
  render: RenderTabs,
};
