# MCP Server & AI Editor Integration

StationeersLua includes a built-in **Model Context Protocol (MCP)** server that exposes game state, chip discovery, code read/write, and debug surfaces to AI-aware editors such as Cursor, Windsurf, and other MCP clients.

## How It Works

The HTTP listener runs locally inside your game client (default port `3030`). It exposes two independent surfaces on the same port:

- **MCP JSON-RPC** — for AI editors (Cursor, Windsurf, Claude Code, etc.)
- **Extension REST** — for the VS Code extension (chip browsing, code sync, debugger attach)

Each surface is enabled independently via its own config toggle. Both share the same port.

## Companion mods (`LuaMcpRegistry`)

LaunchPad mods that reference **only** the released **`StationeersLua.dll`** can register extra MCP **documentation** (lazy Markdown URIs) and **tools** from `OnLoaded` via **`StationeersLua.LuaMcpRegistry`**, the same public pattern as **`LuaLibraryRegistry`** for chip VMs. Use namespaced URIs (for example `stationeers://your_mod/api`). Ship sample scripts under **`Examples/`** next to the mod DLL and call **`LuaMcpRegistry.RegisterBundledExampleDocumentation`** so each **`.lua`** / **`.md`** / **`.ic10`** file becomes an MCP resource plus an index (StationeersLua, ScriptedScreens, and **StationeersLuaAI** use this). **`search_docs`** scopes: built-in **`all`**, **`lua`** (everything except `stationeers://ss/`), or **`ss`** (ScriptedScreens only). Mods can also call **`LuaMcpRegistry.RegisterDocumentationSearchScope("my_mod", "stationeers://my_mod/")`** so clients may pass **`scope: "my_mod"`** and only match resources whose URI contains that substring (repeat calls OR additional needles). The **`list_search_docs_scopes`** MCP tool lists every valid scope; a non-empty unknown **`scope`** makes **`search_docs`** return an error (no silent fallback to **`all`**). After registering many resources, **`LuaMcpRegistry.RequestDocumentationSearchIndexRefresh()`** schedules a background index rebuild.

## MCP Tools

### Editor & Chip Management

| Tool                   | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `get_editor_state`     | Query the current in-game editor selection, network scope, chip list, and wireless-only context |
| `get_editor_code`      | Read the live IC editor draft text (not the compiled chip source)        |
| `set_editor_code`      | Update the IC editor draft — does **not** compile or export to the chip  |
| `list_chips`           | Enumerate accessible Lua chips on the current data network(s)            |
| `get_chip_code`        | Read a chip's current source by ref ID                                   |
| `set_chip_code`        | Write source to a chip by ref ID — compiles and exports immediately      |
| `patch_chip_code`      | Apply exact substring replacements to a chip's source without rewriting the entire file. Supports ordered replacements, `replace_all`, and `occurrence` targeting |
| `get_chip_errors`      | Retrieve error details for chips with debugger authority                 |
| `get_chip_logs`        | Get buffered `print()` / script log output for a chip, including the current log revision |
| `list_library_modules` | List library chip modules visible on the current network(s)              |

### Device & Network

| Tool                     | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| `get_network_devices`    | Enumerate devices on the current data network                          |
| `get_all_network_devices`| List all data cable networks in the world and their connected devices  |
| `read_device_value`      | Read a logic value from a device by reference ID and LogicType name    |
| `get_device_logic_types` | Get all readable and writable LogicType values for a device            |

### World & search

| Tool                  | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `get_game_state`      | Query world name, time, and other top-level game state           |
| `list_search_docs_scopes` | JSON list of valid `search_docs` **`scope`** values: built-ins **`all`**, **`lua`**, **`ss`**, plus mod-registered scopes and their URI substring needles |
| `search_docs`         | Full-text search across indexed documentation resources. Optional **`scope`**: omit or **`all`** for everything; built-ins **`lua`**, **`ss`**; mod names from **`list_search_docs_scopes`**. An unknown non-empty scope returns an **error** (no silent fallback to all) |
| `search_stationpedia` | Full-text search over the in-game Stationpedia encyclopedia entries |

### Debugger Tools <Badge type="info" text="conditional" />

These tools are only registered when **both** `Enabled` and `EnableExtensionApi` are `true`:

| Tool                      | Description                                                                      |
| ------------------------- | -------------------------------------------------------------------------------- |
| `get_debug_session_state` | Get the active VS Code debugger session state for an attached chip               |
| `get_debug_stack_trace`   | Get the stack trace for a paused chip in the active debugger session             |
| `get_debug_scopes`        | Get debugger scopes for a paused frame (use `get_debug_stack_trace` for frame IDs) |
| `get_debug_variables`     | Get debugger variables for a scope or variable reference                         |

::: tip `set_editor_code` vs `set_chip_code` vs `patch_chip_code`
- `set_editor_code` updates what is displayed in the in-game IC editor without compiling or exporting. Use it when you want to stage a change for the player to review.
- `set_chip_code` writes directly to the chip and compiles immediately — equivalent to pressing Export in the editor.
- `patch_chip_code` applies targeted substring replacements to the chip's current source. Use it for small edits so tool arguments stay small instead of rewriting the entire source.
:::

## MCP Resources

