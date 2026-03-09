# Error Handling

## Nil-Checking Reads

Most `read*` functions return `nil` when a device is missing or doesn't support the requested property:

```lua
local temp = read(0, LT.Temperature)
if temp == nil then
    -- Device missing, disconnected, or doesn't support this logic type
    return
end
```

## Protected Calls for Writes

`write()` can throw if the device is missing. Use `pcall()` for safe writes:

```lua
local ok, err = pcall(function()
    write(0, LT.On, 1)
end)
if not ok then
    print("Write failed: " .. tostring(err))
end
```

## Network Error Handling

```lua
local ok, err = pcall(function()
    ic.net.send("Target", "channel", { data = 123 })
end)
if not ok then
    print("Network send failed: " .. tostring(err))
end
```

## NaN Detection

```lua
local value = read(0, LT.Temperature)
if value ~= nil and value == value then  -- NaN check: NaN ~= NaN
    -- value is a valid number
end
```

## Defensive Template

Here's a robust pattern for a sensor-driven controller:

```lua
local LT = ic.enums.LogicType

function tick(dt)
    -- Safely read with nil check
    local temp = read(0, LT.Temperature)
    if temp == nil then
        -- No sensor — set error state and bail
        pcall(write, ic.const.BASE_UNIT_INDEX, LT.Error, 1)
        return
    end
    
    -- Valid data — clear error and process
    pcall(write, ic.const.BASE_UNIT_INDEX, LT.Error, 0)
    
    -- Safe write with error handling
    local ok = pcall(write, 1, LT.On, temp > 300 and 1 or 0)
    if not ok then
        print("Warning: output device on d1 not connected")
    end
end
```
