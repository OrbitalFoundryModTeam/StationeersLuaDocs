# Suit Networking Module and Personal Area Network

The **Suit Networking Module** is a passive EVA suit module that enables a **personal area network (PAN)** among the wearer's top-level equipped gear. Lua-capable items you wear (suit chip, programmable visor, handheld tablet) can use `device_list`, `read_id`, and `write_id` against other equipped devices without any data cables.

The **Wireless Development Board** uses the same suit module slot and **also** enables the PAN when worn, in addition to its remote wireless data network features.

## Suit module slot

Supported EVA suits expose a **Suit Module** slot (one module at a time). It accepts:

| Module | Role |
|---|---|
| **Suit Networking Module** | Local PAN only (cheaper recipe) |
| **Wireless Development Board** | Remote wireless data network + local PAN |

## What the PAN exposes

When a PAN-capable module is installed and you run Lua on worn gear, scripts can enumerate and read/write **top-level worn slots**:

- Suit
- Helmet
- Glasses (e.g. programmable visor)
- Backpack
- Toolbelt
- Uniform
- Left and right hands (e.g. handheld tablet)

Nested container contents (toolbelt tools, backpack internals) are **not** included.

## Laptop IC editor and Lua debugger

While you wear a **Suit Networking Module** or **Wireless Development Board** and hold a powered **laptop** in either hand:

- **IC editor motherboard** (any board type in the laptop): the target dropdown also lists Lua chips on your PAN gear - suit chip, programmable visor, wireless tablet cartridges in that hand, and other top-level worn Lua hosts. Labels use the same `"<chip> - <wearer>"` style as suit chips.
- **Lua debugger motherboard** in the laptop: the endpoint dropdown gets the same PAN targets for inspecting errors and runtime state.

The laptop must stay in your hand (dropped laptops do not keep PAN entries). Remote wireless network targets from the dev board still apply when that board is connected; PAN entries are additive.

## MCP and VS Code (optional)

With **`AllowPersonalAreaNetworkChipAccess`** enabled in the StationeersLua BepInEx config (`[MCP Server]` section), MCP and the VS Code extension can list and edit Lua chips on your **worn PAN gear** without opening the IC editor and without a wireless data access point link. This is separate from **`AllowNetworkChipAccess`** (remote wireless data network via the dev board).

`get_editor_state` reports **`pan_remote_access_only`** when scope comes from the suit module alone. Chips appear under **`personal_area_network_name`** (for example `YourName (PAN)`). In multiplayer, the server builds that chip list from your worn gear; other players cannot widen your MCP or VS Code scope by ID spoofing.

See [MCP Server](./mcp-server.md) for `AllowedBrowserOrigins`, multiplayer proxy behavior, and the full `[MCP Server]` config table.

## Example (visor reading suit data)

With the networking module in your suit and a Lua visor equipped:

```lua
local list = ic.device_list()
for i = 1, #list do
  local d = list[i]
  print(d.display_name, d.ref_id)
end

-- Read a logic value from another worn device by ref_id
local pressure = ic.read_id(suit_ref_id, LogicType.PressureExternal)
```

## Compared to the wireless dev board

| Feature | Networking module | Dev board |
|---|---|---|
| Local PAN | Yes | Yes |
| Remote wireless / `ic.wireless` | No | Yes |
| MCP / VS Code over wireless data network | No | Yes (when connected + `AllowNetworkChipAccess`) |
| MCP / VS Code over PAN (`AllowPersonalAreaNetworkChipAccess`) | Yes (worn gear, no wireless link) | Yes (PAN chips merge when module worn) |
| Laptop IC editor / debugger (held) | PAN worn Lua targets in dropdown | Same + remote wireless targets when linked |

While installed in a worn suit, the module draws a small amount of power from the suit battery (less than the wireless dev board's active link drain).

## Crafting

Print **Suit Networking Module** at an **Electronics Printer** (Tier Two). Recipe is cheaper than the wireless development board.
