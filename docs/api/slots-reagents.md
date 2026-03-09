# Slots & Reagents

## Slot Operations

Devices have **slots** (inventory slots, gas canister ports, etc.). Read/write slot properties using `LogicSlotType`:

```lua
local LST = ic.enums.LogicSlotType

-- Check if slot 0 on device d0 is occupied
local occ = read_slot(0, 0, LST.Occupied)

-- Read the quantity in slot 1 of device d2
local qty = read_slot(2, 1, LST.Quantity)

-- Write to a slot
write_slot(0, 0, LST.On, 1)

-- By reference ID
local qty = read_slot_id(deviceId, 0, LST.Quantity)
write_slot_id(deviceId, 0, LST.On, 1)
```

## Reagent Operations

```lua
local LRM = ic.enums.LogicReagentMode

-- Read reagent contents from device on d0
local amount = read_reagent(0, LRM.TotalContents, reagentHash)

-- Get the reagent-to-prefab hash mapping table
local map = rmap(0)
for reagentHash, prefabHash in pairs(map) do
    print(reagentHash .. " -> " .. prefabHash)
end
```

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `read_slot(dev, slot, slotType [, net])` | number \| nil | Read slot value |
| `write_slot(dev, slot, slotType, value [, net])` | — | Write slot value |
| `read_slot_id(id, slot, slotType [, net])` | number \| nil | Read slot by ReferenceId |
| `write_slot_id(id, slot, slotType, value [, net])` | — | Write slot by ReferenceId |
| `read_reagent(dev, mode, hash [, net])` | number \| nil | Read reagent value |
| `rmap(dev [, net])` | table | Get reagent→prefab map |
