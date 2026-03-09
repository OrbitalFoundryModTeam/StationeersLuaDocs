# Airlock Controller

Sequential airlock cycling with depressurize/pressurize phases.

## Wiring

| Pin | Device |
|---|---|
| `d0` | Inner Door |
| `d1` | Outer Door |
| `d2` | Active Vent |

## Script

```lua
local LT = ic.enums.LogicType

local INNER = 0
local OUTER = 1
local VENT  = 2

local function close_all()
    write(INNER, LT.Open, 0)
    write(OUTER, LT.Open, 0)
end

local function depressurize()
    close_all()
    write(VENT, LT.On, 1)
    write(VENT, LT.Mode, 0)   -- Outward
    sleep(5)
    write(VENT, LT.On, 0)
end

local function pressurize()
    close_all()
    write(VENT, LT.On, 1)
    write(VENT, LT.Mode, 1)   -- Inward
    sleep(5)
    write(VENT, LT.On, 0)
end

-- Cycle: inner open → close → depressurize → outer open → close → pressurize
while true do
    pressurize()
    write(INNER, LT.Open, 1)
    sleep(5)
    close_all()
    depressurize()
    write(OUTER, LT.Open, 1)
    sleep(5)
    close_all()
end
```

## How It Works

The airlock cycles through a safe sequence: pressurize the chamber, open the inner door, wait, close, depressurize, open the outer door, wait, close, and repeat. The `sleep()` calls naturally pause execution — no state machine needed.
