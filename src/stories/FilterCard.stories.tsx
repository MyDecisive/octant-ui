import Box from "@mui/material/Box";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FilterCard } from "../components/FilterCard/FilterCard";
import { FilterEmptyStateCard } from "../components/FilterCard/FilterEmptyStateCard";

const meta = {
  title: "Components/FilterCard",
  component: FilterCard,
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
} satisfies Meta<typeof FilterCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Log Filtering",
    unit: "GB",
    received: 100,
    sent: 50,
    filtered: 50,
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
      <FilterCard
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
      <FilterEmptyStateCard
        title="Here is why you need traces"
        description="Enable traces to see what's actually happening."
        actionLabel="Turn on traces"
        onAction={() => {
          console.log("turn on traces");
        }}
      />
    );
  },
};
