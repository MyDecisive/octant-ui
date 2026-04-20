import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusChip } from "../components/StatusChip";

const meta = {
  title: "Components/StatusChip",
  component: StatusChip,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof StatusChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Applied: Story = {
  args: {
    status: "applied",
  },
};

export const Updating: Story = {
  args: {
    status: "updating",
  },
};
export const Inactive: Story = {
  args: {
    status: "inactive",
  },
};
