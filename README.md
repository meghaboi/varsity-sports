# Varsity Sports Member Recruitment Site

Mobile-first, black/gold/white site: an animated hero landing page and a
member application form.

## Stack
- Vite + React + react-router-dom
- `ogl` for the WebGL hero animation (`src/components/AcidSquares.jsx`)
- SplitForms (splitforms.com) for form → email delivery & dashboard storage (no backend needed)
- GitHub Actions → GitHub Pages for deployment

## Local dev
```bash
npm install
npm run dev
```

## Form Backend (SplitForms)
Applications are sent via [SplitForms](https://splitforms.com):
- Endpoint: `https://splitforms.com/api/submit`
- Access key: configured in `src/config.js` (`SPLITFORMS_ACCESS_KEY`).
- Each submission is stored in the SplitForms dashboard and emailed directly to your inbox.

## Logo
Drop your logo file as `public/logo.png` (already present in this repo per
your note. Make sure the filename matches, or update the `src` in
`src/pages/Home.jsx` / `index.html`).

## Push to GitHub
```bash
git init
git branch -M main
git remote add origin https://github.com/meghaboi/varsity-sports.git
git add .
git commit -m "Initial Varsity Sports site"
git push -u origin main
```

## Enable GitHub Pages
In the repo on GitHub: **Settings → Pages → Source → GitHub Actions**.
The included workflow (`.github/workflows/deploy.yml`) builds and deploys
automatically on every push to `main`.

Once it runs, the site will be live at:
**https://meghaboi.github.io/varsity-sports/**
