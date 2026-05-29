# Timer API (`ic.timer`)

Schedule recurring or one-shot callbacks without manual `last = 0` / `if now - last > N` logic in `tick()`.

Timers run on the **server/host** Lua runtime only - clients never tick Lua, so timers are server-authoritative and cannot desync. They are cleared when the chip is recompiled or the world reloads (same as `sleep()` timers).

### Time basis (read this before using `cron`)

- `every` and `in_seconds` count **simulation time** (the game tick delta). They freeze while the game/server is paused and scale with the server tick rate. This is the same basis as `sleep()`.
- `cron` uses the **real UTC wall clock**, evaluated once per tick. It will **not** fire while the simulation is paused (no ticks occur), and it fires at most once per matching minute. On a dedicated server the host's UTC clock is authoritative.

## `ic.timer.every(intervalSeconds, handler)`

Calls `handler` every `intervalSeconds` of **simulation time** (same basis as `sleep()`; frozen while paused).

Pass a **function value** — usually a named function with **no quotes** (`minute_tick`, not `"minute_tick"`).

Returns a numeric timer id. Pass it to `ic.timer.cancel(id)` to stop the timer.

```lua
local function minute_tick()
    print("once per minute")
end

local everyId = ic.timer.every(60, minute_tick)
```

Minimum interval is **0.05** seconds. If the game stalls, each timer fires at most **once per tick** (no catch-up spiral).

## `ic.timer.cron(expression, handler)`

Calls `handler` on a UTC wall-clock schedule. Pass a named function (no quotes).

Five fields: `minute hour day month weekday`

| Field | Range | Examples |
|---|---|---|
| minute | 0-59 | `*`, `*/15`, `30` |
| hour | 0-23 | `*`, `*/2`, `8` |
| day | 1-31 | `*`, `1` |
| month | 1-12 | `*`, `6` |
| weekday | 0-6 (Sunday=0) | `*`, `1` |

`*/step` counts from each field's minimum (standard cron): minute `*/15` is 0,15,30,45; day `*/2` is 1,3,5,...

```lua
local function quarter_hour()
    print("every 15 minutes (UTC)")
end

local cronId = ic.timer.cron("*/15 * * * *", quarter_hour)
```

Returns a timer id (same as `every`).

## `ic.timer.in_seconds(seconds, function)`

Runs a function once after a delay. Implemented with `coroutine.create`, `sleep()`, and the runtime's user-coroutine resume (same machinery as `Examples/CoroutineDemo.lua` in the mod).

Returns a timer id. Cancel before the delay elapses to prevent the callback from running.

```lua
local function delayed_hello()
    print("2.5 seconds later")
end

local onceId = ic.timer.in_seconds(2.5, delayed_hello)
```

## `ic.timer.cancel(id)`

Stops a timer created by `every`, `cron`, or `in_seconds`. Returns `true` if a timer with that id was active and removed, `false` if the id was invalid or already finished.

```lua
local function noop() end

local everyId = ic.timer.every(60, noop)
ic.timer.cancel(everyId)
```

## Limits and tips

- Up to **64** active `every` / `cron` timers per chip.
- Handlers are function values: `ic.timer.every(60, my_fn)` where `my_fn` is defined in scope.
- Do not call `sleep()` for long periods inside timer handlers; use `ic.timer.in_seconds` or `ic.timer.every` instead.
- `in_seconds` shares the **32** concurrent sleeping user-coroutine limit with manual `coroutine.create` usage.

## Compared to manual timing

Before:

```lua
local last = 0
function tick(dt)
    local now = util.game_time()
    if now - last >= 60 then
        last = now
        do_work()
    end
end
```

After:

```lua
local function do_work()
    -- ...
end

ic.timer.every(60, do_work)
```
