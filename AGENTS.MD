# StationeersLuaDocs - Agent guide

VitePress static site for [StationeersLua](https://github.com/orbitalfoundrymodteam/StationeersLua) documentation.

## Build

```bat
cd StationeersLuaDocs
npm install
npm run docs:dev      # local preview
npm run docs:build    # output: docs/.vitepress/dist
```

Deploy: push to `master` → GitHub Actions → GitHub Pages at `https://orbitalfoundrymodteam.github.io/StationeersLuaDocs/` (`base: '/StationeersLuaDocs/'` in `docs/.vitepress/config.mts`).

## Content layout

| Path | Purpose |
|------|---------|
| `docs/guide/` | Narrative docs (installation, VS Code, MCP, debugging) |
| `docs/api/` | In-game **Lua chip API** reference (`ic.*`, not HTTP REST) |
| `docs/examples/` | Example walkthroughs |
| `docs/public/` | Static assets copied to site root (logo, favicon, OpenAPI spec) |

## Extension REST API (Swagger)

Documents the **VS Code extension HTTP API** (`/api/*` on port 3030), not `ic.http`.

| File | Role |
|------|------|
| `docs/public/openapi/extension-api.yaml` | OpenAPI 3.0 spec (source of truth for published docs) |
| `docs/guide/extension-rest-api.md` | Guide page + embedded Swagger UI |
| `docs/.vitepress/theme/components/SwaggerUI.vue` | VitePress component (`swagger-ui-dist`) |
| `docs/.vitepress/theme/swagger-dark.css` | Dark-mode overrides for Swagger UI (no invert filter) |

**Keep in sync with:** `StationeersLuaFinal/McpServer/McpHttpListener.cs` (routes) and `StationeersLua-VSCode/src/gameClient.ts` (TypeScript types).

**Note:** Swagger UI is reference-only (`tryItOutEnabled: false`). Use the VS Code extension for live requests. The OpenAPI spec omits `info.contact` and `servers` (no private repo link, no server dropdown); base URL is documented on the guide page above the embed.

## Related repos

- `StationeersLuaFinal/` - mod source; MCP/REST server implementation
- `StationeersLua-VSCode/` - extension REST client
- `ScriptedScreensDocs/` - same VitePress layout for ScriptedScreens

## Branches

- **`master`** - live site (GitHub Pages).
- **`1.0`** - 1.0-line docs. Merged from `master` on 2026-07-13 (`480d6cd`: Swagger embed, Extension REST API guide, dark-mode CSS).
