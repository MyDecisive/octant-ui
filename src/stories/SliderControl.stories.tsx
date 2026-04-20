import type { Meta, StoryObj } from "@storybook/react-vite";
import { SliderControl } from "../components/formInputs/SliderControl";

const meta = {
  title: "Control/SliderControl",
  component: SliderControl,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof SliderControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Volume to filter",
    valueUnits: "%",
    value: 0,
  },
};
