import type { Meta, StoryObj } from "@storybook/react-vite";
import { HealthWidget } from "../components/HealthWidget/HealthWidget";

const meta = {
  title: "Components/HealthWidget",
  component: HealthWidget,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof HealthWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SimpleGreen: Story = {
  args: {
    status: "operational",
    title: "Smarthub Infrastructure",
  },
};
export const SimpleRed: Story = {
  args: {
    status: "error",
    title: "Smarthub Infrastructure",
    fix: {
      label: "How to fix",
      description: "{Generic description}",
      actions: [
        {
          text: "See our docs",
          onClick: () => console.log("clicked the thing"),
        },
      ],
    },
  },
};
