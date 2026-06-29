import Box from "@mui/material/Box";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RatioFilterControl } from "../pages/Clarity/RatioFilterControl/RatioFilterControl";
import { RatioFilterControlEmptyState } from "../pages/Clarity/RatioFilterControl/RatioFilterControlEmptyState";

const meta = {
  title: "Components/RatioFilterControl",
  component: RatioFilterControl,
  decorators: [
    (Story) => {
      return (
        <Box maxWidth={400}>
          <Story />
        </Box>
      );
    },
  ],
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof RatioFilterControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Log Filtering",
    unit: "GB",
    received: 89.12345,
    sent: 32.501245,
    filtered: 50.2,
    onApplyFilter: (volume, persist) => {
      console.log("apply trace filter changes ", { volume, persist });
      return new Promise((resolve) => resolve());
    },
  },
  render: function Render(args) {
    const [filters, setFilters] = useState<{
      pctSampled?: number;
      includeErr?: boolean;
    }>({
      pctSampled: args.pctSampled,
      includeErr: args.includeErr,
    });

    return (
      <RatioFilterControl
        {...args}
        pctSampled={filters.pctSampled}
        includeErr={filters.includeErr}
        onApplyFilter={(volume, persist) => {
          setFilters({
            pctSampled: volume,
            includeErr: persist,
          });
          void args.onApplyFilter(volume, persist);
          return new Promise((resolve) => resolve());
        }}
      />
    );
  },
};

export const EmptyState: Story = {
  args: {
    title: "Traces filters",
    unit: "MM Spans",
    received: 0,
    sent: 0,
    filtered: 0,
    onApplyFilter: (volume, persist) => {
      console.log("apply trace filter changes ", { volume, persist });
      return new Promise((resolve) => resolve());
    },
  },
  render: function Render() {
    return (
      <RatioFilterControlEmptyState
        title="Here is why you need traces"
        description="Enable traces to see what's actually happening."
        actionLabel="Turn on traces"
      />
    );
  },
};
