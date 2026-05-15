# Save/Load Persistence

## What's Automatic

The game automatically persists:
- The chip's **source code**
- IC10-style state: **registers, stack, memory** (the 512-address memory)

So `mem_read`/`mem_write` values survive save/load with no extra work.

## What's NOT Automatic

**Lua local/global variables are NOT persisted.** After a load, your script re-initializes from scratch (module-level code runs again).

## Load order

When a saved chip compiles (housing powers on, world load, or source change), the runtime follows this order:

1. **Compile** — source is parsed into bytecode.
2. **Init** — module-level code runs top to bottom. For scripts that use `while true do ... yield() end`, the main coroutine runs until the **first** `yield()` or `sleep()` (that includes the **first** loop iteration).
3. **`deserialize(blob)`** — if a saved blob exists and the source hash still matches.
4. **Tick loop** — each game tick resumes the main coroutine, delivers network/events, and calls `tick(dt)` if defined.

`serialize()` runs during **save**, not on load.

::: warning Module-level code runs before `deserialize`
Any statement outside `deserialize` that executes during step 2 sees **default** variable values, not restored state. A check like `if currentState == savedValue then ...` placed between `function deserialize` and your main loop **never** sees values from the blob.

The first `while true` iteration during init (step 2) also runs **before** `deserialize`. Code at the top of the loop runs again on the **next** loop entry (first game tick after step 3), when restored state is available.
:::

### Wrong vs right: post-load recovery

```lua
local stateCycle = { idle = 0, cancel = 7 }
local currentState

function deserialize(blob)
    -- restores currentState from JSON ...
end

-- WRONG: runs during init (step 2), before deserialize (step 3)
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
| Module-level (between functions and main loop) | No | Yes |
| First `while true` iteration during init | No | Yes |
| Top of `while true` on later iterations / `tick(dt)` | Yes | Yes |
| Inside `deserialize(blob)` | Yes (you are restoring it) | **No** — must finish synchronously |

For multi-step recovery (vents, doors, timed waits), restore flags or state in `deserialize`, then run the physical sequence from `while true` or `tick()` on the next resume.

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
| `deserialize(blob)` receives the string | Called **after** init on load (see [Load order](#load-order)) |
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
    ic.write(ic.const.BASE_UNIT_INDEX, ic.enums.LogicType.Setting, count)
end
```
