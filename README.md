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

## Cloudflare Pages

Use these Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Deploy command: `npm run deploy:cloudflare`

Do not use `npx wrangler deploy`. That command targets Cloudflare Workers. This repository is configured for Pages and uses `wrangler pages deploy`.

For GitHub Actions deployments, add these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API token needs Account, Cloudflare Pages, Edit permission. Once both secrets exist, `.github/workflows/cloudflare-pages.yml` deploys every push to `main`.

## GitHub Pages

The existing GitHub Pages workflow remains available. Its production URL is https://meghaboi.github.io/varsity-sports/.
