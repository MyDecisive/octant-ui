import { SearchField } from "@components/SearchField";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";

const noopSearchChange: ComponentProps<typeof SearchField>["onChange"] = () =>
  undefined;

const meta = {
  title: "Control/Search",
  component: SearchField,
  parameters: {
    layout: "centered",
  },
  args: {
    options: ["service 1", "service 2", "Service 10", "Service 3"],
    value: "",
    onChange: noopSearchChange,
  },
  argTypes: {
    value: {
      table: {
        disable: true,
      },
    },
    onChange: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);

    return (
      <SearchField
        {...args}
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
          args.onChange(nextValue);
        }}
      />
    );
  },
};
