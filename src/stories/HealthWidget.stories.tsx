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
export const ComplexGreen: Story = {
  args: {
    status: "operational",
    title: "Datadog connection",
    facets: [
      {
        label: "Clients connected",
        health: true,
      },
      {
        label: "Receiving data",
        health: true,
      },
      {
        label: "Sending data",
        health: true,
      },
      {
        label: "Data integrity",
        health: true,
      },
    ],
  },
};

export const ComplexRed: Story = {
  args: {
    status: "error",
    title: "Datadog connection",
    facets: [
      {
        label: "Clients connected",
        health: false,
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
      {
        label: "Receiving data",
        health: false,
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
      {
        label: "Sending data",
        health: false,
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
      {
        label: "Data integrity",
        health: false,
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
    ],
  },
};
