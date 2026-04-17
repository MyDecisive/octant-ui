import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { CodeSnippet } from "../components/CodeSnippet";
import { SimpleCard } from "../components/SimpleCard";

const meta = {
  title: "Components/SimpleCard",
  component: SimpleCard,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Migrate Smarthub into production",
    description:
      "Ready to go live? Follow our step-by-step guide to safely migrate Smarthub from your current environment into production.",
  },
} satisfies Meta<typeof SimpleCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithHeaderAction: Story = {
  args: {
    headerAction: (
      <Button
        variant="text"
        target="_blank"
        rel="noopener noreferrer"
        href="https://docs.mydecisive.ai/"
        size="small"
        disableRipple
      >
        See our docs
      </Button>
    ),
  },
};

export const WithBadge: Story = {
  args: {
    title: "Start budgeting now",
    description: "Placeholder copy for a recommendation card.",
    headerAction: <Chip color="primary" label="Recommended" size="small" />,
  },
};

export const WithFooterActions: Story = {
  args: {
    title: "Commit your changes to Source control",
    description:
      "Your manifests are ready. Push them to your repository to make the configuration official and version-controlled.",
    footer: (
      <>
        <Button variant="text" size="small" disableRipple>
          Download .zip first
        </Button>
        <Button
          variant="text"
          color="secondary"
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.mydecisive.ai/"
          size="small"
          disableRipple
        >
          Go to docs
        </Button>
      </>
    ),
  },
};

export const WithCodeSnippet: Story = {
  args: {
    title: "Revert your Argo CD & Datadog agent changes",
    description:
      "Something didn't go as planned. Run the command below to restore both your Argo CD configuration and Datadog agent to their previous state:",
    children: <CodeSnippet code="argocd app delete example-collector" />,
  },
};
