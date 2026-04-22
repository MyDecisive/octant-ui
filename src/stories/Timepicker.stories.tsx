import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timepicker } from "../components/Timepicker";

const meta = {
  title: "Control/Timepicker",
  component: Timepicker,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof Timepicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "today",
    onChange: () => {},
  },
};
