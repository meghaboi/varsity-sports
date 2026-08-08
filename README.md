# Varsity Sports — Volunteer Recruitment Site

Mobile-first, black/gold/white site: an animated hero landing page and a
volunteer application form.

## Stack
- Vite + React + react-router-dom
- `ogl` for the WebGL hero animation (`src/components/AcidSquares.jsx`)
- Formspree for form → email delivery (no backend needed)
- GitHub Actions → GitHub Pages for deployment

## Local dev
```bash
npm install
npm run dev
```

## Email setup (change the recipient any time)
Applications are sent via [Formspree](https://formspree.io):
1. Create a free Formspree account and a new form, using `meghanadh.pamidi@gmail.com`
   as the destination address.
2. Copy the form ID (the part after `/f/` in your endpoint URL) into
   `src/config.js` → `FORMSPREE_FORM_ID`.
3. To change the recipient later, just update the address on the form in
   your Formspree dashboard — no code changes needed.

## Logo
Drop your logo file as `public/logo.png` (already present in this repo per
your note — just make sure the filename matches, or update the `src` in
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
