# Pub/Sub Messaging

Topic-based publish/subscribe on top of the data network. Publishers don't need to know subscribers, and subscribers can use wildcard patterns.

## Publishing

```lua
-- Simple publish
ic.net.publish("sensors/temp", { temp = 300, zone = "HAB-1" })

-- Publish with options
ic.net.publish("sensors/temp", { temp = 300 }, {
    retain = true,        -- New subscribers get the last retained value immediately
    ttl = 60,             -- Retained message expires after 60 seconds
    include_self = false  -- Don't deliver to self (default)
})

-- Clear a retained message by publishing nil
ic.net.publish("sensors/temp", nil, { retain = true })
```

## Subscribing

```lua
-- Subscribe to an exact topic
ic.net.subscribe("sensors/temp", function(topic, payload, fromId, fromName, retained)
    local prefix = retained and "[RETAINED] " or ""
    print(prefix .. "Temp from " .. fromName .. ": " .. payload.temp)
end)

-- Subscribe with wildcards
-- * matches any sequence of characters
-- ? matches a single character
ic.net.subscribe("sensors/*", function(topic, payload, fromId, fromName, retained)
    print("Got " .. topic .. " from " .. fromName)
end)

-- Subscribe by handler name (better for save/load)
function onSensor(topic, payload, fromId, fromName, retained)
    print(topic .. ": " .. tostring(payload))
end
ic.net.subscribe("sensors/*", "onSensor")

-- Unsubscribe
ic.net.unsubscribe("sensors/*")
```

## Topic Rules

| Rule | Detail |
|---|---|
| Max length | 128 characters |
| Wildcards | `*` (any sequence), `?` (single char) |
| Retained | New subscribers get the last retained value on subscription |
| TTL | Retained messages auto-expire after `ttl` seconds |
| Delivery | Only chips with a matching subscription are sent the message |
| Queue limit | 128 messages per subscriber queue (backpressure) |

## Delivery and backpressure

A publish is only queued on chips that have a matching `ic.net.subscribe` filter. Chips that never subscribed cost the publisher nothing and never spend any of their own tick on your topic, so a busy topic cannot crowd out unrelated traffic on the same network.

`ic.net.publish` returns two values:

```lua
local delivered, dropped = ic.net.publish("sensors/temp", { temp = 300 })

if delivered == 0 then
    print("nobody is subscribed to sensors/temp")
end

if dropped > 0 then
    print(dropped .. " subscriber(s) could not keep up")
end
```

`delivered` counts **matching subscribers**. `dropped` counts subscribers whose queue was full, which previously failed silently.

::: tip Publishing faster than subscribers consume
A subscriber drains its queue using a per-tick instruction budget (see [Sandbox & Limits](/guide/sandbox)). If `dropped` keeps climbing, the subscriber's handler is too slow or the publish rate is too high. Publishing one table instead of many individual values is usually the fix.
:::

## Example: Sensor Network

**Publisher chip** (attached to sensors):
```lua
local LT = ic.enums.LogicType

while true do
    local temp = ic.read(0, LT.Temperature) or 0
    local pressure = ic.read(0, LT.Pressure) or 0
    
    ic.net.publish("sensors/local", {
        temp = temp,
        pressure = pressure,
    }, { retain = true, ttl = 30 })
    
    sleep(5)
end
```

**Subscriber chip** (dashboard):
```lua
ic.net.subscribe("sensors/*", function(topic, payload)
    print(topic .. ": temp=" .. payload.temp .. " pressure=" .. payload.pressure)
end)

while true do yield() end
```

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `ic.net.publish(topic, payload [, opts])` | delivered, dropped | Publish to matching subscribers |
| `ic.net.subscribe(pattern, handler)` | — | Subscribe to topic pattern |
| `ic.net.unsubscribe(pattern)` | — | Unsubscribe from topic |
