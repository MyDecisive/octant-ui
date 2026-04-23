import { Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataCard } from "../components/DataCard";

const meta = {
  title: "Display/DataCard",
  component: DataCard,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof DataCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    title: <Typography>% Savings</Typography>,
    helperText: "this should show up in a tooltip",
    metrics: [
      {
        value: 0,
        unit: "%",
      },
    ],
  },
};

export const Double: Story = {
  args: {
    title: (
      <Typography>
        Total <strong>DATA Received</strong>
      </Typography>
    ),
    helperText: "this should show up in a tooltip",
    metrics: [
      {
        label: "Logs",
        value: 100,
        unit: "GB",
      },
      {
        label: "Traces",
        value: 45,
        unit: "MM Spans",
      },
    ],
  },
};
