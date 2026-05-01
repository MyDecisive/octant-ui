import Button from "@mui/material/Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RichTooltip } from "../components/RichTooltip";

const meta = {
  title: "Display/RichTooltip",
  component: RichTooltip,
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof RichTooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Something went wrong",
    description: "Troubleshoot with our documentation, then try again",
    actions: (
      <Button
        href={"https://docs.mydecisive.ai/"}
        target="_blank"
        rel="noopener noreferrer"
        variant="text"
      >
        Go to docs
      </Button>
    ),
    children: (
      <Button variant="contained">there's a tooltip around this button</Button>
    ),
  },
};
