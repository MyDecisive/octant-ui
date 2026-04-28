import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusCard } from "../components/StatusCard";

const meta = {
  title: "Display/StatusCard",
  component: StatusCard,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof StatusCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Status",
    lastSuccessful: "7/2/87",
    rows: [
      {
        label: "Hub Infrastructure",
        value: false,
      },
      {
        label: "Connection",
        value: true,
      },
      {
        label: "Filter",
        value: "loading",
      },
      {
        label: "Integration",
        value: "Datadog",
      },
    ],
  },
};
