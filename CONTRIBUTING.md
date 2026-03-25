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

### CSS

- Scope styles to their component to avoid unintended side effects. Component style files should be named to match the component they apply to. See existing css files for examples.
- Prefer CSS custom properties (variables) for colors, spacing, and typography to maintain consistency.
- Avoid inline styles except for values that are truly dynamic.
- Class names should be descriptive and follow a consistent convention.

## Pull Request Guidelines

- Ensure `npm run lint` and `npm test` pass locally before requesting review.
- Keep PRs focused — one logical change per PR makes review easier.
- Respond to review feedback promptly; mark resolved threads once addressed.
- Squash or clean up fixup commits before merge if requested.
