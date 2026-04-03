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
