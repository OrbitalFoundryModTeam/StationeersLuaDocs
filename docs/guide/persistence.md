# Save/Load Persistence

## What's Automatic

The game automatically persists:
- The chip's **source code**
- IC10-style state: **registers, stack, memory** (the 512-address memory)

So `mem_read`/`mem_write` values survive save/load with no extra work.

## What's NOT Automatic

**Lua local/global variables are NOT persisted.** After a load, your script re-initializes from scratch (module-level code runs again).

## Opt-In Persistence

Define `serialize()` and `deserialize(blob)` to save/restore custom state:

```lua
local mode = "auto"
local setpoint = 22.0

function serialize()
    -- Return a string blob to persist
    return util.json.encode({ mode = mode, setpoint = setpoint })
end

function deserialize(blob)
    -- Restore state from the blob
    if type(blob) ~= "string" then return end
    local ok, data = pcall(util.json.decode, blob)
    if ok and type(data) == "table" then
        mode = data.mode or "auto"
        setpoint = data.setpoint or 22.0
    end
end

function tick(dt)
    -- mode and setpoint survive save/load
    print("Mode: " .. mode .. " Setpoint: " .. setpoint)
end
```

## Rules

| Rule | Detail |
|---|---|
| `serialize()` must return a string | Or `nil` to skip |
| `deserialize(blob)` receives the string | Called after init on load |
| Source-hash match required | Blob is only applied if the script hasn't changed |
| Best-effort | Errors are swallowed; persistence never crashes the game |
| Synchronous only | No `yield` or `sleep` inside these functions |

## Quick Persistence via Chip Memory

For simple values, use chip memory instead of serialize/deserialize — it persists automatically:

```lua
local ADDR_COUNT = 0

-- Read persisted counter on startup
local count = mem_read(ADDR_COUNT) or 0

function tick(dt)
    count = count + 1
    mem_write(ADDR_COUNT, count)
    write(ic.const.BASE_UNIT_INDEX, ic.enums.LogicType.Setting, count)
end
```
