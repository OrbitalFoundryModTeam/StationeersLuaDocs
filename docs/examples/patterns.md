# Common Patterns

Copy-paste recipes for common Stationeers automation tasks.

## Thermostat

```lua
local LT = ic.enums.LogicType

local setpoint = 22.0   -- Target temperature in Celsius
local hysteresis = 1.0   -- Deadband to prevent rapid switching

function tick(dt)
    local temp = read(0, LT.Temperature)
    if temp == nil then return end

    -- Convert Kelvin to Celsius
    local tempC = temp - 273.15

    if tempC > setpoint + hysteresis then
        write(1, LT.On, 1)   -- Turn on cooling
    elseif tempC < setpoint - hysteresis then
        write(1, LT.On, 0)   -- Turn off cooling
    end
end
```

## Solar Tracker

```lua
local LT  = ic.enums.LogicType
local LBM = ic.enums.LogicBatchMethod

local panelHash = hash("StructureSolarPanel")

function tick(dt)
    local sensorV = read(0, LT.Vertical)
    local sensorH = read(0, LT.Horizontal)
    if sensorV == nil or sensorH == nil then return end

    batch_write(panelHash, LT.Vertical, sensorV + 90)
    batch_write(panelHash, LT.Horizontal, sensorH)
end
```

## Airlock Controller

```lua
local LT = ic.enums.LogicType

local INNER_DOOR = 0
local OUTER_DOOR = 1
local VENT = 2

local function close_all()
    write(INNER_DOOR, LT.Open, 0)
    write(OUTER_DOOR, LT.Open, 0)
end

local function depressurize()
    close_all()
    write(VENT, LT.On, 1)
    write(VENT, LT.Mode, 0)  -- Outward mode
    sleep(5)
    write(VENT, LT.On, 0)
end

local function pressurize()
    close_all()
    write(VENT, LT.On, 1)
    write(VENT, LT.Mode, 1)  -- Inward mode
    sleep(5)
    write(VENT, LT.On, 0)
end

while true do
    pressurize()
    write(INNER_DOOR, LT.Open, 1)
    sleep(5)
    close_all()
    depressurize()
    write(OUTER_DOOR, LT.Open, 1)
    sleep(5)
    close_all()
end
```

## Sensor Hub (Pub/Sub)

```lua
local LT = ic.enums.LogicType

while true do
    local temp = read(0, LT.Temperature) or 0
    local pressure = read(0, LT.Pressure) or 0

    ic.net.publish("sensors/local", {
        temp = temp,
        pressure = pressure,
    }, { retain = true, ttl = 30 })

    sleep(5)
end
```

## Rolling Average

```lua
local LT = ic.enums.LogicType

local buffer = {}
local WINDOW = 20

function tick(dt)
    local temp = read(0, LT.Temperature)
    if temp == nil then return end

    table.insert(buffer, temp)
    if #buffer > WINDOW then
        table.remove(buffer, 1)
    end

    local sum = 0
    for _, v in ipairs(buffer) do sum = sum + v end
    local avg = sum / #buffer

    write(ic.const.BASE_UNIT_INDEX, LT.Setting, avg)
end
```

## Persistent Counter

```lua
-- Counter that survives save/load via chip memory
local ADDR_COUNT = 0

local count = mem_read(ADDR_COUNT) or 0

function tick(dt)
    count = count + 1
    mem_write(ADDR_COUNT, count)
    write(ic.const.BASE_UNIT_INDEX, ic.enums.LogicType.Setting, count)
end
```

## Device Discovery

```lua
-- List all devices on the data network
local devices = device_list()

for i, dev in ipairs(devices) do
    print(string.format("[%d] %s (hash=%d, id=%d)",
        i, dev.display_name, dev.prefab_hash, dev.ref_id))
end
```

## Gas Ratio Monitor

```lua
local LT = ic.enums.LogicType

function tick(dt)
    local o2   = read(0, LT.RatioOxygen) or 0
    local co2  = read(0, LT.RatioCarbonDioxide) or 0
    local n2   = read(0, LT.RatioNitrogen) or 0
    local poll = read(0, LT.RatioPollutant) or 0

    print(string.format("O2=%.1f%% CO2=%.1f%% N2=%.1f%% POL=%.1f%%",
        o2 * 100, co2 * 100, n2 * 100, poll * 100))
end
```
