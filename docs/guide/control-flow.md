# Control Flow

## `yield()`

Pauses the script until the next game tick. Use in a loop to run code once per tick:

```lua
while true do
    local temp = read(0, ic.enums.LogicType.Temperature)
    print("Temp: " .. tostring(temp))
    yield()
end
```

## `sleep(seconds)`

Pauses the script for a real-time duration. The runtime counts down across ticks:

```lua
print("Starting...")
sleep(5)
print("5 seconds later!")
```

## `tick(dt)`

If you define a global function named `tick`, it's called automatically every game tick:

```lua
function tick(dt)
    -- dt = seconds since last tick (~0.5s typically)
    print("Delta: " .. dt)
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
