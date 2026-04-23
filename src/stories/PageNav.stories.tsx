import type { Meta, StoryObj } from "@storybook/react-vite";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { PageNav } from "../components/PageNav";

const meta = {
  title: "Navigation/PageNav",
  component: PageNav,
  decorators: [
    (Story) => {
      const { hook } = memoryLocation({ path: "/clarity" });
      return (
        <Router hook={hook}>
          <Story />
        </Router>
      );
    },
  ],
  parameters: {
    layout: "centered",
  },
  args: {},
} satisfies Meta<typeof PageNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
