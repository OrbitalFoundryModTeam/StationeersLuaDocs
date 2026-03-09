# Batch Operations

Batch operations read/write across **all devices of a given type** on the data network.

## Reading in Batch

```lua
local LT  = ic.enums.LogicType
local LBM = ic.enums.LogicBatchMethod

-- Get the average temperature of all gas sensors
local sensorHash = hash("StructureGasSensor")
local avgTemp = batch_read(sensorHash, LT.Temperature, LBM.Average)

-- With a name filter (only sensors labelled "Zone A")
local nameHash = hash("Zone A")
local avgTemp = batch_read_name(sensorHash, nameHash, LT.Temperature, LBM.Average)

-- Batch slot read
local occupied = batch_read_slot(sensorHash, 0, ic.enums.LogicSlotType.Occupied, LBM.Sum)
```

## Writing in Batch

```lua
-- Turn on all lights of a certain type
local lightHash = hash("StructureWallLight")
batch_write(lightHash, LT.On, 1)

-- With name filter
batch_write_name(lightHash, hash("Hallway"), LT.On, 1)

-- Batch slot write
batch_write_slot(lightHash, 0, ic.enums.LogicSlotType.On, 1)
```

## Batch Methods

| Method | Description |
|---|---|
| `LBM.Average` | Average of all matching values |
| `LBM.Sum` | Sum of all matching values |
| `LBM.Minimum` | Smallest value |
| `LBM.Maximum` | Largest value |

::: info
The optional `networkIndex` parameter on batch functions is a **StationeersLua extension**. Vanilla IC10 batch always uses the housing's device list.
:::

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `batch_read(hash, logicType, method [, net])` | number \| nil | Batch read |
| `batch_read_name(hash, nameHash, logicType, method [, net])` | number \| nil | Batch read + name filter |
| `batch_read_slot(hash, slot, slotType, method [, net])` | number \| nil | Batch read slot |
| `batch_read_slot_name(hash, nameHash, slot, slotType, method [, net])` | number \| nil | Batch read slot + name |
| `batch_write(hash, logicType, value [, net])` | — | Batch write |
| `batch_write_name(hash, nameHash, logicType, value [, net])` | — | Batch write + name |
| `batch_write_slot(hash, slot, slotType, value [, net])` | — | Batch write slot |
| `batch_write_slot_name(hash, nameHash, slot, slotType, value [, net])` | — | Batch write slot + name |
