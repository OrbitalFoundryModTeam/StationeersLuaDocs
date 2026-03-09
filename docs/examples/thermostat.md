# Thermostat Controller

A temperature controller with hysteresis deadband to prevent rapid switching.

## Wiring

| Pin | Device |
|---|---|
| `d0` | Gas Sensor (temperature source) |
| `d1` | Wall Cooler or Heater |

## Script

```lua
local LT = ic.enums.LogicType

-- Configuration
local setpoint = 295.0   -- Target temp in Kelvin (~22°C)
local deadband = 2.0     -- ±2K deadband

function tick(dt)
    local temp = read(0, LT.Temperature)
    if temp == nil then return end

    if temp > setpoint + deadband then
        write(1, LT.On, 1)   -- Too hot — turn on cooling
    elseif temp < setpoint - deadband then
        write(1, LT.On, 0)   -- Cool enough — turn off
    end
    -- Inside deadband: do nothing (prevents rapid toggling)
end
```

## How It Works

The **deadband** (hysteresis) creates a buffer zone around the setpoint. The cooler only turns on when temperature exceeds `setpoint + deadband` and only turns off when it drops below `setpoint - deadband`. This prevents rapid on/off cycling that wastes power and stresses equipment.

## Advanced: PID Controller

For smoother control with variable-output devices, use a PID loop:

```lua
local LT = ic.enums.LogicType

local setpoint = 295.0
local kp, ki, kd = 2.0, 0.1, 0.5
local integral, prev_error = 0, 0

function tick(dt)
    local temp = read(0, LT.Temperature)
    if temp == nil then return end

    local error = setpoint - temp
    integral = integral + error * dt
    integral = math.max(-100, math.min(100, integral))  -- Anti-windup
    local derivative = (error - prev_error) / dt
    prev_error = error

    local output = kp * error + ki * integral + kd * derivative
    output = math.max(0, math.min(100, output))

    write(1, LT.Setting, output)
end
```
