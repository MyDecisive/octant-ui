// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import perfectionist from "eslint-plugin-perfectionist";

export default defineConfig([
  globalIgnores(["dist", "storybook-static"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      perfectionist.configs["recommended-natural"],
    ],
    rules: {
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-named-imports": "off",
      "perfectionist/sort-exports": "off",
      "perfectionist/sort-named-exports": "off",
      "perfectionist/sort-modules": "off",
      // TODO: remove these "warn" rules after autofixing the code base
      "perfectionist/sort-objects": "warn",
      "perfectionist/sort-object-types": "warn",
      "perfectionist/sort-union-types": "warn",
      "perfectionist/sort-interfaces": "warn",
      "perfectionist/sort-intersection-types": "warn",
      "perfectionist/sort-switch-case": "warn",
      "perfectionist/sort-array-includes": "warn",
      "perfectionist/sort-jsx-props": "warn",
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: [
          "./tsconfig.node.json",
          "./tsconfig.app.json",
          "./tsconfig.storybook.json",
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...storybook.configs["flat/recommended"],
]);
