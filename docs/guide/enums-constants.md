# Enumerations & Constants

## Game Enumerations

Game enumerations are available under `ic.enums`. Each enum table maps **name → integer value**.

```lua
local LT  = ic.enums.LogicType         -- On, Off, Temperature, Pressure, ...
local LST = ic.enums.LogicSlotType      -- Occupied, Quantity, Charge, ...
local LBM = ic.enums.LogicBatchMethod   -- Average, Sum, Minimum, Maximum
local LRM = ic.enums.LogicReagentMode   -- TotalContents, ...
```

### LogicType (commonly used values)

| Name | Description |
|---|---|
| `On` | Device power state (0/1) |
| `Open` | Door/vent open state |
| `Temperature` | Temperature in Kelvin |
| `Pressure` | Pressure in kPa |
| `Setting` | Generic setting value |
| `Mode` | Device operating mode |
| `Activate` | Sensor activation state |
| `Charge` | Battery charge (Joules) |
| `Maximum` | Battery max charge |
| `Ratio` | Generic ratio (0-1) |
| `Power` | Power draw (Watts) |
| `Vertical` | Vertical angle |
| `Horizontal` | Horizontal angle |
| `Color` | Paint color index |
| `Error` | Error flag |
| `PrefabHash` | Device prefab hash |
| `Channel0`–`Channel7` | Data network channels |
| `RatioOxygen` | O₂ gas ratio |
| `RatioCarbonDioxide` | CO₂ gas ratio |
| `RatioNitrogen` | N₂ gas ratio |
| `RatioPollutant` | Pollutant gas ratio |
| `RatioVolatiles` | Volatiles gas ratio |
| `RatioWater` | H₂O gas ratio |
| `RatioNitrousOxide` | N₂O gas ratio |
| `RatioHydrogen` | H₂ gas ratio |

### LogicBatchMethod

| Name | Description |
|---|---|
| `Average` | Average of all matching values |
| `Sum` | Sum of all matching values |
| `Minimum` | Smallest value |
| `Maximum` | Largest value |

### LogicSlotType (commonly used)

| Name | Description |
|---|---|
| `Occupied` | Whether the slot has an item (0/1) |
| `Quantity` | Stack count in slot |
| `Charge` | Charge level of item in slot |
| `MaxQuantity` | Max stack size |
| `PrefabHash` | Prefab hash of item in slot |

## Constants

Constants are under `ic.const`:

```lua
local DB = ic.const.BASE_UNIT_INDEX      -- Housing device index (typically 6)
local BN = ic.const.BASE_NETWORK_INDEX   -- Base network index
```

### `BASE_UNIT_INDEX`

This is the device index for the IC Housing itself (equivalent to `db` in IC10). Use it to read/write the housing's own logic values:

```lua
-- Write a value to the housing's Setting display
write(ic.const.BASE_UNIT_INDEX, LT.Setting, 42)

-- Read the housing's power state
local powered = read(ic.const.BASE_UNIT_INDEX, LT.On)
```

## Using Enums

```lua
local LT = ic.enums.LogicType

-- Use enum names for readable code
print(LT.Temperature)  -- prints the integer value
print(LT.On)           -- prints the integer value

-- Compare with enum values
local temp = read(0, LT.Temperature)
```
