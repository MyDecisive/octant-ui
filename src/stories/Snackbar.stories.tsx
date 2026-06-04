import Button from "@mui/material/Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Snackbar } from "../components/Snackbar";

const meta = {
  title: "Display/Snackbar",
  component: Snackbar,
  args: {
    open: true,
    onClose: () => null,
  },
} satisfies Meta<typeof Snackbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    severity: "neutral",
    title: "Applying updates ...",
    description:
      "This may take a few moments. Feel free to monitor connection status in System health.",
  },
};

export const Success: Story = {
  args: {
    severity: "neutral",
    message: "New settings applied",
  },
};

export const Error: Story = {
  args: {
    severity: "error",
    title: "Connection error.",
    action: (
      <Button size="small" color="inherit">
        Check system health
      </Button>
    ),
  },
};
