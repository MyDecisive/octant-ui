import type { Components } from "@mui/material/styles";

// TODO: move to appropriate location in the types dir after all refactor PRs have been merged

/**
 * helper for component overrides for custom theme
 */
export type ComponentOverride<K extends keyof Components> = Components[K];
