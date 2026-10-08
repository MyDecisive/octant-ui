## Branching & Workflow

- Branch off `main` for all work.
- Branch names should be namespaced with your github user initials, followed by the Jira ticket designation your work best belongs to. For example: `dj/ENG-954-add-dashboard-widget`, `sp/ENG-23-nav-overflow`
- Keep commits focused and atomic. Write clear commit messages.
- Open a pull request against `main`. PR descriptions should be included per the [pull request template](https://github.com/MyDecisive/changelogs/blob/main/.github/PULL_REQUEST_TEMPLATE.md). Pull request titles must conform to the pattern specified to the organization's [semantic PR title rules](https://github.com/MyDecisive/changelogs/blob/main/.github/workflows/reusable-semantic-pr-title.yaml).

## Code Style

Code should be easy to reason about.

Prefer importing via aliases over relative imports. e.g. `import { ROUTES } from "@constants/routing";` See vite.config.ts or tsconfig.app.json for list of aliases. Add to both as needed. Update prettierrc rules when aliases change.

Wherever possible, functions should be pure. Use descriptive names for functions.

User facing strings should go in `src/copy` and be provided by Product/Marketing.

Extract "magic strings" or "magic numbers" into constants with meaningful names.

Avoid nested ternaries.

This project uses ESLint (see `eslint.config.js`). Run the linter before pushing:

```bash
npm run lint
npm run lint:styles
```

If you choose not to format with your IDE via `prettier`, you can format from the command line via `npx prettier --write .`

### Conventions

Follow typical JavaScript/TypeScript naming and casing conventions.

Interfaces, Types, and Components will be in PascalCase.

Functions are in camelCase.

Constants are in SCREAMING_SNAKE_CASE. Constants declared in Objects for purpose of enums should have properties in SCREAMING_SNAKE_CASE.

Component names:

- Top level Page components should end in `Page`
- Context providers end in `Provider`
- Components intended for reuse that opinionate a basic component should indicate the thing they wrap. e.g. `CompactCard`, `NextButton`, `SearchField`, etc.

Function names:

- Functions that get values from objects or payloads should begin with the prefix `get`. e.g. `getStringEnv`, `getErrorOrHelperText`
- Functions that transform from one type to another or one data shape to another should conform to the pattern `typeAToTypeB`. e.g. `connectionStatusToHealthWidgetProps`
- Factory functions should begin with the `make` prefix.
- Functions that create objects either to initialize defaults or combine multiple arguments into a single object should begin with the prefix `create`.

### TypeScript

- Prefer explicit types over `any`. Use `unknown` when the type is genuinely uncertain.
- Use interfaces for object shapes; use `type` aliases for unions, intersections, and utility types.
- Avoid non-null assertions (`!`) unless the value's presence is guaranteed by surrounding logic.
- Export types alongside the components or utilities that use them.
- When types are needed by multiple functions or components, relocate them to the appropriate types file in `src/types`.
- Do not use string unions or enums. Instead, create a TS `const` and the `ValueOf` utility. For example:

```ts
// src/constants/enums.ts
export const ASYNC_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

// src/types/enums.ts
export type AsyncStatus = ValueOf<typeof ASYNC_STATUS>;
```

### React Components

- Write functional components with hooks; avoid class components.
- Keep components small and focused on a single responsibility. Extract shared logic into custom hooks.
- Use named exports for components; use default exports sparingly.
- Component files should be named with PascalCase matching the named component they contain.
- Components used in multiple places should be located in `src/components/`

### Styling

- Scope styles to their component to avoid unintended side effects. Component style files should be named to match the component they apply to. See existing style files for examples.
- Avoid inline styles or the MUI `sx` prop.
- Class names should be descriptive and follow a consistent convention along the pattern of `component-name-element-role`. e.g. `code-snippet-container`, `code-snippet-copy-button`, etc.
- Prefer SCSS custom properties (`src/styles/_tokens.scss`) for colors, spacing, and typography to maintain consistency.
- SCSS is a recent addition to the repository. New style files should be in that format. Existing .css files will be converted as part of a tech debt work item.

## Pull Request Guidelines

- Ensure `npm run lint`, `npm run lint:styles`, and `npm test` pass locally before requesting review.
- Keep PRs focused — one logical change per PR makes review easier.
- Respond to review feedback promptly; mark resolved threads once addressed.
- Squash or clean up fixup commits before merge if requested.

## Repository organization

```bash
src
├── assets              # media resources used in the application
├── components          # opinionated/wrapped versions of MUI components OR components extracting a common pattern as well as their associated style files, if any. components should be use-agnostic.
│   ├── formInputs      # opinionated form input components and their associated style files, if any
│   ├── layout          # components that extract common layout patterns for simpler use elsewhere
│   ├── Component.tsx   # Example component filename
│   ├── Component.scss   # Example component style filename
│   └── Component       # if a component requires more than the above two files, put it in its own directory with the same name e.g. src/components/Table
├── constants           # files named for a general domain (e.g. routing) with exports in SCREAMING_SNAKE_CASE with values to direct or indicate behavior, but not to be user-facing
├── contexts            # contexts, typically for a store dependent on OctantStore information, and their providers
├── copy                # user facing strings. organization should follow the `pages` pattern
├── fieldValidation     # utility functions for validating form fields
├── pages               # page components that represent one route in the application
│   ├── Page.tsx        # Example page filename
│   ├── Page.scss        # Example page style filename
│   └── Page            # if a page requires more than the above two files, put it in its own directory with the same name e.g. src/pages/Clarity
├── services            # utilities for connecting with the Octant API services
│   └── mockData        # utilities for mocking Octant API services
├── store               # zustand store declarations
├── stories             # storybook stories for components in this repository
├── styles              # root css file, custom MUI theme broken up by top level theme key
│   └── components      # theme overrides per component
├── types               # typescript types per domain
├── utils               # collection of reused helper functions. Each file exports one helper function or a collection of thematically similar functions.
└── hooks               # custom hooks that are used in multiple places. custom hooks that are used by one consumer should be colocated in that consumer's directory.
```

For components or pages, colocate shared code in the same directory as the components or functions sharing the code. However, if the shared code is needed elsewhere in the application, elevate it to an appropriate location in the repository. If two components in the same folder using a common function, just keep that function in that folder. But if/when it needs to be used elsewhere, pull it out into utils.
Or if it's a type or constant, move to the appropriate place.

Unit tests should be located in a directory under a \_\_tests\_\_ folder, e.g. services/mockData/\_\_tests\_\_.
