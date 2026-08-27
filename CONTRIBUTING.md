## Branching & Workflow

- Branch off `main` for all work.
- Branch names should be namespaced with your github user initials, followed by the Jira ticket designation your work best belongs to. For example: `dj/ENG-954-add-dashboard-widget`, `sp/ENG-23-nav-overflow`
- Keep commits focused and atomic. Write clear commit messages.
- Open a pull request against `main`. PR descriptions should be included per the pull request template.

## Code Style

This project uses ESLint (see `eslint.config.js`). Run the linter before pushing:

```bash
npm run lint
```

### TypeScript

- Prefer explicit types over `any`. Use `unknown` when the type is genuinely uncertain.
- Use interfaces for object shapes; use `type` aliases for unions, intersections, and utility types.
- Avoid non-null assertions (`!`) unless the value's presence is guaranteed by surrounding logic.
- Export types alongside the components or utilities that use them.
- When types are needed by multiple functions or components, relocate them to `src/types.ts`.

### React Components

- Write functional components with hooks; avoid class components.
- Keep components small and focused on a single responsibility. Extract shared logic into custom hooks.
- Use named exports for components; use default exports sparingly.
- Component files should be named with CamelCase matching the named component they contain.
- Components used in multiple places should be located in `src/components/`
- Components only used by a single flow should be in that flow's subdirectory in `src/flows/`. See existing file structure for examples.

### Styling

- Scope styles to their component to avoid unintended side effects. Component style files should be named to match the component they apply to. See existing style files for examples.
- Prefer SCSS custom properties (variables) for colors, spacing, and typography to maintain consistency.
- Avoid inline styles
- Class names should be descriptive and follow a consistent convention.

## Pull Request Guidelines

- Ensure `npm run lint` and `npm test` pass locally before requesting review.
- Keep PRs focused — one logical change per PR makes review easier.
- Respond to review feedback promptly; mark resolved threads once addressed.
- Squash or clean up fixup commits before merge if requested.

### Repository organization

```bash
src
├── assets              # media resources used in the application
├── components          # opinionated/wrapped versions of MUI components OR components extracting a common pattern as well as their associated style files, if any. components should be use-agnostic.
│   ├── formInputs      # opinionated form input components and their associated style files, if any
│   ├── layout          # components that extract common layout patterns for simpler use elsewhere
│   ├── Component.tsx   # Example component filename
│   ├── Component.css   # Example component style filename
│   └── Component       # if a component requires more than the above two files, put it in its own directory with the same name e.g. src/components/Table
├── constants           # files named for a general domain (e.g. routing) with exports in SCREAMING_SNAKE_CASE with values to direct or indicate behavior, but not to be user-facing
├── contexts            # contexts, typically for a store dependent on OctantStore information, and their providers
├── copy                # user facing strings. organization should follow the `pages` pattern
├── fieldValidation     # utility functions for validating form fields
├── pages               # page components that represent one route in the application
│   ├── Page.tsx        # Example page filename
│   ├── Page.css        # Example page style filename
│   └── Page            # if a page requires more than the above two files, put it in its own directory with the same name e.g. src/pages/Clarity
├── services            # utilities for connecting with the Octant API services
│   └── mockData        # utilities for mocking Octant API services
├── store               # zustand store declarations
├── stories             # storybook stories for components in this repository
├── styles              # root css file, custom MUI theme broken up by top level theme key
│   └── components      # theme overrides per component
├── types               # typescript types per domain
├── utils               # collection of reused helper functions. Each file exports one helper function
└── hooks               # custom hooks that are used in multiple places. custom hooks that are used by one consumer should be colocated in that consumer's directory.
```

For components or pages, colocate shared code in the same directory as the components or functions sharing the code. However, if the shared code is needed elsewhere in the application, elevate it to an appropriate location in the repository. If two components in the same folder using a common function, just keep that function in that folder. But if/when it needs to be used elsewhere, pull it out into utils.
Or if it's a type or constant, move to the appropriate place.

Unit tests should be located in a directory under a \_\_tests\_\_ folder, e.g. services/mockData/\_\_tests\_\_.
