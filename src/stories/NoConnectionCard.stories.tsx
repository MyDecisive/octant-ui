import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
    actions: (
      <>
        <Button
          variant="secondary"
          size="small"
          onClick={() => console.log("Refresh table")}
        >
          Refresh table
        </Button>
        <Button
          href="https://github.com/MyDecisive/octant/issues"
          rel="noopener noreferrer"
          size="small"
          target="_blank"
          variant="text"
        >
          Report a bug
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof NoConnectionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithAlertsAndLink: Story = {
  args: {
    title: "Data unavailable",
    description:
      "We couldn't load your log data. Let's check to see if you have log filtering turned on before we look into other potential issues.",
    alerts: [
      {
        severity: "warning",
        title:
          "Sampling is set to 0%. Please set sampling to start seeing data.",
      },
    ],
    actions: (
      <>
        <Button
          variant="secondary"
          size="small"
          onClick={() => console.log("Refresh table")}
        >
          Refresh table
        </Button>
        <Button
          href="https://github.com/MyDecisive/octant/issues"
          rel="noopener noreferrer"
          size="small"
          target="_blank"
          variant="text"
        >
          Report a bug
        </Button>
      </>
    ),
  },
};
