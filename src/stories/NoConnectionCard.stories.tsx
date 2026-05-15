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
  args: {},
} satisfies Meta<typeof NoConnectionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
