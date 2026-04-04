# Control Flow

## `yield()`

Pauses the current execution context until the next game tick. Works in the main coroutine, inside `tick()`, and inside user-created coroutines:

```lua
while true do
    local temp = ic.read(0, ic.enums.LogicType.Temperature)
    print("Temp: " .. tostring(temp))
    yield()
end
```

## `sleep(seconds)`

Pauses the current execution context for a real-time duration. The runtime counts down across ticks. Works in the main coroutine, inside `tick()`, and inside user-created coroutines:

```lua
print("Starting...")
sleep(5)
print("5 seconds later!")
```

Each execution context sleeps independently — sleeping in `tick()` does not freeze the main coroutine, and sleeping in a user coroutine does not freeze either.

## `sleep()` and `yield()` in User Coroutines

When you call `sleep()` or `yield()` inside a coroutine you created with `coroutine.create()`, the runtime automatically tracks and resumes it:

```lua
local function worker(name, interval)
    while true do
        print(name .. " working")
        sleep(interval)
    end
end

local fast = coroutine.create(worker)
local slow = coroutine.create(worker)
coroutine.resume(fast, "fast", 1)   -- starts, runs until first sleep(1)
coroutine.resume(slow, "slow", 5)   -- starts, runs until first sleep(5)

-- Both coroutines are now managed by the runtime.
-- "fast" resumes every ~1s, "slow" every ~5s, independently.
-- The main chunk and tick() continue running normally.
```

::: warning
The runtime auto-resumes sleeping user coroutines. Do **not** manually `coroutine.resume()` a coroutine that is currently sleeping — the runtime handles it. Up to 32 user coroutines can be sleeping simultaneously.
:::

## `tick(dt)`

If you define a global function named `tick`, it's called automatically every game tick. `sleep()` and `yield()` work inside it:

```lua
function tick(dt)
    -- dt = seconds since last tick (~0.5s typically)
    print("Delta: " .. dt)
end
```

Example with sleep inside `tick()`:

```lua
function tick(dt)
    ic.write(0, ic.enums.LogicType.On, 1)
    sleep(2)
    ic.write(0, ic.enums.LogicType.On, 0)
    sleep(2)
end
```

## `throw(message)`

Immediately throws a Lua runtime error:

```lua
throw("something went terribly wrong")
```

## `hcf()`

**Halt and Catch Fire** — permanently destroys the chip:

```lua
hcf()  -- The chip is gone. No undo!
```

::: danger
`hcf()` is destructive and irreversible. The chip item is permanently destroyed. Use with caution (or for dramatic effect).
:::
