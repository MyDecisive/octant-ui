import { CenterColumn } from "@components/layout/CenterColumn";
import { Layout } from "@components/layout/Layout";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeSnippet } from "../components/CodeSnippet";

const meta = {
  title: "Components/CodeSnippet",
  component: CodeSnippet,
  decorators: [
    (Story) => (
      <Layout>
        <CenterColumn>
          <div style={{ backgroundColor: "#F3F3F6", borderRadius: "4px" }}>
            <Story />
          </div>
        </CenterColumn>
      </Layout>
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
    maxHeight: "500px"
  }
};

export const WithoutCopyButton: Story = {
  args: {
    copyButton: false,
  },
};
