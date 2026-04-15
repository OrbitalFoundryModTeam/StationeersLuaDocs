# Language servers & editor intelligence

How **Stationeers-specific** help and **general Lua** (`lua-language-server`) combine in different places.

## In-game IC10Editor

| Source | What it does |
|--------|----------------|
| **`LuaLanguageService`** (always) | In-process: Stationeers API completions, hover, diagnostics, format — no extra install. |
| **Optional `lua-language-server` binary** | When configured, the mod **spawns** it as a **stdio LSP subprocess** (StationeersIC10Editor’s `LspClientStdio`) and merges **completions**, **signature help** at `(` / `,`, **hover** (fallback when the built-in hover is empty), **`textDocument/publishDiagnostics`** (squiggles on tokens), and **`textDocument/semanticTokens/full`** (syntax coloring, debounced ~400ms after you stop typing) with `LuaLanguageService`. On mod unload the client sends **`textDocument/didClose`**. |

### Configure external Lua LS for the in-game editor

All keys are in **`[MCP Server]`** (same BepInEx section as the HTTP bridge / TCP LSP toggles):

1. Download a **lua-language-server** build for your OS from **[LuaLS releases](https://github.com/LuaLS/lua-language-server/releases)** (extract the archive).
2. Set **`ExternalLuaLanguageServerPath`** to the **full path** of the executable, for example:
   - Windows: `C:\Tools\lua-language-server\bin\lua-language-server.exe`
   - Linux: `/home/you/.local/bin/lua-language-server`
3. Leave **`ExternalLuaLanguageServerArguments`** empty unless your build needs extra flags (default stdio mode).
4. Restart the game (or reload the mod) so the process can start the first time you open autocomplete in a Lua chip.

The mod uses a small workspace under **`%LocalAppData%\StationeersLua\lua_ls_workspace\`** (a `chip-draft.lua` URI) so Lua LS has a root folder.

**Lua version:** Lua LS defaults to **Lua 5.5** semantics. StationeersLua runs **Lua 5.2**, so you should add a **`.luarc.json`** in that same folder (next to the virtual `chip-draft.lua` workspace) so generic analysis matches the game, for example:

```json
{
  "$schema": "https://raw.githubusercontent.com/LuaLS/vscode-lua/master/setting/schema.json",
  "runtime.version": "Lua 5.2"
}
```

In `.luarc.json`, settings use the short keys (no `Lua.` prefix). Optionally add **`workspace.library`** entries pointing at the Stationeers stub `.lua` files (same ones the VS Code extension ships) so `ic.*` and friends are not flagged as undefined globals.

**Notes**

- First autocomplete after a change can take a moment while the subprocess initializes and syncs the buffer.
- Dedicated / batch servers do not start the external LS.
- If the path is wrong, the mod logs a warning once and skips the external client.
- **Squiggles** only apply while your buffer matches the last text synced to Lua LS; typing clears external errors until the next sync/diagnostic round.

---

## TCP: game as **server** (Stationeers LSP for VS Code, etc.)

`[MCP Server] EnableLspServer` / `LspPort` start a **TCP listener inside the game**. External programs connect **in** to the mod’s **Stationeers** LSP server — **not** the same thing as `ExternalLuaLanguageServerPath` (which runs **out-of-process** general Lua LS **for** the in-game editor).

1. **`EnableLspServer = true`**, **`LspPort`** (e.g. **3031**, not the HTTP **3030** port).
2. VS Code: **`stationeers-lua.lspPort`** matches **`LspPort`**, extension connected to the game.

Details: **[VS Code Extension](./vscode-extension.md)** → *IntelliSense & Language Server*.

---

## “Stacked” in VS Code (Sumneko + Stationeers TCP)

| Layer | Role |
|-------|------|
| **Sumneko Lua** | Runs **lua-language-server** for normal Lua in the editor. |
| **Stationeers LSP** | TCP client to the game when `EnableLspServer` is on. |

That stack is **desktop-only**. The in-game path uses **`LuaLanguageService` + optional `ExternalLuaLanguageServerPath`** instead of Sumneko.

---

## Other desktop editors

Run **lua-language-server** from upstream and point your editor at it. Add Stationeers API stubs with **`workspace.library`** pointing at the **`library/`** folder shipped inside the **[Stationeers Lua VS Code extension](https://marketplace.visualstudio.com/items?itemName=OrbitalFoundryModdingCrew.stationeers-lua)** install (on disk, under your editor’s extensions directory, for example `%USERPROFILE%\.vscode\extensions\orbitalfoundrymoddingcrew.stationeers-lua-*\library\` on Windows, or the same path under **`.cursor\extensions\`** if you use Cursor). If your checkout includes the extension sources next to these docs, the stubs live at **`StationeersLua-VSCode/library/`**. Attaching **also** to the game’s Stationeers TCP LSP depends on your editor supporting two Lua LSP clients.

---

## ScriptedScreens git branch `lsp`

The **ScriptedScreens** repo’s **`lsp`** branch does not add a language server; **`scriptedvisor`** supersedes it.

---

## Mod config reference

| Setting | Section | Purpose |
|---------|---------|---------|
| `EnableLspServer` | `[MCP Server]` | TCP listener for **external** Stationeers LSP clients (VS Code). |
| `LspPort` | `[MCP Server]` | TCP port (default **3031**). |
| `ExternalLuaLanguageServerPath` | `[MCP Server]` | Full path to **lua-language-server** for **in-game** merged completions, signature help, hover fallback, diagnostics, semantic tokens; empty = off. |
| `ExternalLuaLanguageServerArguments` | `[MCP Server]` | Optional extra CLI args for that executable. |

See **[MCP Server & Reference Panel](./mcp-server.md)** for HTTP/MCP and the reference panel.
