# MyDecisive InkOps UI

React + TypeScript + Vite frontend for InkOps.

## Local Development

Requirements:

- Node.js 22+ (or current LTS)
- npm

Install dependencies:

```bash
npm i
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

- A `Deployment` running the `inkops-ui` image
- A `Service` exposing port `8080`

### kind (cluster: `mdai-labs`, namespace: `mdai`)

Build the image:

```bash
docker build --pull -t inkops-ui:local .
```

Load into kind:

```bash
kind load docker-image inkops-ui:local --name mdai-labs
```

Apply manifests:

```bash
kubectl apply -n mdai -f k8s/deployment.yaml
kubectl apply -n mdai -f k8s/service.yaml
```

Access locally:

```bash
kubectl port-forward -n mdai service/inkops-ui 8080:8080
```

## Troubleshooting

If Docker security scans report vulnerabilities:

- Rebuild with `docker build --pull ...`
- Keep the base images updated
- Re-scan after rebuilding
