import { CenterColumn } from "@components/layout/CenterColumn";
import { Layout } from "@components/layout/Layout";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { CodeSnippet } from "../components/CodeSnippet";
import { SimpleCard } from "../components/SimpleCard";

type SimpleCardVariant =
  | "docs-link"
  | "recommended"
  | "footer-actions"
  | "code-snippet";

interface SimpleCardStoryArgs extends Pick<
  ComponentProps<typeof SimpleCard>,
  "title" | "description"
> {
  variant: SimpleCardVariant;
  headerActionText: string;
  badgeText: string;
  primaryActionText: string;
  secondaryActionText: string;
  docsHref: string;
  code: string;
}

const meta = {
  title: "Components/SimpleCard",
  component: SimpleCard,
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
    controls: {
      exclude: ["headerAction", "footer", "children"],
    },
    docs: {
      controls: {
        exclude: ["headerAction", "footer", "children"],
      },
    },
  },
  render: ({
    variant,
    headerActionText,
    badgeText,
    primaryActionText,
    secondaryActionText,
    docsHref,
    code,
    ...cardArgs
  }) => {
    if (variant === "recommended") {
      return (
        <SimpleCard
          {...cardArgs}
          headerAction={<Chip color="primary" label={badgeText} size="small" />}
        />
      );
    }

    if (variant === "footer-actions") {
      return (
        <SimpleCard
          {...cardArgs}
          footer={
            <>
              <Button variant="text" size="small" disableRipple>
                {primaryActionText}
              </Button>
              <Button
                variant="text"
                color="secondary"
                target="_blank"
                rel="noopener noreferrer"
                href={docsHref}
                size="small"
                disableRipple
              >
                {secondaryActionText}
              </Button>
            </>
          }
        />
      );
    }

    if (variant === "code-snippet") {
      return (
        <SimpleCard {...cardArgs}>
          <CodeSnippet code={code} />
        </SimpleCard>
      );
    }

    return (
      <SimpleCard
        {...cardArgs}
        headerAction={
          <Button
            variant="text"
            target="_blank"
            rel="noopener noreferrer"
            href={docsHref}
            size="small"
            disableRipple
          >
            {headerActionText}
          </Button>
        }
      />
    );
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["docs-link", "recommended", "footer-actions", "code-snippet"],
    },
    headerActionText: {
      control: "text",
    },
    badgeText: {
      control: "text",
    },
    primaryActionText: {
      control: "text",
    },
    secondaryActionText: {
      control: "text",
    },
    docsHref: {
      control: "text",
    },
    code: {
      control: "text",
    },
  },
  args: {
    variant: "docs-link",
    title: "Migrate Smarthub into production",
    description:
      "Ready to go live? Follow our step-by-step guide to safely migrate Smarthub from your current environment into production.",
    headerActionText: "See our docs",
    badgeText: "Recommended",
    primaryActionText: "Download .zip first",
    secondaryActionText: "Go to docs",
    docsHref: "https://docs.mydecisive.ai/",
    code: "argocd app delete example-collector",
  },
} satisfies Meta<SimpleCardStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithHeaderAction: Story = {
  args: {
    variant: "docs-link",
  },
};

export const WithBadge: Story = {
  args: {
    variant: "recommended",
    title: "Start budgeting now",
    description: "Placeholder copy for a recommendation card.",
  },
};

export const WithFooterActions: Story = {
  args: {
    variant: "footer-actions",
    title: "Commit your changes to Source control",
    description:
      "Your manifests are ready. Push them to your repository to make the configuration official and version-controlled.",
  },
};

export const WithCodeSnippet: Story = {
  args: {
    variant: "code-snippet",
    title: "Revert your Argo CD & Datadog agent changes",
    description:
      "Something didn't go as planned. Run the command below to restore both your Argo CD configuration and Datadog agent to their previous state:",
  },
};
