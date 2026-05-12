# Device I/O

Pin- and id-based logic access uses **`ic.read` / `ic.write`** (and related helpers on `ic`). The same functions are also available as **`logic_read` / `logic_write`** / **`logic_batch_read`** / … on the global environment for IC10-style naming.

Devices are connected to the IC housing via **device pins** (`d0` through `d5`). The housing itself is accessible as `db`, which in Lua is `ic.const.BASE_UNIT_INDEX` (typically index 6).

## Reading Logic Values

```lua
local LT = ic.enums.LogicType

-- Read temperature from device on pin d0
local temp = ic.read(0, LT.Temperature)

-- Returns nil if the device is missing or disconnected
if temp == nil then
    print("No device on d0!")
end
```

### By Device Index

```lua
-- ic.read(deviceIndex, logicType [, networkIndex])
local temp = ic.read(0, LT.Temperature)
local temp = ic.read(0, LT.Temperature, 0)  -- with network index
```

### By Reference ID

For stable addressing that doesn't depend on pin wiring. Get a device's ReferenceId via `device_list()` or `ic.find()`:

```lua
-- Find a device by its label (set with the Labeller tool)
local id = ic.find("My Sensor")
if id then
    local temp = ic.read_id(id, LT.Temperature)
    ic.write_id(id, LT.On, 1)
end

-- Or get all matching devices
local ids = ic.find_all("Solar Panel")
for _, id in ipairs(ids) do
    ic.write_id(id, LT.On, 1)
end

-- Optional match mode (3rd arg): "auto" (default), "exact", "glob", "regex" (.NET).
-- Use nil for networkIndex when you only pass mode, e.g.:
-- local id = ic.find("(?i)power", "regex")
-- local id = ic.find("2 * 5kPa", "exact")
```

## Writing Logic Values

```lua
-- ic.write(deviceIndex, logicType, value [, networkIndex])
ic.write(0, LT.On, 1)
ic.write(1, LT.Setting, 42)

-- By reference ID
-- ic.write_id(deviceId, logicType, value [, networkIndex])
ic.write_id(id, LT.On, 1)
```

::: warning
`ic.write()` can throw if the device is missing. Use `pcall()` for safe writes:

```lua
local ok, err = pcall(ic.write, 0, LT.On, 1)
```

:::

## Device Labels & Names

```lua
-- Set the display name of a device
device_label(0, "Main Sensor")
ic.device_label(0, "Main Sensor")  -- same; nested form is ic.device.label(...)

-- Get the live display name
local name = device_name(0)

-- Get a prefab name from a hash
local prefab = prefab_name(-2045627372)  -- "SolarPanel"

-- Resolve a nameHash by scanning visible devices
local resolved = namehash_name(deviceHash, nameHash)
```

On **ScriptedScreens** motherboards/circuitboards, optional **pin hints** for the config screen (what *your* script uses each `d0`–`d5` wire for) are separate from `device_label`: use `ss.pin_label(0, "…")` … `ss.pin_label(5, "…")` (see ScriptedScreens docs).

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

| Field          | Type   | Description                                   |
| -------------- | ------ | --------------------------------------------- |
| `ref_id`       | number | Device ReferenceId (for `ic.read_id` / `ic.write_id`) |
| `prefab_hash`  | number | Prefab hash (for `ic.batch_read` / `ic.batch_write`)  |
| `name_hash`    | number | Name hash                                     |
| `display_name` | string | Current display name                          |

Accepts an optional `networkIndex`: `device_list(networkIndex)`.

## Host Info

`ic.host_info()` returns metadata about the chip's host device — the thing the chip is physically installed in:

```lua
local info = ic.host_info()
print(info.name)         -- "Hardsuit", "Circuit Housing", etc.
print(info.ref_id)       -- host ReferenceId
print(info.prefab_hash)  -- host prefab hash
print(info.type)         -- "suit", "scripted_visor", "circuit_housing", "tablet", "motherboard", "device", or "unknown"
```

| Field         | Type           | Description                                            |
| ------------- | -------------- | ------------------------------------------------------ |
| `name`        | string         | Display name of the host device                        |
| `ref_id`      | number         | Host device ReferenceId                                |
| `prefab_hash` | number         | Host device prefab hash                                |
| `type`        | string         | Host category (see below)                              |
| `wearer`      | string \| nil  | Player name for wearable hosts (`suit`, `scripted_visor`) |
| `wearer_ref_id` | number \| nil | Wearer ReferenceId for wearable hosts                  |
| `wearer_prefab_hash` | number \| nil | Wearer prefab hash for wearable hosts           |

**Type values:**

| Type              | Host device                                       |
| ----------------- | ------------------------------------------------- |
| `"suit"`          | EVA suit (HardSuit, SpaceSuit, etc.)               |
| `"scripted_visor"` | ScriptedScreens programmable visor                 |
| `"circuit_housing"` | Standard IC housing                              |
| `"tablet"`        | Tablet                                             |
| `"motherboard"`   | Standalone motherboard / circuitboard item          |
| `"device"`        | Pipe device, machine, or other `Device` subclass   |
| `"unknown"`       | Unrecognized host                                  |

Lua chips in **pipe-style machine hosts** (for example filtration units, deep miners, dispersal towers — types using `DeviceInputOutputCircuit`) report `type` `"device"` and behave like other powered device hosts on their data network.

For wearable hosts, the `wearer` field contains the display name of the player currently wearing the item. This is particularly useful for multiplayer telemetry:

```lua
local info = ic.host_info()
if (info.type == "suit" or info.type == "scripted_visor") and info.wearer then
    ic.net.publish("suit/telemetry", {
        player = info.wearer,
        pressure = ic.read(ic.const.BASE_UNIT_INDEX, LT.Pressure),
    }, { retain = true, ttl = 30 })
end
```

## Network Index

Most read/write functions accept an optional `networkIndex` parameter for multi-network setups:

```lua
local value = ic.read(0, LT.Temperature, 0)
local ch0 = ic.read(ic.const.BASE_UNIT_INDEX, LT.Channel0, 0)
```

## Function Reference

| Function                                   | Returns       | Description                                          |
| ------------------------------------------ | ------------- | ---------------------------------------------------- |
| `ic.read(dev, logicType [, net])`             | number \| nil | Read logic value                                     |
| `ic.write(dev, logicType, value [, net])`     | —             | Write logic value                                    |
| `ic.read_id(id, logicType [, net])`           | number \| nil | Read by ReferenceId                                  |
| `ic.write_id(id, logicType, value [, net])`   | —             | Write by ReferenceId                                 |
| `ic.find(name [, mode [, net]])`              | number \| nil | Find by display name; `mode`: auto / exact / glob / regex; a single number is `net` only |
| `ic.find_all(name [, mode [, net]])`          | number[]      | Find all matches; same modes as `ic.find`                 |
| `device_name(dev [, net])`                 | string \| nil | Get device display name                              |
| `device_label(dev, name)`                  | —             | Set device label (also `ic.device_label`) |
| `device_list([net])`                       | table[]       | List all network devices                             |
| `prefab_name(hash)`                        | string \| nil | Hash → prefab name                                   |
| `namehash_name(devHash, nameHash [, net])` | string \| nil | Resolve nameHash                                     |
| `ic.host_info()`                           | table         | Host device metadata (name, type, wearer for wearable hosts)  |
| `raise_error(state)`                       | —             | Set the IC housing error state (1=error, 0=clear)    |
| `clear_error()`                            | —             | Clear the IC housing error state                     |
| `hcf()`                                    | —             | Halt and catch fire (stops the chip)                 |
