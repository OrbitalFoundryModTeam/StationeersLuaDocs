# VS Code Extension

The **StationeersLua VS Code extension** connects VS Code to the running game, giving you a full external editing and debugging workflow for Lua (and IC10) chips.

**[Install from VS Code Marketplace →](https://marketplace.visualstudio.com/items?itemName=OrbitalFoundryModdingCrew.stationeers-lua)** · **[Open VSX (VSCodium / VS Code OSS) →](https://open-vsx.org/extension/OrbitalFoundryModdingCrew/stationeers-lua)**

## Installation

Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=OrbitalFoundryModdingCrew.stationeers-lua) or from [Open VSX](https://open-vsx.org/extension/OrbitalFoundryModdingCrew/stationeers-lua) if you use VSCodium or another editor that uses the Open VSX registry.

The extension depends on the [Lua Language Server](https://marketplace.visualstudio.com/items?itemName=sumneko.lua) (sumneko.lua) for IntelliSense and will prompt you to install it if missing.

## Setup

1. Make sure the StationeersLua mod is installed and `EnableExtensionApi` is `true` in the mod config
2. Launch Stationeers and load a world
3. Open your Lua workspace in VS Code
4. Run **StationeersLua: Connect to Game Server** from the command palette
5. Ensure the game exposes chips to the bridge:
   - **Wired:** open the in-game IC editor on a computer and select a chip, **or**
   - **Wireless:** equip a suit with the **Wireless Development Board** connected to a network, with `AllowNetworkChipAccess` enabled in the StationeersLua config (see the [Wireless Development Board](./wireless-dev-board.md) guide)
6. Use the **Chips** sidebar to browse and open chips

You do **not** need the IC editor open when wireless remote access alone is enough — the explorer lists every chip the server reports as accessible.

For the full HTTP route reference (OpenAPI / Swagger), see [Extension REST API (Swagger)](./extension-rest-api).

## Chip Explorer

The extension adds a **StationeersLua** panel to the VS Code activity bar with a **Chips** tree view.

The explorer shows:
- All accessible Lua and IC10 chips, grouped by data cable network
- Library modules as children of their parent chips
- Cross-references for loaded library dependencies
- Inline actions for **Pull**, **Export**, and **Debug** on each chip row

The explorer auto-refreshes metadata in the background (configurable interval). Code is never pulled without an explicit action.

## Editing Workflow

### Opening a Chip

Click a chip in the sidebar to pull its current source into a temporary `.lua` file in VS Code.

### Sync on Save (Draft Mode)

When `syncOnSave` is enabled (default), saving the file updates the **in-game IC editor draft** for the selected chip. This lets you see your changes in the editor without compiling.

Saving does **not** export to the chip.

### Exporting

To compile code onto the chip, use one of:
- The **Export** icon on the chip row in the sidebar
- **StationeersLua: Export Chip to Game** from the command palette

This separation keeps draft editing distinct from chip compilation.

### Pulling

Use the **Pull** icon or **StationeersLua: Pull Code from Chip** to refresh the local file from the chip's current compiled source.

### Conflict Detection

The extension tracks a `source_version` for each chip. When external changes are detected (from the in-game editor, AI editors, or other players):
- If you have **no local modifications**, the remote change is auto-synced silently
- If you have **unsaved local changes**, you're prompted to accept the remote update or keep your local version

## Debugger <Badge type="warning" text="Experimental" />

The VS Code debugger requires `EnableExperimentalDebugger = true` in the `[MCP Server]` config section. When disabled (the default), the Debug button is hidden in the Chip Explorer and all debug endpoints return an error.

::: warning Experimental Feature
The VS Code debugger is experimental and may have bugs. If you encounter issues, please report them on the [Discord server](https://discord.gg/HxvySSu5G3).
:::

The extension includes a full **Debug Adapter Protocol** implementation for Lua chips.

### Capabilities

- **Attach** to running Lua chip runtimes
- **Breakpoints** — line, conditional, hit count, and logpoints
- **Pause / Continue / Step** — step over, step in, step out
- **Stack frames, scopes, and variables** inspection
- **Set variable** values during a paused session
- **Exception handling** — break on all exceptions filter
- **Debug Console** — runtime errors and Lua tracebacks surface inline

### Starting a Debug Session

Use the **Debug** icon on a Lua chip in the Chip Explorer, or create an `attach` launch configuration:

```json
{
  "type": "stationeers-lua",
  "request": "attach",
  "name": "Attach to Lua Chip",
  "chipRefId": 12345,
  "stopOnEntry": false
}
```

::: tip
Debugging is **Lua chips only** — IC10 chips can be opened and exported but not debugged through VS Code.
:::

### Multiplayer

In multiplayer, debug sessions are proxied through the mod's network layer. VS Code connects to your local game client, which routes debug traffic to the authoritative server over mod network messages. This requires `AllowMultiplayerDebugProxy` to be enabled on the server.

## IntelliSense & Language Server

For a **full map** of where intelligence runs (in-game vs VS Code vs optional lua-language-server), see **[Language servers](./language-servers.md)**.

The extension provides two layers of code intelligence that work together:

### Sumneko Lua (General Lua)

When connected to the game, the extension automatically adds its bundled **Lua type stub** files to the Sumneko Lua workspace library. This gives you general-purpose Lua autocomplete, hover docs, type checking, go-to-definition, and refactoring for:

| Stub file | Coverage |
|---|---|
| `stationeers-ic.lua` | Core `ic.*` API — device I/O, batch, slots, memory, stack |
| `stationeers-globals.lua` | Global functions — `sleep`, `yield`, `print`, `device_id`, etc. |
| `stationeers-util.lua` | Utility API — `util.*` functions |
| `stationeers-ss.lua` | ScriptedScreens API (when ScriptedScreens is installed) |

### Stationeers LSP (Game-Specific Intelligence)

When `EnableLspServer` is enabled in the mod config, the extension also connects to a **Stationeers-specific LSP server** running inside the game. This provides live, context-aware intelligence that static stubs cannot:

| Feature | Description |
|---|---|
| Diagnostics | Real-time Lua parse and compile error highlighting |
| Enum completions | `ic.enums.LogicType.` and other `ic.enums.*` tables (including `SorterInstruction`, `ConditionOperation`) trigger member completions with numeric values |
| Constant completions | `ic.const.` triggers all game constants |
| Parameter-aware completions | Second arg of `ic.read()` suggests LogicType members; third arg of `ic.read_slot()` suggests LogicSlotType members |
| `require()` completions | Inside `require("...")`, module names from library chips on the chip's data network are suggested |
| Hover | Enum member and constant values, API signatures and descriptions |
| Signature help | Function parameter highlighting with documentation |

Completions are **scoped to the data network** of the chip being edited — `require()` suggestions only show modules reachable from that chip's network. This works correctly with wired editors, wireless development boards, and combined access.

::: tip
The two language servers complement each other: Sumneko handles general Lua analysis (types, refactoring, unused variables), while the Stationeers LSP provides live game data (actual enum values, available library modules, parse diagnostics from the game's Lua compiler).
:::

## Snippets

The extension ships 23 code snippets for common patterns:

| Prefix | Description |
|---|---|
| `tick` | Tick function skeleton |
| `read` / `write` | Device read/write by pin |
| `readid` / `writeid` | Device read/write by reference ID |
| `batchread` | Batch read pattern |
| `devlist` | Device list iteration |
| `sleep` | Sleep call |
| `require` | Require a library module |
| `module` | Module annotation for library chips |
| `lt` / `lst` / `bm` | LogicType / LogicSlotType / BatchMethod shorthand |
| `httpget` | HTTP GET request |
| `subscribe` / `broadcast` | Network pub/sub |
| `surface` | ScriptedScreens surface setup |
| `sslabel` / `ssbutton` / `sscanvas` / `sslayout` | ScriptedScreens UI elements |
| `sstarget` | ScriptedScreens tablet target |
| `sstemplate` | Full ScriptedScreens template |

## AI Editor MCP Configuration

The **StationeersLua: Configure AI Editor (MCP)** command generates MCP config files so AI editors can connect to the in-game MCP server. Supported editors:

- **Cursor** — writes `.cursor/mcp.json`
- **Windsurf** — writes `~/.codeium/mcp_config.json`
- **Claude Code** — writes `.mcp.json`
- **VS Code Copilot** — writes `.vscode/mcp.json`

## Commands

| Command | Description |
|---|---|
| Connect to Game Server | Establish connection to the StationeersLua HTTP server |
| Disconnect from Game Server | Drop the active connection |
| Refresh Chip Explorer | Force-refresh the chip tree |
| Open Chip | Pull a chip's source into a local temp file |
| Export Chip to Game | Compile and export local source to the chip |
| Pull Code from Chip | Refresh local file from the chip's compiled source |
| Debug Chip | Attach the VS Code debugger to a Lua chip |
| Configure AI Editor (MCP) | Generate MCP config for supported AI editors |

## Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `stationeers-lua.gameServerUrl` | string | `http://127.0.0.1:3030` | Base URL for the in-game HTTP server |
| `stationeers-lua.syncOnSave` | boolean | `true` | Sync the in-game editor draft on save |
| `stationeers-lua.autoRefreshChipExplorer` | boolean | `true` | Auto-poll chip explorer metadata |
| `stationeers-lua.chipExplorerRefreshIntervalMs` | number | `5000` | Poll interval in ms (1000–60000) |
| `stationeers-lua.lspPort` | number | `3031` | TCP port for the Stationeers LSP server (must match `LspPort` in mod config) |

## Status Bar

The extension adds a status bar item showing the current connection state. Click it to connect or reconnect.

When connected:

- **IC editor open with a selected chip** — shows the holder label from the game (what you see in the in-game dropdown) and a tooltip that includes the chip `ref` when the game provides one.
- **Wireless-only remote access** (`wireless_remote_access_only` from the game) — shows **Wireless link**; the tooltip names the remote data network and explains that there is no IC editor selection — pick chips from the explorer.
- **IC editor open but no holder label** — **Editor Open**.
- **Otherwise** — **No Editor** (no bridge context yet).

The tooltip does not show a bogus `ref null` line when no chip ref is available.
