# Device I/O

Devices are connected to the IC housing via **device pins** (`d0` through `d5`). The housing itself is accessible as `db`, which in Lua is `ic.const.BASE_UNIT_INDEX` (typically index 6).

## Reading Logic Values

```lua
local LT = ic.enums.LogicType

-- Read temperature from device on pin d0
local temp = read(0, LT.Temperature)

-- Returns nil if the device is missing or disconnected
if temp == nil then
    print("No device on d0!")
end
```

### By Device Index

```lua
-- read(deviceIndex, logicType [, networkIndex])
local temp = read(0, LT.Temperature)
local temp = read(0, LT.Temperature, 0)  -- with network index
```

### By Reference ID

For stable addressing that doesn't depend on pin wiring:

```lua
local id = device_id(0)  -- Get the ReferenceId of device on d0

-- read_id(deviceId, logicType [, networkIndex])
local temp = read_id(id, LT.Temperature)
write_id(id, LT.On, 1)
```

## Writing Logic Values

```lua
-- write(deviceIndex, logicType, value [, networkIndex])
write(0, LT.On, 1)
write(1, LT.Setting, 42)

-- By reference ID
-- write_id(deviceId, logicType, value [, networkIndex])
write_id(id, LT.On, 1)
```

::: warning
`write()` can throw if the device is missing. Use `pcall()` for safe writes:
```lua
local ok, err = pcall(write, 0, LT.On, 1)
```
:::

## Device Labels & Names

```lua
-- Set the display name of a device
device_label(0, "Main Sensor")
label(0, "Main Sensor")  -- shorthand

-- Get the live display name
local name = device_name(0)

-- Get the device's ReferenceId
local id = device_id(0)

-- Get a prefab name from a hash
local prefab = prefab_name(-2045627372)  -- "SolarPanel"

-- Resolve a nameHash by scanning visible devices
local resolved = namehash_name(deviceHash, nameHash)
```

## Device List

Enumerate all devices visible on the chip's data cable network:

```lua
local devices = device_list()

for i, dev in ipairs(devices) do
    print(string.format("%d: %s (id=%d, prefab=%d)",
        i, dev.display_name, dev.ref_id, dev.prefab_hash))
end
```

Each entry contains:

| Field | Type | Description |
|---|---|---|
| `ref_id` | number | Device ReferenceId (for `read_id`/`write_id`) |
| `prefab_hash` | number | Prefab hash (for `batch_read`/`batch_write`) |
| `name_hash` | number | Name hash |
| `display_name` | string | Current display name |

Accepts an optional `networkIndex`: `device_list(networkIndex)`.

## Network Index

Most read/write functions accept an optional `networkIndex` parameter for multi-network setups:

```lua
local value = read(0, LT.Temperature, 0)
local ch0 = read(ic.const.BASE_UNIT_INDEX, LT.Channel0, 0)
```

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `read(dev, logicType [, net])` | number \| nil | Read logic value |
| `write(dev, logicType, value [, net])` | — | Write logic value |
| `read_id(id, logicType [, net])` | number \| nil | Read by ReferenceId |
| `write_id(id, logicType, value [, net])` | — | Write by ReferenceId |
| `device_id(dev)` | number | Get device ReferenceId |
| `device_name(dev [, net])` | string \| nil | Get device display name |
| `device_label(dev, name)` | — | Set device label |
| `label(dev, name)` | — | Alias for `device_label` |
| `device_list([net])` | table[] | List all network devices |
| `prefab_name(hash)` | string \| nil | Hash → prefab name |
| `namehash_name(devHash, nameHash [, net])` | string \| nil | Resolve nameHash |
