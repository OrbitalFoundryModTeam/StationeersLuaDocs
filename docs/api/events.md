# Events

Register handlers for custom events fired by other mods or the game.

## Usage

```lua
-- Register by function reference
ic.events.on("myEvent", function(arg)
    print("Event received with arg: " .. tostring(arg))
end)

-- Register by function name (survives save/load better)
function handleMyEvent(arg)
    print("Got event: " .. tostring(arg))
end
ic.events.on("myEvent", "handleMyEvent")

-- Unregister
ic.events.off("myEvent")
```

## Event Timing

Events are processed at the **start of each tick**, before the main coroutine resumes and before `tick(dt)` is called.

::: info
Events are primarily used by companion mods (like ScriptedScreens) to deliver UI input events to scripts. The base game does not fire Lua events on its own.
:::

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `ic.events.on(name, handler)` | — | Register event handler (function or string name) |
| `ic.events.off(name)` | — | Unregister event handler |
