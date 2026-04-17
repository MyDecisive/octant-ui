import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeSnippet } from "../components/CodeSnippet";

const meta = {
  title: "Components/CodeSnippet",
  component: CodeSnippet,
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

export const Default: Story = {};

export const WithoutCopyButton: Story = {
  args: {
    copyButton: false,
  },
};
