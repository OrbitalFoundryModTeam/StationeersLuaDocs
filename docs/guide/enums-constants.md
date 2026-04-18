# Enumerations & Constants

## Built-in enumerations

Game enumerations are exposed via names and numeric codes under `ic.enums`. Each table maps **name → integer value** (for use with `ic.read()`, `ic.write()`, and batch helpers).

```lua
local LT  = ic.enums.LogicType         -- On, Off, Temperature, Pressure, ...
local LST = ic.enums.LogicSlotType      -- Occupied, Quantity, Charge, ...
local LBM = ic.enums.LogicBatchMethod   -- Average, Sum, Minimum, Maximum
local LRM = ic.enums.LogicReagentMode   -- TotalContents, ...
local SI  = ic.enums.SorterInstruction  -- Logic Sorter stack opcodes (memory API)
local CO  = ic.enums.ConditionOperation   -- Compare ops inside packed stack words
```

### LogicType (commonly used values)

| Name                    | Description                                 |
| ----------------------- | ------------------------------------------- |
| `On`                    | Device power state (0/1)                    |
| `Open`                  | Door/vent open state                        |
| `Temperature`           | Temperature in Kelvin                       |
| `Pressure`              | Pressure in kPa                             |
| `Setting`               | Generic setting value                       |
| `Mode`                  | Device operating mode                       |
| `Activate`              | Sensor activation state                     |
| `Charge`                | Battery charge (Joules)                     |
| `Maximum`               | Battery max charge                          |
| `Ratio`                 | Generic ratio (0-1)                         |
| `Power`                 | Power draw (Watts)                          |
| `Vertical`              | Vertical angle                              |
| `Horizontal`            | Horizontal angle                            |
| `Color`                 | Paint color index                           |
| `Error`                 | Error flag                                  |
| `PrefabHash`            | Device prefab hash                          |
| `Channel0`–`Channel7`   | Data network channels                       |
| `RatioOxygen`           | O₂ gas ratio                                |
| `RatioCarbonDioxide`    | CO₂ gas ratio                               |
| `RatioNitrogen`         | N₂ gas ratio                                |
| `RatioPollutant`        | Pollutant gas ratio                         |
| `RatioMethane`          | Methane gas ratio (older scripts may still say `RatioVolatiles`) |
| `RatioWater`            | H₂O gas ratio                               |
| `RatioNitrousOxide`     | N₂O gas ratio                               |
| `RatioHydrogen`         | H₂ gas ratio                                |
| `RatioSteam`            | Steam ratio                                 |
| `RatioPollutedWater`    | Polluted water ratio                        |
| `RatioHydrazine`        | Hydrazine ratio                             |
| `RatioLiquidAlcohol`    | Ethanol ratio                               |
| `RatioHelium`           | Helium ratio                                |
| `RatioSilanol`          | Silanol/Coolant ratio                       |
| `RatioHydrochloricAcid` | HCl ratio                                   |
| `RatioOzone`            | Ozone ratio                                 |
| `RatioLiquidOzone`      | Liquid ozone ratio                          |

### More ratio names (liquids and pipes)

Analysers, tanks, and many pipe machines expose **molar ratios** as separate names. Gases use names like `RatioOxygen`; **liquids** use `RatioLiquid…` (for example liquid methane is `RatioLiquidMethane`). Machines with multiple ports often add `Input`, `Input2`, `Output`, and `Output2` suffixes for the same substance.

Typical **liquid** ratio names you can use with `ic.read()` / `ic.write()`:

| Substance (liquid form) | Ratio name |
| ----------------------- | ---------- |
| Liquid nitrogen | `RatioLiquidNitrogen` |
| Liquid oxygen | `RatioLiquidOxygen` |
| Liquid methane | `RatioLiquidMethane` |
| Liquid CO₂ | `RatioLiquidCarbonDioxide` |
| Liquid pollutant | `RatioLiquidPollutant` |
| Liquid nitrous oxide | `RatioLiquidNitrousOxide` |
| Liquid hydrogen | `RatioLiquidHydrogen` |
| Liquid hydrazine | `RatioLiquidHydrazine` |
| Liquid silanol | `RatioLiquidSilanol` |
| Liquid hydrochloric acid | `RatioLiquidHydrochloricAcid` |
| Liquid ozone | `RatioLiquidOzone` |

You can use the optional **`gas` library** (`Examples/LibraryModule_Gas.lua`): it maps `gas.TYPE` flags to the right ratio name for each substance.

### LogicBatchMethod

| Name      | Description                    |
| --------- | ------------------------------ |
| `Average` | Average of all matching values |
| `Sum`     | Sum of all matching values     |
| `Minimum` | Smallest value                 |
| `Maximum` | Largest value                  |

### LogicSlotType (commonly used)

| Name          | Description                        |
| ------------- | ---------------------------------- |
| `Occupied`    | Whether the slot has an item (0/1) |
| `Quantity`    | Stack count in slot                |
| `Charge`      | Charge level of item in slot       |
| `MaxQuantity` | Max stack size                     |
| `PrefabHash`  | Prefab hash of item in slot        |

### SorterInstruction

Opcode names for **Logic Sorter** program rows. Values match the game enum; use them when building filter programs via `ic.mem_put` / `ic.mem_get` on the sorter device (same semantics as IC10 memory on the sorter pin). Full bit packing is vanilla game behavior; see the [Logic Sorter wiki](https://stationeers-wiki.com/Logic_Sorter) for row layout.

| Name | Role |
| ---- | ---- |
| `None` | Unused row / padding |
| `FilterPrefabHashEquals` | Prefab hash equality filter |
| `FilterPrefabHashNotEquals` | Prefab hash inequality filter |
| `FilterSortingClassCompare` | Sorting class compare |
| `FilterSlotTypeCompare` | Slot type compare |
| `FilterQuantityCompare` | Quantity compare |
| `LimitNextExecutionByCount` | Cap executions of the following row |

### ConditionOperation

Comparison mode embedded in packed stack words (for example prefab hash filters pair an opcode with `Equals` or `NotEquals`).

| Name | Role |
| ---- | ---- |
| `Equals` | Equal |
| `Greater` | Greater than |
| `Less` | Less than |
| `NotEquals` | Not equal |

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
ic.write(ic.const.BASE_UNIT_INDEX, LT.Setting, 42)

-- Read the housing's power state
local powered = ic.read(ic.const.BASE_UNIT_INDEX, LT.On)
```

## Editor Completions

Both the in-game IC10Editor and VS Code provide **contextual autocomplete** for enums and constants:

- Typing `ic.enums.` shows all available enum tables (`LogicType`, `LogicSlotType`, `SorterInstruction`, `ConditionOperation`, etc.)
- Typing `ic.enums.LogicType.` shows all members with their numeric values
- Typing `ic.const.` shows all available constants
- When typing the second argument of `ic.read()` or `ic.write()`, `LogicType` members are suggested automatically
- When typing the third argument of `ic.read_slot()`, `LogicSlotType` members are suggested automatically

In VS Code, this requires `EnableLspServer = true` in the mod config. The in-game editor provides these completions automatically.

## Using Enums

```lua
local LT = ic.enums.LogicType

-- Use enum names for readable code
print(LT.Temperature)  -- prints the integer value
print(LT.On)           -- prints the integer value

-- Compare with enum values
local temp = ic.read(0, LT.Temperature)
```
