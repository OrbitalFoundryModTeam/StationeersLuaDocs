# Sandbox & Limits

Lua chip scripts run in a **deterministic sandbox** to ensure game stability and prevent abuse.

## Instruction Limits

| Phase | Budget |
|---|---|
| Initialization (module-level code) | 500,000 instructions (default) |
| Per tick (coroutine + tick + events) | 50,000 instructions (default) |
| Per tick (incoming `ic.net` dispatch) | 50,000 instructions (default), separate bucket |

In the **StationeersLua** mod configuration (BepInEx / in-game mod panel), category **`[Lua VM]`**:

| Setting | Default | Notes |
|---|---|---|
| `InitInstructionLimit` | `500000` | Startup budget (module-level code, first resume, legacy serialize/deserialize hooks) |
| `TickInstructionLimit` | `50000` | Per game tick, per chip |
| `NetInstructionLimit` | `50000` | Per game tick, per chip, for incoming `ic.net` handlers |
| `NetMaxMessagesPerTick` | `128` | Ceiling on queued `ic.net` messages examined per tick, per queue |

Values are clamped between **1,000** and **100,000,000** (`NetMaxMessagesPerTick`: **8** to **4,096**). Only the **simulation host** runs Lua chips (dedicated server or session host), so in multiplayer these settings apply from the host or server config, not from joining clients.

Exceeding limits triggers a runtime error on the chip (red light on the housing).

## Network dispatch budget

Incoming `ic.net` traffic is metered separately from your own code, so messages sent by other chips cannot starve your `tick(dt)` or main coroutine, and a heavy `tick(dt)` cannot stop you receiving messages.

`NetInstructionLimit` is shared across all three incoming queues - direct messages (`listen`), pub/sub (`subscribe`), and RPC - so a chatty topic cannot delay an RPC response that arrived on the same queue.

Two properties matter when reasoning about your own scripts:

- **Each handler still gets the full `TickInstructionLimit`.** The network budget decides *how many* handlers run this tick, never how long one of them may run. A handler that was legal before this budget existed is still legal.
- **Leftover messages stay queued.** When the budget runs out, remaining messages wait for the next tick. They are not dropped and no error is raised.

A handler is only charged for the Lua it actually executes, and a typical light handler costs a few hundred instructions, so the default budget drains a full queue comfortably.

## Message queue limits

| Queue | Limit |
|---|---|
| Direct messages (`listen` + `recv`) | 128 pending per chip |
| Pub/sub | 128 pending per chip |
| RPC (requests + responses) | 128 pending per chip |

When a queue is full, new messages are **refused**, not silently lost:

- `ic.net.send` raises a Lua error.
- `ic.net.broadcast` and `ic.net.publish` return a `dropped` count as their second return value.
- The host logs a warning naming the chip and channel or topic (rate limited to one line per queue per chip).

Pub/sub only queues on chips holding a matching subscription, so unsubscribed chips never contribute to each other's backpressure.

## `ic.persist` size limits

Category **`[Lua Persist]`** in the same mod configuration panel:

| Setting | Default | Range |
|---|---|---|
| `MaxKeyLength` | `128` | 1 - 4096 |
| `MaxValueLength` | `8192` | 1 - 1,048,576 |
| `MaxTotalBytes` | `32768` | 256 - 4,194,304 |

Server-authoritative (same host rule as instruction limits). See [Save/Load Persistence](/guide/persistence).

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
