# Sensor Network (Pub/Sub)

A distributed sensor network using topic-based pub/sub messaging between Lua chips.

## Publisher Chip

Place this chip with sensors in each zone:

```lua
local LT = ic.enums.LogicType

-- Label this housing with the zone name (e.g., "HAB-1")
local zoneName = device_name(ic.const.BASE_UNIT_INDEX) or "Unknown"

while true do
    local temp     = read(0, LT.Temperature) or 0
    local pressure = read(0, LT.Pressure) or 0
    local o2       = read(0, LT.RatioOxygen) or 0

    ic.net.publish("sensors/" .. zoneName, {
        zone     = zoneName,
        temp     = temp,
        pressure = pressure,
        o2       = o2,
    }, { retain = true, ttl = 30 })

    sleep(5)
end
```

## Subscriber Chip (Dashboard)

A central dashboard that collects data from all zones:

```lua
local zones = {}

-- Subscribe to all sensor topics using wildcard
ic.net.subscribe("sensors/*", function(topic, payload, fromId, fromName)
    if type(payload) == "table" and payload.zone then
        zones[payload.zone] = payload
    end
end)

function tick(dt)
    -- Display current zone data
    for name, data in pairs(zones) do
        local tempC = data.temp - 273.15
        print(string.format("%s: %.1f°C  %.0f kPa  O2=%.0f%%",
            name, tempC, data.pressure, data.o2 * 100))
    end
end
```

## How It Works

- **Publishers** send sensor readings to topics like `sensors/HAB-1`, `sensors/HAB-2`, etc.
- The `retain = true` option ensures new subscribers immediately get the latest value
- The `ttl = 30` causes retained messages to expire if the publisher goes offline
- **Subscribers** use `sensors/*` wildcard to receive all zone updates
- Each zone's data is stored in a `zones` table for display
