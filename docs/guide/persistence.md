# Save/Load Persistence

## What's Automatic

The game automatically persists:
- The chip's **source code**
- IC10-style state: **registers, stack, memory** (the 512-address memory)

So `mem_read`/`mem_write` values survive save/load with no extra work.

Chip memory also survives **housing power off/on** when the chip stays in the housing (same as vanilla IC memory).

## What's NOT Automatic

**Lua local/global variables are NOT persisted.** After a load or power cycle, your script re-initializes from scratch (module-level code runs again).

## Recommended: `ic.persist`

Use the string key/value store for custom state. It survives **world save/load** and **housing power off/on** (when the script source hash still matches).

```lua
local function saveTable(key, tbl)
    ic.persist.set(key, util.json.encode(tbl))
end

local function loadTable(key)
    if not ic.persist.has(key) then return nil end
    local raw = ic.persist.get(key)
    if type(raw) ~= "string" then return nil end
    local ok, data = pcall(util.json.decode, raw)
    return ok and data or nil
end

local mode = "auto"
local setpoint = 22.0

-- Restore before init finishes using ic.persist (KV is hydrated before module code runs)
local saved = loadTable("settings")
if saved then
    mode = saved.mode or mode
    setpoint = saved.setpoint or setpoint
end

function tick(dt)
    saveTable("settings", { mode = mode, setpoint = setpoint })
end
```

| API | Behavior |
|---|---|
| `ic.persist.set(key, value)` | Stores a string. Returns `true` on success. Keys starting with `__` are reserved. |
| `ic.persist.get(key)` | Returns the string or `nil` if missing. |
| `ic.persist.has(key)` | Returns whether the key exists. |
| `ic.persist.delete(key)` | Removes a key. Returns `true` if it existed. |
| `ic.persist.clear()` | Removes **all** keys for this chip (including legacy serialize blob). Returns `true` if anything was stored. |

Default limits (per chip, server/host config under **Lua Persist**): key length 128, value length 8192, total stored size 32 KiB. Host or dedicated server config is authoritative in multiplayer. Use `util.json.encode` / `decode` for tables.

On disk, the chip's persisted blob uses MessagePack with **LZ4** compression (`MP_LUA_STATE_V3:` prefix). Older worlds may still have uncompressed `MP_LUA_STATE_V2:` blobs; both load correctly.

## Legacy: `serialize()` / `deserialize(blob)`

These still work. The runtime stores the blob in the same KV store under the hood (`__script_state__`) and migrates old saves that only had `ScriptState` on load.

**Prefer `ic.persist` for new scripts** - you can read values during init without waiting for `deserialize`, and you can split state across multiple keys.

## Load order

When a saved chip compiles (housing powers on, world load, or source change), the runtime follows this order:

1. **Hydrate KV** - persisted keys (including legacy serialize blob) are loaded into memory when possible.
2. **Compile** - source is parsed into bytecode.
3. **Init** - module-level code runs top to bottom. For scripts that use `while true do ... yield() end`, the main coroutine runs until the **first** `yield()` or `sleep()` (that includes the **first** loop iteration).
4. **`deserialize(blob)`** - if you still define it and a legacy blob exists, it runs **after** init (same as before).
5. **Tick loop** - each game tick resumes the main coroutine, delivers network/events, and calls `tick(dt)` if defined.

`serialize()` runs during **save** and **housing power-off snapshot**, not on load.

::: warning Module-level code runs before `deserialize`
Any statement outside `deserialize` that executes during step 3 sees **default** variable values unless you restored them with `ic.persist` in step 1.

The first `while true` iteration during init (step 3) also runs **before** `deserialize`. Code at the top of the loop runs again on the **next** loop entry (first game tick after step 4), when restored state is available.
:::

### Wrong vs right: post-load recovery

```lua
local stateCycle = { idle = 0, cancel = 7 }
local currentState

function deserialize(blob)
    -- restores currentState from JSON ...
end

-- WRONG: runs during init (step 3), before deserialize (step 4)
if currentState == stateCycle.cancel then
    recoverFromCancel()  -- currentState is still nil here
end

while true do
    -- RIGHT: first init pass may still be too early; after deserialize,
    -- the next loop entry (first tick) sees restored currentState.
    if currentState == stateCycle.cancel then
        recoverFromCancel()  -- may use yield(); cannot call from deserialize
    end
    yield()
end
```

**Where to put post-load logic:**

| Location | Sees restored state? | Can use `yield` / `sleep`? |
|---|---|---|
| Module-level after `ic.persist.get` | Yes (KV hydrated first) | Yes |
| Module-level (only `deserialize`) | No | Yes |
| First `while true` iteration during init | No (unless `ic.persist`) | Yes |
| Top of `while true` on later iterations / `tick(dt)` | Yes | Yes |
| Inside `deserialize(blob)` | Yes (you are restoring it) | **No** - must finish synchronously |

For multi-step recovery (vents, doors, timed waits), restore flags or state in `deserialize` or `ic.persist`, then run the physical sequence from `while true` or `tick()` on the next resume.

## Rules (legacy hooks)

| Rule | Detail |
|---|---|
| `serialize()` must return a string | Or `nil` to skip |
| `deserialize(blob)` receives the string | Called **after** init on load (see [Load order](#load-order)) |
| Source-hash match required | State is only applied if the script hasn't changed |
| Best-effort | Errors are swallowed; persistence never crashes the game |
| Synchronous only | No `yield` or `sleep` inside these functions |

## Quick Persistence via Chip Memory

For simple numeric values, use chip memory instead of `ic.persist` - it persists automatically:

```lua
local ADDR_COUNT = 0

-- Read persisted counter on startup
local count = mem_read(ADDR_COUNT) or 0

function tick(dt)
    count = count + 1
    mem_write(ADDR_COUNT, count)
    ic.write(ic.const.BASE_UNIT_INDEX, ic.enums.LogicType.Setting, count)
end
```
