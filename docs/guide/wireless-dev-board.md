# Wireless Development Board

The **Wireless Development Board** is a wearable EVA suit module that gives the MCP server and VS Code extension remote access to Lua chips on a powered omni transmitter's data network — without needing to stand at a computer with the IC editor open.

## What It Does

Normally, MCP and VS Code can only see Lua chips when you have the IC editor open on a computer. The wireless development board removes that limitation: once equipped and connected, all Lua chips on the selected wireless data network are accessible to your external tools while you walk around your base (or EVA outside it).

This is especially useful for:

- **Debugging scripts on remote devices** without running back to a terminal
- **Live-editing chips across your base** from anywhere within omni transmitter range
- **Monitoring multiple chips simultaneously** while troubleshooting distributed systems

## Setup

1. **Print** the board at an **Electronics Printer**
2. **Insert** the board into the dedicated **Wireless Dev Board** slot on a supported EVA suit
3. **Wear** the suit
4. **Open** the wireless board slot in your suit inventory to access the board's controls

### Optional: Wireless Diagnostics

For full compile and runtime error diagnostics over wireless, install a **Lua Debugger Motherboard** into the board's internal debugger slot. Without the debugger board, MCP/VS Code can still access chips but won't receive detailed error information.

## Board Controls

The board has three interactions (accessible from your suit inventory):

| Control | Description |
|---|---|
| **Wireless Network** | Cycle through powered omni transmitters in range. Hold Alt to cycle backwards. Shows the target transmitter name, range, and network ID. |
| **Wireless Mesh** | Toggle mesh handoff. When enabled, the board automatically hands off to the best in-range transmitter on the same network. When disabled, it stays locked to the specific transmitter you selected. |
| **Wireless Disconnect** | Clear the current wireless connection. |

## How Connection Works

- The board scans for **powered omni transmitters** within range
- You cycle through available transmitters and pick one to connect to
- Once connected, all Lua chips on that transmitter's data network become visible to MCP and VS Code
- The connection **persists across save/load** — on relog, the board reconnects automatically if the network is still in range
- Brief transmitter outages (e.g., momentary power loss) are tolerated with a short reconnect grace period
- **Removing the suit or the board** immediately drops the wireless connection

### Mesh Handoff

When mesh is enabled and multiple omni transmitters share the same data network, the board will automatically switch to whichever transmitter has the best signal as you move around. This is useful for large bases with multiple transmitters bridging one network.

When mesh is disabled, the board stays locked to the specific transmitter you selected, even if a closer one is available.

## Requirements

- The server config **`AllowNetworkChipAccess`** must be enabled
- You must be wearing the suit with the board installed
- At least one **powered** omni transmitter must be in range

::: warning Dedicated Servers
Dedicated servers do not expose the HTTP/MCP listener directly. In multiplayer, a client can use its own local StationeersLua bridge while the game routes debug traffic to the server over mod network messages.
:::

## Combining with the IC Editor

If you have the in-game IC editor open on a wired computer **and** a wireless development board connected to a different network, both networks are accessible at the same time. This means you can edit a local chip at a terminal while also monitoring remote chips over wireless.

## Tips

- Only **powered** omni transmitters in range appear when cycling networks
- The board's tooltip (hover text in your suit inventory) shows the current connection state
- Mesh mode is recommended for most setups — it gives seamless roaming across your base
- Lock to a specific transmitter only when you need to guarantee which network segment you're accessing