The server exposes the following resources that AI editors can read for context:

### Guides & API

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

### Enums

| URI                                        | Content                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `stationeers://lua/enums/logic_type`       | Complete `LogicType` enum values with descriptions (`LT.*`)             |
| `stationeers://lua/enums/logic_slot_type`  | Complete `LogicSlotType` enum values for slot-based reads (`LST.*`)     |
| `stationeers://lua/enums/batch_method`     | `LogicBatchMethod` enum values (Sum, Average, Minimum, Maximum)         |
| `stationeers://lua/enums/sorter_instruction` | `SorterInstruction` enum (Logic Sorter stack opcodes)               |
| `stationeers://lua/enums/condition_operation` | `ConditionOperation` enum (packed compare modes)                 |

### Bundled Examples

| URI                                        | Content                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `stationeers://lua/examples/index`         | Catalog of all example scripts shipped with StationeersLua              |
| `stationeers://lua/examples/<path>`        | Individual example file (`.lua`, `.ic10`, or `.md`)                     |

Example files are loaded from the `Examples/` directory next to the mod DLL at startup. Other mods (e.g. ScriptedScreens) can register their own example bundles under separate URI prefixes.

The `stationeers://lua/readme` text is also provided as `initialize.result.instructions` so MCP clients display it automatically when the server is selected.

## Configuration

All settings live in the StationeersLua config file under `[MCP Server]`. The LSP-related keys (`EnableLspServer`, `LspPort`, and `ExternalLuaLanguageServer*`) also live in this section - see **[Language servers & editor intelligence](./language-servers.md)** for their full reference.

| Setting                                       | Default | Description                                                                                                                                                                                                                                  |
| --------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Enabled`                                     | `false` | Enable the MCP JSON-RPC surface for AI editors                                                                                                                                                                                               |
| `EnableExtensionApi`                          | `false` | Enable the REST surface for the VS Code extension — can be used without enabling `Enabled`                                                                                                                                                   |
| `Port`                                        | `3030`  | Shared HTTP listener port for both surfaces                                                                                                                                                                                                  |
| `BindAddress`                                 | `127.0.0.1` | Bind address for the HTTP listener. Use `AllowRemoteConnections` instead of changing this to `0.0.0.0`                                                                                                                                   |
| `AllowRemoteConnections`                      | `false` | Bind to all interfaces instead of localhost only                                                                                                                                                                                             |
| `AllowedBrowserOrigins`                       | `` (empty) | Comma-separated allowlist of browser `Origin` values permitted to call the listener. Empty blocks all browser origins (anti CSRF / DNS-rebinding). Native MCP/REST clients send no `Origin` and are unaffected. |
| `AllowNetworkChipAccess`                      | `false` | Master toggle for network-wide chip access. When disabled, both MCP and the VS Code extension stay single-chip scoped.                                                                                                                       |
| `AllowNetworkChipAccessOnlyForWirelessBoards` | `true`  | When network access is enabled, keep the normal IC editor single-chip scoped and allow only the Wireless Development Board to expose full network scope. Set to `false` to let the normal wired IC editor expose its whole data network too. |
| `AllowMultiplayerDebugProxy`                  | `false` | Allow multiplayer clients to proxy VS Code debugger traffic to the authoritative server over in-game mod network messages                                                                                                                    |
| `EnableExperimentalDebugger`                  | `false` | **[Experimental]** Enable the VS Code DAP debugger integration. When disabled, debug session endpoints and MCP debug tools are unavailable, and the VS Code extension hides the Debug button in the Chip Explorer                            |

The HTTP listener only starts if at least one of `Enabled` or `EnableExtensionApi` is `true`.

The listener also validates the HTTP `Host` header and rejects browser requests whose `Origin` is not listed in `AllowedBrowserOrigins`. CORS responses no longer use a wildcard.

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

### `get_editor_state` and REST `/api/editor` fields

When the suit **Wireless Development Board** supplies MCP/REST scope but **no** IC motherboard editor is open, the response includes:

- `wireless_remote_access_only`: `true` — the suit board is only a **remote data-network bridge**, not a selected chip or circuit housing.
- `selected_chip_ref_id`, `selected_housing_ref_id`, and `selected_housing_name` are unset (`null`) in that mode. Use `network_id`, `network_ids`, and `network_names` for where you are connected.

When a normal IC editor is open, `wireless_remote_access_only` is `false` and the holder fields describe the dropdown-selected chip’s holder as usual. Wired plus wireless scope can be merged when both are active and config allows it.

## In-Game Lua Reference Panel

The IC10 editor's built-in help buttons (**f**, **x**, **s(x)**) are replaced with a searchable Lua API reference panel when the Lua formatter is active.

- **Functions** — All `ic.*`, global, and utility functions with signatures and descriptions
- **Logic Variables** — `LT.*` enum values
- **Slot Variables** — `LST.*` enum values
- **IC10 Migration** — Side-by-side IC10 → Lua translation reference

When ScriptedScreens is also installed, its API sections (surface, element, canvas, layout, etc.) are appended to the panel automatically via cross-mod reflection.

Reference data is shipped as bilingual embedded XML assets (`LuaReference_EN.xml`, `LuaReference_RU.xml`) and loaded based on the game's current language.
