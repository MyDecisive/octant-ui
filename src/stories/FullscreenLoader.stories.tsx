import type { Meta, StoryObj } from "@storybook/react-vite";
import { FullscreenLoader } from "../components/FullscreenLoader";

const meta = {
  title: "Components/FullscreenLoader",
  component: FullscreenLoader,
} satisfies Meta<typeof FullscreenLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FourOhFourPage: Story = {
  args: {
    is404: true,
  },
};
