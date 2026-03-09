# StationeersLua Documentation

Documentation site for [StationeersLua](https://github.com/orbitalfoundrymodteam/StationeersLua) — Lua scripting for Stationeers programmable chips.

Built with [VitePress](https://vitepress.dev/).

## Local Development

```bash
npm install
npm run docs:dev
```

## Build

```bash
npm run docs:build
npm run docs:preview
```

## Deploy

Push to `main` — GitHub Actions will automatically build and deploy to GitHub Pages.

### GitHub Pages Setup

1. Go to **Settings → Pages** in your GitHub repo
2. Set **Source** to **GitHub Actions**
3. Push to `main` and the workflow will deploy automatically

### Update `base` URL

In `docs/.vitepress/config.mts`, update the `base` field to match your GitHub repo name:

```ts
base: '/StationeersLuaDocs/',
```
