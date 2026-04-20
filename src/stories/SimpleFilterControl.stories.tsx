import type { Meta, StoryObj } from "@storybook/react-vite";
import { SimpleFilterControl } from "../components/SimpleFilterControl";

const meta = {
  title: "Control/SimpleFilterControl",
  component: SimpleFilterControl,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof SimpleFilterControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    volumeFilter: 0,
    persistErrors: false,
  },
};
