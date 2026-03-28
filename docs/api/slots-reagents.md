# Slots & Reagents

## Slot Operations

Devices have **slots** (inventory slots, gas canister ports, etc.). Read/write slot properties using `LogicSlotType`:

```lua
local LST = ic.enums.LogicSlotType

-- Check if slot 0 on device d0 is occupied
local occ = ic.read_slot(0, 0, LST.Occupied)

-- Read the quantity in slot 1 of device d2
local qty = ic.read_slot(2, 1, LST.Quantity)

-- Write to a slot
ic.write_slot(0, 0, LST.On, 1)

-- By reference ID
local qty = ic.read_slot_id(deviceId, 0, LST.Quantity)
ic.write_slot_id(deviceId, 0, LST.On, 1)
```

## Reagent Operations

```lua
local LRM = ic.enums.LogicReagentMode

-- Read reagent contents from device on d0
local amount = ic.read_reagent(0, LRM.TotalContents, reagentHash)

-- Get the reagent-to-prefab hash mapping table
local map = ic.rmap(0)
for reagentHash, prefabHash in pairs(map) do
    print(reagentHash .. " -> " .. prefabHash)
end
```

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `ic.read_slot(dev, slot, slotType [, net])` | number \| nil | Read slot value |
| `ic.write_slot(dev, slot, slotType, value [, net])` | — | Write slot value |
| `ic.read_slot_id(id, slot, slotType [, net])` | number \| nil | Read slot by ReferenceId |
| `ic.write_slot_id(id, slot, slotType, value [, net])` | — | Write slot by ReferenceId |
| `ic.read_reagent(dev, mode, hash [, net])` | number \| nil | Read reagent value |
| `ic.rmap(dev [, net])` | table | Get reagent→prefab map |
