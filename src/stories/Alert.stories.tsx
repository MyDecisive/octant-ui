import Button from "@mui/material/Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "../components/Alert";

const meta = {
  title: "Display/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    severity: "error",
    title: "Something went wrong",
    description: "Troubleshoot with our documentation, then try again",
    action: (
      <Button
        className="fix-dialog-content-external-link"
        href={"https://docs.mydecisive.ai/"}
        target="_blank"
        rel="noopener noreferrer"
        variant="text"
      >
        Go to docs
      </Button>
    ),
  },
};
