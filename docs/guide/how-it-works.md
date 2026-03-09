# How Lua Chips Work

## Lifecycle

When you save Lua code to a chip, it goes through a well-defined lifecycle:

### 1. Compile & Initialize

When code is saved (or the housing powers on), StationeersLua:

1. Creates a fresh **Lua 5.2 VM** for the chip
2. Opens sandboxed standard libraries (`math`, `string`, `table`, etc.)
3. Injects the **`ic` API table** with all device functions, enums, and networking
4. Runs your **module-level code** (everything outside `tick()`) with a budget of **500,000 instructions**

```lua
-- This code runs ONCE during initialization
local LT = ic.enums.LogicType
local threshold = 25.0
print("Script initialized!")  -- Printed once

-- tick() is called every game tick after init
function tick(dt)
    -- ...
end
```

### 2. Tick Loop

Every game tick (~0.5 seconds), the runtime performs these steps **in order**:

1. **Network messages** — Incoming messages from other Lua chips are delivered to handlers
2. **Events** — Registered event handlers are dispatched
3. **Main coroutine** — If the script used `sleep()` or `yield()`, the coroutine is resumed
4. **`tick(dt)`** — If a global `tick` function is defined, it's called with the delta time

Each tick has a budget of **50,000 instructions**.

### 3. Shutdown

The Lua VM is destroyed when:

- The IC Housing is powered off or loses power
- The chip is removed from the housing
- The game exits

## Key Rules

### Server-Authoritative

All Lua execution happens on the **server/host**. In multiplayer, clients never run Lua code — they see the results via normal game state synchronization (device values, display names, etc.).

### Power-Gated

If the IC Housing is **off** or **unpowered**, the script will not:

- Compile or initialize
- Tick or process events
- Respond to network messages

The chip effectively doesn't exist until the housing has power and is switched on.

### Deterministic Sandbox

Lua chips run in a restricted environment:

- **No filesystem I/O** — `io`, `dofile`, `loadfile` are blocked
- **No process control** — `os.execute`, `os.exit` are blocked
- **No threads** — Only `sleep`/`yield` for pausing (coroutine-based)
- **No `require` from files** — `require()` loads from library chips on the data network, not from disk

### Advanced Computing Compatibility

If the [Advanced Computing](https://steamcommunity.com/sharedfiles/filedetails/?id=3465059322) mod is installed, chip stacks support extended device pins `d0`–`d11` and rack self-addressing at `d100`+. StationeersLua fully supports these extended indices.
