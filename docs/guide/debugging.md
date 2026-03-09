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
