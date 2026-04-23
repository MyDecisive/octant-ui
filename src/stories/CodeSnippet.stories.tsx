import { FlowCenterColumn } from "@components/layout/FlowCenterColumn";
import { FlowLayout } from "@components/layout/FlowLayout";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeSnippet } from "../components/CodeSnippet";

const meta = {
  title: "Display/CodeSnippet",
  component: CodeSnippet,
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
    layout: "centered",
  },
  args: {
    code: `kubectl apply -f collector.yaml
kubectl rollout restart deployment/datadog-agent -n mdai`,
  },
} satisfies Meta<typeof CodeSnippet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    copyButton: false,
    maxHeight: "500px",
  },
};

export const WithoutCopyButton: Story = {
  args: {
    copyButton: false,
  },
};
