# Debugging

## `print()`

Writes to the **Lua Debugger Logs** tab (per-chip, bounded, cleared on power cycle):

```lua
print("Temperature:", temp, "Pressure:", pressure)
-- Output: Temperature:	300	Pressure:	101.3
```

Multiple arguments are tab-separated.

## Lua Debugger Motherboard

The **MotherboardLuaDebugger** is a special motherboard you can craft and install in a computer on the same data network as your Lua chips. It provides:

- Current compile/runtime **error state**
- Full Lua **exception message** and **traceback**
- **Chip memory** window (peek at addresses)
- **Stack pointer** (`sp`) and **return address** (`ra`)
- Event/net **queue sizes** and **sleep state**
- **Library chip** status (modules provided/loaded)
- A **Copy** button to copy the snapshot to clipboard
- An **Edit** button to open the IC10 editor for the selected target

Select a target chip from the dropdown to view its debug information.

## VS Code Debugger

StationeersLua also supports attaching the **VS Code debugger** to an in-game Lua chip.

When attached, the debugger can:

- Set and clear **source breakpoints**
- **Pause**, **continue**, **step over**, **step in**, and **step out**
- Inspect **stack frames**, **scopes**, and **variables**
- Surface `print(...)` output and runtime diagnostics in the **Debug Console** / **Output** view
- Attach to chips discovered from the current file, the in-game editor selection, or the chip explorer sidebar

## Output & Error Surfacing

- `print(...)` output is still written to the in-game **Lua Debugger Logs** tab
- When a VS Code debug session is attached, log output and runtime errors are also forwarded to the attached debug session
- Runtime errors include the cleaned error message plus the captured Lua traceback when available
- ScriptedScreens-hosted Lua chips also surface through the same debug event/output path; the host board or cartridge appears as the endpoint device

## Multiplayer & Remote Debugging

- All Lua execution remains **server-authoritative**
- In multiplayer, VS Code connects to a **local bridge in the player’s own game client**, not to the dedicated server over HTTP
- If the server has `AllowMultiplayerDebugProxy = true` in the `[MCP Server]` config, that local bridge forwards debug traffic to the authoritative server over in-game mod network messages
- **Dedicated servers do not expose the HTTP/MCP listener**
- Multiplayer debug sessions are owned by the attaching client, so one client cannot drive another client’s active chip session

## In-Game Lua Reference Panel

When the active formatter in the IC editor is Lua, the three reference buttons in the editor header open the Lua reference panel instead of the vanilla IC10 script help window:

| Button | Panel Tab            |
| ------ | -------------------- |
| `f`    | Functions            |
| `x`    | Logic Variables (LT) |
| `s(x)` | Slot Variables (LST) |

When ScriptedScreens is installed alongside StationeersLua, its API sections are appended to the panel.

## Debugger Availability

- The in-game debugger motherboard remains the authority gate for in-game debugging workflows.
- You must either have a debugger motherboard installed in a computer on the data network (and turned on), or have the wireless development board with a debugger motherboard installed.
- If the debugger is unavailable, the debugger reports the authoritative reason instead of pretending the transport is broken

## Checking Device Connections

```lua
-- Print all device info for debugging
for i = 0, 5 do
    local id = device_id(i)
    local name = device_name(i)
    print(string.format("d%d: id=%s name=%s", i, tostring(id), tostring(name)))
end
```

## Checking Nil Returns

Many `read*` functions return `nil` when a device is missing:

```lua
local temp = read(0, LT.Temperature)
if temp == nil then
    print("Device on d0 is not connected or doesn't support Temperature")
else
    print("Temperature: " .. temp)
end
```

## Common Issues

### Script Not Running

- Ensure the chip is an **Integrated Circuit (Lua)**, not a regular IC10 chip
- Check the chip is properly inserted in a powered housing
- Ensure the housing is switched **On** (green light)
- Look for error indicators on the housing (red light)
- Check BepInEx console for error messages

### Syntax Errors

- Lua uses `~=` for not-equal (not `!=`)
- Lua uses `and`/`or`/`not` (not `&&`/`||`/`!`)
- Lua arrays are 1-indexed by convention

### Performance Issues

- Keep code under instruction limits (50,000/tick)
- Use `sleep()` or `yield()` in long loops
- Avoid creating many tables per tick
