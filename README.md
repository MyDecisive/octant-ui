# MyDecisive Octant UI

React + TypeScript + Vite frontend for Octant.

## Local Development

Requirements:

- Node.js 22+ (or current LTS)
- npm

Install dependencies:

```bash
npm i
```

By default, the app talks to the API through `/api`.

In the cluster, Nginx proxies `/api` to the gateway.

In local Vite development, the dev server also proxies `/api` to `http://localhost:8081`.

If you need a different backend URL, override `VITE_API_BASE_URL` in `.env`. Example:

```bash
VITE_API_BASE_URL=/api
```

Start the dev server:

```bash
npm run dev
```

Preview the production build locally:

```bash
npm run preview -- --host 0.0.0.0
```

## Storybook

Storybook is configured for local component development and documentation.

Run Storybook locally:

```bash
npm run storybook
```

Build the static Storybook site:

```bash
npm run build-storybook
```

Where to add stories:

- Keep Storybook stories under `src/stories/`
- Import real app components into stories from there instead of colocating story files next to components

Storybook styling:

- `.storybook/preview.tsx` applies the app theme, `CssBaseline`, and global CSS
- Stories should render against the same MUI theme as the app by default

Production/build isolation:

- `npm run build` does not invoke Storybook
- Storybook packages live in `devDependencies`
- Vite only bundles modules reachable from `src/main.tsx`, so stories are not included in the production app unless they are imported by app code
- `tsconfig.app.json` explicitly excludes `src/stories` and `*.stories.*` files so the app typecheck/build path does not process Storybook stories
- `tsconfig.storybook.json` exists to cover Storybook and story files separately

Typical workflow:

```bash
npm install
npm run storybook
```

If you want to verify Storybook compiles in CI or before merging:

```bash
npm run build-storybook
```

## Kubernetes (Minimal)

At a minimum, you need:

- A `Deployment` running the `octant-ui` image
- A `Service` exposing port `8080`

### kind (cluster: `mdai-labs`, namespace: `mdai`)

Build image, load into kind, deploy manifests:

```sh
npm run local-all
```

Access locally:

```bash
kubectl port-forward -n mdai service/octant-ui 8080:8080
```

## Troubleshooting

If Docker security scans report vulnerabilities:

- Rebuild with `docker build --pull ...`
- Keep the base images updated
- Re-scan after rebuilding

## Deploying to gh pages

- Run `npm install`
- Run `npm run deploy`
- Navigate to https://mydecisive.github.io/octant-ui/
