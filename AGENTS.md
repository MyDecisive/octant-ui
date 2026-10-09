# MyDecisive Octant UI

User interface for MyDecisive.ai's platform

## Project stack:

React 19 with the React Compiler, MUI 7, zustand, wouter, Connect RPC, Vitest, Storybook.

## Environment Setup

```bash
npm i
```

### Local development

Confirm `VITE_USE_MOCKS` environment variable to "true" to develop against mock services. Othwerwise, set it inline when using the command below.

Then

```bash
npm run dev
```

### Storybook development

```bash
npm run storybook
```

### Testing

The `test` script in package.json runs in watch mode by default. To perform a single run without watch mode against specific test files use the following command:

```bash
npx vitest run <test files>
```

### Linting

The `lint` and `lint:styles` scripts in package.json run against the whole repository. To lint specific files use the following commands:

```bash
npx eslint <files>
npx stylelint <scss files>
```

## Code style

Write code according to @CONTRIBUTING.md

## Code Practices

Keep the scope of your code as narrow as possible in regards to the prompt you are given. If you notice tangential tasks, such as existing code that violates conventions, in your work, note them in your post work summary and offer to insert TODO comments into the code at those points.

Before calling work done, verify by running `npx eslint <modified files>`, `npx stylelint <modified scss files>` (if applicable), and `npx vitest run <related test files>`. Resolve any issues from these three commands before submitting work for review.

Only create component stories when directed.

## Permissions

### Allowed without prompting

- Read files, list directories
- Single file linting, type checking, formatting
- Unit tests on specific files

### Require approval first

- Package installations (`npm install XXXX`)
- Git operations (`git push`, `git commit`)
- Delete files that were not created during the same task.
- Running full build

### Never, under any circumstances

- Modify these files or files in these directories: `.env`, `dist/`, `deployment/`, `storybook-static/`, `.github/`, `.storybook/`, `demo/`, `Makefile`, `Dockerfile`, `LICENSE`
- Directly modify files in `node_modules/`
