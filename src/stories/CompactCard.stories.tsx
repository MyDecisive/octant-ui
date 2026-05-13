import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CompactCard } from "../components/CompactCard";

const meta = {
  title: "Display/CompactCard",
  component: CompactCard,
  parameters: {
    layout: "padded",
  },
  args: {
    header: (
      <Typography variant="body2" data-bold="true">
        How to fix
      </Typography>
    ),
    content: (
      <Stack gap={3}>
        <Typography component="div" variant="body2" color="secondary">
          Clients connected
          <ul style={{ margin: 0 }}>
            <li>Generic copy to go to Docs</li>
          </ul>
        </Typography>
        <Typography component="div" variant="body2" color="secondary">
          Generic copy to go to Docs
          <ul style={{ margin: 0 }}>
            <li>Receiving data</li>
          </ul>
        </Typography>
        <Typography component="div" variant="body2" color="secondary">
          Generic copy to go to Docs
          <ul style={{ margin: 0 }}>
            <li>Sending data</li>
          </ul>
        </Typography>
        <Typography component="div" variant="body2" color="secondary">
          Generic copy to go to Docs
          <ul style={{ margin: 0 }}>
            <li>Data integrity</li>
          </ul>
        </Typography>
      </Stack>
    ),
    footer: (
      <Button size="small" variant="contained" color="inherit">
        Re-validate
      </Button>
    ),
  },
} satisfies Meta<typeof CompactCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
