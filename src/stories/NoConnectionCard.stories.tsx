import Box from "@mui/material/Box";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NoConnectionCard } from "../components/NoConnectionCard";
import "../pages/Clarity/Clarity.css";

const meta = {
  title: "Components/NoConnectionCard",
  component: NoConnectionCard,
  decorators: [
    (Story) => {
      return (
        <Box className="main-content-container" sx={{ minHeight: 360 }}>
          <Story />
        </Box>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    columnWidth: "12col",
  },
  args: {
    title: "Looks like there's a connection issue",
    description:
      "We may not have visibility into your data. Let's review and manage your pipeline to make sure everything is connected.",
    actionLabel: "Go to Connections",
  },
} satisfies Meta<typeof NoConnectionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const TableEmptyState: Story = {
  args: {
    title: "Looks like there's a connection issue",
    description:
      "Let's review and manage your pipeline to make sure everything is connected.",
    actionLabel: "Review in System Health",
  },
};
