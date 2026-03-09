# Getting Started

This guide walks you through creating and running your first Lua script on a programmable chip in Stationeers.

## What You Need

1. A Stationeers world with **BepInEx**, **StationeersLaunchPad**, and **IC10Editor** installed
2. The **StationeersLua** mod in your `mods/` folder
3. An **Integrated Circuit (Lua)** item (prefab: `ItemIntegratedCircuitLua`)

## Your First Script

1. Craft or spawn an **Integrated Circuit (Lua)**
2. Insert it into any **IC Housing** (or Advanced IC Housing)
3. Open the housing's code editor
4. If your script is getting too long, click the **`?`** button in IC10Editor to disable the script-length and line-length limits
5. Paste this:

```lua
-- Blink a light on d0 every second
local LT = ic.enums.LogicType
local on = false

while true do
    on = not on
    write(0, LT.On, on and 1 or 0)
    sleep(1)
end
```

6. Save. The light on device pin **d0** will blink on/off every second.

::: tip
The editor automatically detects Lua code. A `-- LUA_SRC` marker is appended internally when you save — you never need to add it yourself.
:::

## Understanding the Script

Let's break down what's happening:

```lua
-- Load the LogicType enum for readable property names
local LT = ic.enums.LogicType  -- [!code focus]

-- Track our on/off state
local on = false

-- Main loop — runs forever
while true do
    on = not on                          -- Toggle the state
    write(0, LT.On, on and 1 or 0)      -- Write to device on pin d0  // [!code focus]
    sleep(1)                             -- Wait 1 second  // [!code focus]
end
```

- **`ic.enums.LogicType`** — Game enum containing property names like `On`, `Temperature`, `Pressure`, etc.
- **`write(0, LT.On, value)`** — Write a value to the device connected to pin `d0`
- **`sleep(1)`** — Pause execution for 1 second (the script resumes automatically)

## Reading Sensor Data

Here's a more practical example — a temperature controller:

```lua
local LT = ic.enums.LogicType

-- Read temperature from a sensor on d0
-- Control a cooler on d1
local SETPOINT = 295  -- ~22°C in Kelvin

function tick(dt)
    local temp = read(0, LT.Temperature)
    
    -- read() returns nil if device is missing
    if temp == nil then return end
    
    if temp > SETPOINT + 2 then
        write(1, LT.On, 1)  -- Turn on cooler
    elseif temp < SETPOINT - 2 then
        write(1, LT.On, 0)  -- Turn off cooler
    end
end
```

::: info Two Script Patterns
**Pattern A: `tick(dt)`** — Define a global `tick` function. Called every game tick (~0.5s). Great for polling sensors.

**Pattern B: `while true do ... yield() end`** — Use a loop with `yield()` or `sleep()`. More natural for sequential logic like airlock cycles.

Both are valid. Choose whichever fits your use case.
:::

## Using Batch Operations

Control all devices of a type on the network at once:

```lua
local LT  = ic.enums.LogicType
local LBM = ic.enums.LogicBatchMethod

-- Hash the prefab name to get the device type ID
local sensorHash = hash("StructureGasSensor")
local lightHash  = hash("StructureWallLight")

function tick(dt)
    -- Read average temperature from ALL gas sensors on the network
    local avgTemp = batch_read(sensorHash, LT.Temperature, LBM.Average)
    
    if avgTemp ~= nil and avgTemp > 310 then
        -- Turn on ALL wall lights (as a warning)
        batch_write(lightHash, LT.On, 1)
        batch_write(lightHash, LT.Color, 2)  -- Red
    else
        batch_write(lightHash, LT.On, 0)
    end
end
```

## Next Steps

- **[How Lua Chips Work](/guide/how-it-works)** — Understand the execution lifecycle
- **[Device I/O API](/api/device-io)** — Full reference for reading and writing devices
- **[Common Patterns](/examples/patterns)** — Copy-paste recipes for common automation tasks
- **[Migrating from IC10](/guide/migrating-from-ic10)** — Quick translation table if you're coming from IC10
