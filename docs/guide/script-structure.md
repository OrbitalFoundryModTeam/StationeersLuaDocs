# Script Structure

There are three main patterns for structuring Lua chip scripts.

## Pattern A: `tick()` Function

Define a global `tick(dt)` function. It's called every game tick automatically.

```lua
local LT = ic.enums.LogicType

-- Module-level code runs once at init
local threshold = 25.0
print("Script initialized, threshold = " .. threshold)

-- Called every game tick (~0.5s)
function tick(dt)
    local temp = read(0, LT.Temperature)
    if temp ~= nil and temp > threshold then
        write(1, LT.On, 1)  -- Turn on cooling
    else
        write(1, LT.On, 0)  -- Turn off cooling
    end
end
```

- `dt` is the delta time in seconds since the last tick
- Module-level code above `tick()` runs once during initialization
- You can still use `sleep()` in module-level code (before tick is defined)

::: tip When to use
Best for **polling** patterns — reading sensors and writing outputs on a regular interval.
:::

## Pattern B: Infinite Loop with `yield`/`sleep`

Don't define `tick()`. Instead, use a `while true` loop with `yield()` or `sleep()`.

```lua
local LT = ic.enums.LogicType

while true do
    local temp = read(0, LT.Temperature)
    if temp ~= nil and temp > 25 then
        write(1, LT.On, 1)
    else
        write(1, LT.On, 0)
    end
    yield()  -- Wait until next tick
end
```

- `yield()` pauses until the next game tick
- `sleep(seconds)` pauses for a real-time duration

::: tip When to use
Best for **sequential logic** — airlock cycles, state machines, multi-step processes where the order of operations matters.
:::

## Pattern C: Hybrid

You can combine both: module-level init code, a main coroutine that yields, *and* a `tick()` function. Both the resumed coroutine and `tick(dt)` can execute in the same tick.

```lua
local LT = ic.enums.LogicType
local count = 0

-- This coroutine runs in parallel with tick()
while count < 10 do
    print("Counting: " .. count)
    count = count + 1
    sleep(1)
end
print("Coroutine finished!")

-- tick() keeps running even after the coroutine ends
function tick(dt)
    local temp = read(0, LT.Temperature)
    write(ic.const.BASE_UNIT_INDEX, LT.Setting, temp or 0)
end
```
