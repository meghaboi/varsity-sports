# Varsity Sports

The Varsity Sports member website, built with Vite and React.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Cloudflare Workers

The site is deployed as a Cloudflare Worker with Static Assets. Use these settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Deploy command: `npm run deploy:cloudflare`

The deploy script runs `wrangler deploy`. The `assets.directory` setting in `wrangler.jsonc` publishes the contents of `dist` and serves the React site with SPA fallback handling.

For GitHub Actions deployments, add these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API token needs Account, Workers Scripts, Edit permission. Once both secrets exist, `.github/workflows/cloudflare-workers.yml` deploys every push to `main`.

## GitHub Pages

The existing GitHub Pages workflow remains available. Its production URL is https://meghaboi.github.io/varsity-sports/.
