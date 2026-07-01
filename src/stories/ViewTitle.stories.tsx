import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { FlowLayout } from "@components/layout/FlowLayout";
import { ViewTitle } from "@components/ViewTitle";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Layout/ViewTitle",
  component: ViewTitle,
  decorators: [
    (Story) => (
      <FlowLayout>
        <FlowCenterColumn>
          <div style={{ backgroundColor: "#F3F3F6", borderRadius: "4px" }}>
            <Story />
          </div>
        </FlowCenterColumn>
      </FlowLayout>
    ),
  ],
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Set up and install your SmartHub",
    description:
      "Tell us where you'd like the SmartHub to live and how you want to preserve important data.",
  },
} satisfies Meta<typeof ViewTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
