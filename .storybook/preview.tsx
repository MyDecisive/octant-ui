import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Preview } from "@storybook/react-vite";
import "../src/styles/index.css";
import { theme } from "../src/styles/theme";

const COLUMN_WIDTHS = {
  "12col": `calc(1200px + calc(var(--mdai-spacing-unit) * 3) * 2)`,
  "5col": `calc((1200px / 12 * 5) + calc(var(--mdai-spacing-unit) * 3) * 2)`,
  "4col": `calc((1200px / 12 * 4) + calc(var(--mdai-spacing-unit) * 3) * 2)`,
  "3col": `calc((1200px / 12 * 3) + calc(var(--mdai-spacing-unit) * 3) * 2)`,
};

const preview: Preview = {
  initialGlobals: {
    columnWidth: "12col",
  },
  globalTypes: {
    columnWidth: {
      description: "Container width",
      toolbar: {
        title: "Width",
        items: [
          { value: "12col", title: "1200px (12 col)" },
          { value: "5col", title: "5 columns" },
          { value: "4col", title: "4 columns" },
          { value: "3col", title: "3 columns" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const width =
        COLUMN_WIDTHS[
          context.globals.columnWidth as keyof typeof COLUMN_WIDTHS
        ];

      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ padding: "24px", width, margin: "0 auto" }}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
