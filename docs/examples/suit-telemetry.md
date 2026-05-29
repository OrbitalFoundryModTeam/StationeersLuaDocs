# Suit Telemetry Dashboard

A multiplayer suit monitoring system where each player's EVA suit chip broadcasts vital stats via pub/sub, and a ScriptedScreens console displays a live per-player dashboard.

## Suit Chip (Publisher)

Install this on a Lua chip inside each player's suit. Requires a Wireless Development Board connected to a shared wireless data access point network.

```lua
local LT   = ic.enums.LogicType
local read  = ic.read
local SELF  = ic.const.BASE_UNIT_INDEX

local PUBLISH_INTERVAL = 5
local elapsed = 0

local info = ic.host_info()
print("[SuitTelemetry] Started for " .. (info.wearer or "no wearer (suit not equipped)"))

function tick(dt)
    elapsed = elapsed + dt
    if elapsed < PUBLISH_INTERVAL then return end
    elapsed = 0

    local info = ic.host_info()
    local player = info.wearer

    -- Don't publish when suit is not worn (in inventory, suit storage, etc.)
    if not player or player == "" then return end

    local stats = {
        player       = player,
        ext_pressure = read(SELF, LT.PressureExternal) or 0,
        ext_temp     = read(SELF, LT.TemperatureExternal) or 0,
        int_pressure = read(SELF, LT.Pressure) or 0,
        o2_ratio     = read(SELF, LT.RatioOxygen) or 0,
        pos_x        = read(SELF, LT.PositionX) or 0,
        pos_y        = read(SELF, LT.PositionY) or 0,
        pos_z        = read(SELF, LT.PositionZ) or 0,
    }

    ic.net.publish("suit/telemetry", stats, { retain = true, ttl = 30 })
end
```

## Console Script (Subscriber)

Load this ScriptedScreens script on a console or tablet on the same network. It subscribes to all suit telemetry and renders a live table.

```lua
local ui = ss.ui.surface("main")
ss.ui.activate("main")

local players = {}      -- player name -> stats table
local playerOrder = {}   -- ordered list of names

ic.net.subscribe("suit/telemetry", function(topic, payload, fromId, fromName, retained)
    if type(payload) ~= "table" or not payload.player then return end

    local name = payload.player
    if name == "" or name == "Unknown" then return end

    -- Track insertion order
    local found = false
    for _, n in ipairs(playerOrder) do
        if n == name then found = true; break end
    end
    if not found then table.insert(playerOrder, name) end

    players[name] = {
        ext_pressure = payload.ext_pressure,
        ext_temp     = payload.ext_temp,
        int_pressure = payload.int_pressure,
        o2_ratio     = payload.o2_ratio,
        pos_x        = payload.pos_x,
        pos_y        = payload.pos_y,
        pos_z        = payload.pos_z,
        time         = util.game_time(),
    }
end)

function tick(dt)
    -- Prune stale players (no update for 60s)
    local now = util.game_time()
    for i = #playerOrder, 1, -1 do
        local name = playerOrder[i]
        local d = players[name]
        if not d or (now - d.time) > 60 then
            players[name] = nil
            table.remove(playerOrder, i)
        end
    end

    -- Build table rows
    local rows = {}
    for _, name in ipairs(playerOrder) do
        local d = players[name]
        if d then
            table.insert(rows, {
                name,
                string.format("%.1f", d.int_pressure),
                string.format("%.0f%%", (d.o2_ratio or 0) * 100),
                string.format("%.1f", d.ext_pressure),
                string.format("%.0f K", d.ext_temp),
            })
        end
    end

    ui:clear()
    ui:element({
        id = "title",
        type = "label",
        rect = { unit = "%", x = 0, y = 2, w = 100, h = 6 },
        props = { text = "EVA SUIT TELEMETRY" },
        style = { color = "#06B6D4", font_size = 18, align = "center" },
    })
    ui:element({
        id = "tbl",
        type = "table",
        rect = { unit = "%", x = 5, y = 10, w = 90, h = 85 },
        props = {
            columns = { "Player", "Int kPa", "O2", "Ext kPa", "Ext Temp" },
            rows = rows,
        },
        style = {
            color = "#E2E8F0",
            headerColor = "#1E293B",
            font_size = 12,
        },
    })
    ui:commit()

    sleep(2)
end
```

## How It Works

- **`ic.host_info()`** lets the suit chip discover who is wearing the suit — `info.wearer` returns the player's display name, or `nil` when the suit is not worn (in inventory, suit storage, on the ground, etc.)
- The publisher skips publishing when `wearer` is `nil` or empty, so unequipped suits never appear on the dashboard
- Each suit chip publishes to the same `"suit/telemetry"` topic with `retain = true` so the dashboard gets the latest values immediately on subscribe
- `ttl = 30` causes retained messages to expire if a player logs off or removes the suit — the entry disappears from the dashboard automatically
- The dashboard prunes any player whose data is older than 60 seconds
- All communication happens over the shared wireless data network via the Wireless Development Board

## Setup

1. Install a Lua chip in each player's suit with the publisher script
2. Install a Wireless Development Board in each suit, connected to a shared wireless data access point network
3. Place a ScriptedScreens console on the same data network
4. Load the subscriber script onto the console

::: tip
The `ic.const.BASE_UNIT_INDEX` constant is the Lua equivalent of IC10's `db` — it addresses the host device itself (the suit, housing, etc.).
:::
