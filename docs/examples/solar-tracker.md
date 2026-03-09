# Solar Tracker

Automatically orient all solar panels on the network to face the sun.

## Wiring

| Pin | Device |
|---|---|
| `d0` | Daylight Sensor |

## Script

```lua
local LT  = ic.enums.LogicType
local LBM = ic.enums.LogicBatchMethod

local panelHash = hash("StructureSolarPanel")

function tick(dt)
    local sensorV = read(0, LT.Vertical)
    local sensorH = read(0, LT.Horizontal)
    if sensorV == nil or sensorH == nil then return end

    -- Solar panels need +90° offset from sensor vertical angle
    batch_write(panelHash, LT.Vertical, sensorV + 90)
    batch_write(panelHash, LT.Horizontal, sensorH)
end
```

## How It Works

The **Daylight Sensor** reports the sun's position as vertical and horizontal angles. Solar panels need to face the sun directly, but their coordinate system is offset by 90° on the vertical axis. The script reads the sensor and batch-writes to all solar panels on the data network every tick.
