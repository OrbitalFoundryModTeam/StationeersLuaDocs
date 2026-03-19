# MCP Server & AI Editor Integration

StationeersLua includes a built-in **Model Context Protocol (MCP)** server that exposes game state, chip discovery, code read/write, and debug surfaces to AI-aware editors such as Cursor, Windsurf, and other MCP clients.

## How It Works

The HTTP listener runs locally inside your game client (default port `3030`). It exposes two independent surfaces on the same port:

- **MCP JSON-RPC** — for AI editors (Cursor, Windsurf, Claude Code, etc.)
- **Extension REST** — for the VS Code extension (chip browsing, code sync, debugger attach)

Each surface is enabled independently via its own config toggle. Both share the same port.

## MCP Tools

| Tool                   | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `get_editor_state`     | Query the current in-game editor selection, network scope, and chip list |
| `get_editor_code`      | Read the live IC editor draft text (not the compiled chip source)        |
| `set_editor_code`      | Update the IC editor draft — does **not** compile or export to the chip  |
| `list_chips`           | Enumerate accessible Lua chips on the current data network(s)            |
| `get_chip_code`        | Read a chip's current source by ref ID                                   |
| `set_chip_code`        | Write source to a chip by ref ID — compiles and exports immediately      |
| `get_chip_errors`      | Retrieve error details for chips with debugger authority                 |
| `list_library_modules` | List library chip modules visible on the current network(s)              |
| `get_network_devices`  | Enumerate devices on the current data network                            |
| `get_game_state`       | Query world name, time, and other top-level game state                   |
| `search_docs`          | Full-text search across all embedded documentation resources             |

::: tip `set_editor_code` vs `set_chip_code`
`set_editor_code` updates what is displayed in the in-game IC editor without compiling or exporting. Use it when you want to stage a change for the player to review. `set_chip_code` writes directly to the chip and compiles immediately — equivalent to pressing Export in the editor.
:::

## MCP Resources

The server exposes the following resources that AI editors can read for context:

| URI                             | Content                                      |
| ------------------------------- | -------------------------------------------- |
| `stationeers://lua/readme`      | MCP server README and recommended workflow   |
| `stationeers://lua/guide`       | Full StationeersLua scripting guide          |
| `stationeers://lua/migration`   | IC10 to Lua instruction-by-instruction guide |
| `stationeers://lua/api/logic`   | Logic read/write and batch API reference     |
| `stationeers://lua/api/device`  | Device discovery and slot API reference      |
| `stationeers://lua/api/memory`  | Chip memory API reference                    |
| `stationeers://lua/api/network` | Inter-chip networking API reference          |
| `stationeers://lua/api/http`    | HTTP request API reference                   |
| `stationeers://lua/api/utility` | Utility functions reference                  |
| `stationeers://lua/api/events`  | Event system reference                       |
| `stationeers://lua/api/library` | Library chip / `require()` reference         |

The `stationeers://lua/readme` text is also provided as `initialize.result.instructions` so MCP clients display it automatically when the server is selected.

## Configuration

All settings live in the StationeersLua config file under `[MCP Server]`:

| Setting                                       | Default | Description                                                                                                                                                                                                                                  |
| --------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Enabled`                                     | `false` | Enable the MCP JSON-RPC surface for AI editors                                                                                                                                                                                               |
| `EnableExtensionApi`                          | `false` | Enable the REST surface for the VS Code extension — can be used without enabling `Enabled`                                                                                                                                                   |
| `Port`                                        | `3030`  | Shared HTTP listener port for both surfaces                                                                                                                                                                                                  |
| `AllowRemoteConnections`                      | `false` | Bind to all interfaces instead of localhost only                                                                                                                                                                                             |
| `AllowNetworkChipAccess`                      | `false` | Master toggle for network-wide chip access. When disabled, both MCP and the VS Code extension stay single-chip scoped.                                                                                                                       |
| `AllowNetworkChipAccessOnlyForWirelessBoards` | `true`  | When network access is enabled, keep the normal IC editor single-chip scoped and allow only the Wireless Development Board to expose full network scope. Set to `false` to let the normal wired IC editor expose its whole data network too. |
| `AllowMultiplayerDebugProxy`                  | `false` | Allow multiplayer clients to proxy VS Code debugger traffic to the authoritative server over in-game mod network messages                                                                                                                    |

The HTTP listener only starts if at least one of `Enabled` or `EnableExtensionApi` is `true`.

### Network Access Mode Defaults

- By default, `AllowNetworkChipAccess = false`, so **network-wide chip access is disabled everywhere**.
- If you enable `AllowNetworkChipAccess` and leave the new default `AllowNetworkChipAccessOnlyForWirelessBoards = true`, the **normal IC editor stays single-chip scoped** and only the **Wireless Development Board** gets full remote network scope.
- If you want the older behavior where opening a normal IC editor also exposes the whole wired data network, set `AllowNetworkChipAccessOnlyForWirelessBoards = false`.

::: warning Dedicated Servers
Dedicated servers **never** start the local HTTP listener. In multiplayer, the listener runs in each non-dedicated game client. The VS Code debugger's multiplayer path proxies debug traffic to the authoritative server over in-game mod network messages — it does not expose the HTTP listener remotely.
:::

## Wireless Development Board & IC Editor Integration

When a player has the **Wireless Development Board** installed in their equipped EVA suit and connected to a wireless network:

- With `AllowNetworkChipAccess = true`, the MCP server and VS Code chip explorer can use the wireless board as a **remote network-scoped development context**
- With the default `AllowNetworkChipAccessOnlyForWirelessBoards = true`, opening a normal IC editor still exposes **only the currently selected chip**, while the wireless board exposes the chips on its selected wireless data network
- If you set `AllowNetworkChipAccessOnlyForWirelessBoards = false`, the normal IC editor also expands to its full wired data network and MCP/REST tools can operate across both the wired editor network and the wireless suit-board network simultaneously
- The **in-game IC editor motherboard dropdown** is still extended to include chip targets from the connected wireless network — a laptop or computer running an IC editor board can browse and select remote wireless chips without physically wiring to them

::: tip
This requires `AllowNetworkChipAccess` to be enabled. The wireless board also has an internal `MotherboardLuaDebugger` slot — install a debugger motherboard there to enable wireless chip error inspection and VS Code debug sessions on the wireless network.
:::

## In-Game Lua Reference Panel

The IC10 editor's built-in help buttons (**f**, **x**, **s(x)**) are replaced with a searchable Lua API reference panel when the Lua formatter is active.

- **Functions** — All `ic.*`, global, and utility functions with signatures and descriptions
- **Logic Variables** — `LT.*` enum values
- **Slot Variables** — `LST.*` enum values
- **IC10 Migration** — Side-by-side IC10 → Lua translation reference

When ScriptedScreens is also installed, its API sections (surface, element, canvas, layout, etc.) are appended to the panel automatically via cross-mod reflection.

Reference data is shipped as bilingual embedded XML assets (`LuaReference_EN.xml`, `LuaReference_RU.xml`) and loaded based on the game's current language.
