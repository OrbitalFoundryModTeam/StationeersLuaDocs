# Error Handling

## Nil-Checking Reads

Most logic **read** helpers on `ic` (`ic.read`, `ic.read_id`, `ic.read_slot`, ...) return `nil` when a device is **missing or disconnected**:

```lua
local temp = ic.read(0, LT.Temperature)
if temp == nil then
    -- Device missing or disconnected
    return
end
```

If a connected device **does not support the requested logic type**, these functions raise a Lua error rather than returning `nil`. If you are reading a property that might not be present on all devices, wrap the call in `pcall()`:

```lua
local ok, temp = pcall(ic.read, 0, LT.Temperature)
if not ok or temp == nil then return end
```

## Protected Calls for Writes

`ic.write()` can throw if the device is missing or the logic type is not writable. Use `pcall()` for safe writes:

```lua
local ok, err = pcall(function()
    ic.write(0, LT.On, 1)
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
local value = ic.read(0, LT.Temperature)
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
    local temp = ic.read(0, LT.Temperature)
    if temp == nil then
        -- No sensor — set error state and bail
        pcall(ic.write, ic.const.BASE_UNIT_INDEX, LT.Error, 1)
        return
    end
    
    -- Valid data — clear error and process
    pcall(ic.write, ic.const.BASE_UNIT_INDEX, LT.Error, 0)
    
    -- Safe write with error handling
    local ok = pcall(ic.write, 1, LT.On, temp > 300 and 1 or 0)
    if not ok then
        print("Warning: output device on d1 not connected")
    end
end
```
