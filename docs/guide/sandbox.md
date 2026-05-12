# Sandbox & Limits

Lua chip scripts run in a **deterministic sandbox** to ensure game stability and prevent abuse.

## Instruction Limits

| Phase | Budget |
|---|---|
| Initialization (module-level code) | 500,000 instructions (default) |
| Per tick (coroutine + tick + events) | 50,000 instructions (default) |

In the **StationeersLua** mod configuration (BepInEx / in-game mod panel), category **`[Lua VM]`**:

| Setting | Default | Notes |
|---|---|---|
| `InitInstructionLimit` | `500000` | Startup budget (module-level code, first resume, serialize/deserialize hooks) |
| `TickInstructionLimit` | `50000` | Per game tick, per chip |

Values are clamped between **1,000** and **100,000,000**. Only the **simulation host** runs Lua chips (dedicated server or session host), so in multiplayer these settings apply from the host or server config, not from joining clients.

Exceeding limits triggers a runtime error on the chip (red light on the housing).

## Available Libraries

| Library | Notes |
|---|---|
| `math` | Full: `math.sin`, `math.floor`, `math.random`, etc. |
| `string` | Full: `string.format`, `string.sub`, `string.find`, etc. |
| `table` | Full: `table.insert`, `table.remove`, `table.sort`, etc. |
| `coroutine` | Full: `coroutine.create`, `coroutine.resume`, `coroutine.yield`, etc. `sleep`/`yield` work inside user coroutines. |
| `utf8` | UTF-8 string handling |
| `os.clock` | High-resolution timer |
| `os.time` | Current Unix timestamp |
| `os.date` | Date/time formatting |
| `os.difftime` | Time difference |
| `pcall`, `xpcall` | Protected calls |
| `tonumber`, `tostring`, `type` | Standard conversions |
| `pairs`, `ipairs`, `next` | Table iteration |
| `select`, `unpack`, `rawget`, `rawset` | Table utilities |
| `load` | Dynamic code loading (from strings only) |
| `util.json` | JSON encode/decode |

## Blocked Libraries

| Blocked | Reason |
|---|---|
| `debug` | Intentionally unavailable on chips - the Lua `debug` library exposes internal VM state and is not available in the chip sandbox |
| `io` | Filesystem access |
| `package` | Filesystem module loading (replaced by `require()` from data network) |
| `dofile`, `loadfile` | Filesystem access |
| `os.execute`, `os.exit`, `os.remove`, `os.rename` | Process/filesystem mutation |
| `os.tmpname`, `os.setlocale`, `os.getenv` | System interaction |

## Runtime Behavior

- Scripts run as Lua coroutines, allowing `sleep()` and `yield()` to pause execution
- Async C# work during tick is rejected — only coroutine suspension is supported
- `print(...)` writes to the Lua Debugger Logs tab (per-chip, bounded, cleared on power cycle)
- File I/O, module loading, and process-affecting operations are disabled
