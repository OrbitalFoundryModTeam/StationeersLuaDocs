# Wireless Development Board

The **Wireless Development Board** is a wearable EVA suit module that gives the MCP server and VS Code extension remote access to Lua chips on a powered **Wireless Data Access Point** data network — without needing to stand at a computer with the IC editor open.

## What It Does

Normally, MCP and VS Code can only see Lua chips when you have the IC editor open on a computer. The wireless development board removes that limitation: once equipped and connected, all Lua chips on the selected wireless data network are accessible to your external tools while you walk around your base (or EVA outside it).

This is especially useful for:

- **Debugging scripts on remote devices** without running back to a terminal
- **Live-editing chips across your base** from anywhere within wireless data access point range
- **Monitoring multiple chips simultaneously** while troubleshooting distributed systems

## Setup

1. **Print** the board at an **Electronics Printer**
2. **Insert** the board into the **Suit Module** slot on a supported EVA suit (also accepts the **Suit Networking Module**)
3. **Wear** the suit
4. **Open** the wireless board slot in your suit inventory to access the board's controls

### Optional: Wireless Diagnostics

For full compile and runtime error diagnostics over wireless, install a **Lua Debugger Motherboard** into the board's internal debugger slot. Without the debugger board, MCP/VS Code can still access chips but won't receive detailed error information.

## Board Controls

The board has three interactions (accessible from your suit inventory):

| Control | Description |
|---|---|
| **Wireless Network** | Cycle through powered wireless data access points in range. Hold Alt to cycle backwards. Shows the target name, range, and network ID. |
| **Wireless Mesh** | Toggle mesh handoff. When enabled, the board automatically hands off to the best in-range access point on the same network. When disabled, it stays locked to the specific access point you selected. |
| **Wireless Disconnect** | Clear the current wireless connection. |

## How Connection Works

- The board scans for **powered wireless data access points** within range
- You cycle through available access points and pick one to connect to
- Once connected, all Lua chips on that access point's data network become visible to MCP and VS Code
- The connection **persists across save/load** — on relog, the board reconnects automatically if the network is still in range
- Brief outages (momentary power loss, multiplayer replication/streaming gaps) are tolerated with a **reconnect grace period** (~5 seconds) before the panel shows the selected network as unavailable
- **Removing the suit or the board** immediately drops the wireless connection
- **Power:** while you stay **connected and in range**, the board slowly draws extra power from the **suit battery**. When you inspect the board, the description includes a note while this extra drain is happening. The wireless **Lua tablet cartridge** uses the same drain rate (see ScriptedScreens docs).

### Mesh Handoff

When mesh is enabled and multiple wireless data access points share the same data network, the board will automatically switch to whichever access point has the best signal as you move around. This is useful for large bases with multiple access points bridging one network.

When mesh is disabled, the board stays locked to the specific access point you selected, even if a closer one is available.

## Requirements

- The server config **`AllowNetworkChipAccess`** must be enabled
- You must be wearing the suit with the board installed
- At least one **powered** wireless data access point must be in range

::: warning Dedicated Servers
Dedicated servers do not expose the HTTP/MCP listener directly. In multiplayer, a client can use its own local StationeersLua bridge while the game routes debug traffic to the server over mod network messages.
:::

## Suit Chip Scripting

Lua chips installed directly in a suit run automatically while the suit has battery power and the player is wearing it. If a Wireless Development Board is also installed, the chip gains full network access (read/write devices, pub/sub, RPC).

When **either** the wireless development board **or** the suit networking module is in the suit module slot, worn Lua hosts also gain **personal area network** access to other top-level equipped gear via `device_list` / `read_id` / `write_id`. See [Suit Networking Module](suit-networking-module.md).

See the `SuitTelemetry.lua` and `SuitDashboard.lua` examples for a complete per-player telemetry system using pub/sub.

## Scripting API (`ic.wireless`)

Suit chips and wireless tablet cartridges can programmatically control their wireless connection via the `ic.wireless` table:

| Function | Description |
|---|---|
| `ic.wireless.list()` | Returns a 1-indexed array of in-range access points. Each entry: `{ id, network_id, name, distance, max_distance }` |
| `ic.wireless.connect(id [, mesh])` | Connect to an access point or network by id. `mesh` defaults to `true`. Returns `true` on success, or `false, error_string` on failure. |
| `ic.wireless.disconnect()` | Clear the current wireless connection. |
| `ic.wireless.status()` | Returns a table with `available`, `connected`, `in_range`, `mesh`, `network_id`, `transmitter_id`, `transmitter_name`, `distance`, `max_distance`. Never throws. |
| `ic.wireless.set_mesh(enabled)` | Toggle mesh handoff mode without reconnecting. |

::: tip
`ic.wireless.status()` is safe to call from any chip — if no wireless device is available, it returns `{ available = false, connected = false }`. All other functions throw an error if no wireless device is present.
:::

::: tip ScriptedScreens Alias
On wireless tablet cartridges, `ss.tablet.wireless` is still available as an alias for backward compatibility. Both `ic.wireless` and `ss.tablet.wireless` resolve to the same underlying device.
:::

## Combining with the IC Editor

If you have the in-game IC editor open on a wired computer **and** a wireless development board connected to a different network, both networks are accessible at the same time. This means you can edit a local chip at a terminal while also monitoring remote chips over wireless.

## Tips

- Only **powered** wireless data access points in range appear when cycling networks
- The board's tooltip (hover text in your suit inventory) shows the current connection state
- Mesh mode is recommended for most setups — it gives seamless roaming across your base
- Lock to a specific access point only when you need to guarantee which network segment you're accessing
