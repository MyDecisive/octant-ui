import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterCard } from "../components/FilterCard/FilterCard";

const meta = {
  title: "Components/FilterCard",
  component: FilterCard,
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
    volumeFilter: 0,
    persistErrors: false,
  },
};
