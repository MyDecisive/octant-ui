import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterWidget } from "../components/FilterWidget";

const meta = {
  title: "Components/FilterWidget",
  component: FilterWidget,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof FilterWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    volumeFilter: 0,
    persistErrors: false,
  },
};
