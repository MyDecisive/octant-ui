import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewTitle } from "../components/ViewTitle";

const meta = {
  title: "Components/ViewTitle",
  component: ViewTitle,
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Set up and install your Smarthub",
    description:
      "Tell us where you'd like the Smarthub to live and how you want to preserve important data.",
  },
} satisfies Meta<typeof ViewTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
