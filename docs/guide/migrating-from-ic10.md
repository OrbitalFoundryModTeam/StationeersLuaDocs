# Migrating from IC10

If you're coming from IC10 assembly, here's a quick translation guide.

## Instruction Mapping

| IC10 | Lua |
|---|---|
| `alias Temp r0` | `local temp` |
| `define PI 3.14` | `local PI = 3.14` |
| `l r0 d0 Temperature` | `local temp = read(0, LT.Temperature)` |
| `s d0 On 1` | `write(0, LT.On, 1)` |
| `ls r0 d0 0 Occupied` | `local occ = read_slot(0, 0, LST.Occupied)` |
| `lb r0 HASH("GasSensor") Temperature 2` | `local avg = batch_read(hash("GasSensor"), LT.Temperature, LBM.Average)` |
| `push 42` | `stack_push(42)` |
| `pop r0` | `local val = stack_pop()` |
| `move r0 r1` | `local a = b` |
| `add r0 r1 r2` | `local a = b + c` |
| `and r0 r1 r2` | `local a = bit_and(b, c)` |
| `j label` | `while true do ... end` or `goto label` |
| `beq r0 0 label` | `if r0 == 0 then ... end` |
| `sleep 5` | `sleep(5)` |
| `yield` | `yield()` |
| `hcf` | `hcf()` |

## Key Differences

1. **No registers** — Use Lua variables. No 16-register limit.
2. **No line numbers** — Use functions, loops, and `if/else`. No `j 5` or `beq r0 0 15`.
3. **Nil instead of errors** — `read()` returns `nil` for missing devices instead of crashing.
4. **Strings are native** — No ASCII-6 packing needed (but `pack_ascii6` is available for IC10 interop).
5. **Tables** — Use Lua tables for data structures instead of the 512-value stack.
6. **Functions** — Define reusable functions instead of `jal`/`j ra` patterns.
7. **Error handling** — Use `pcall()` for protected calls.

## Network / Channel Addressing

IC10 uses `d0:0` connection syntax and `Channel0..Channel7` logic types. In Lua, most `read`/`write` variants accept an optional `networkIndex` parameter:

```lua
local LT = ic.enums.LogicType

-- Read from device on d0, network index 0
local value = read(0, LT.Temperature, 0)

-- Read all channels 0..7 from db:0 into a table
local channels = {}
for i = 0, 7 do
    channels[i] = read(ic.const.BASE_UNIT_INDEX, LT.Channel0 + i, 0)
end
```

## Numeric Formats

| IC10 | Lua |
|---|---|
| `$FF` | `0xFF` |
| `$E1B2` | `0xE1B2` |
| `%101010` | `0b101010` (Lua 5.4) |

## Hashes

IC10 uses `HASH("string")`. StationeersLua provides the same function:

```lua
local sensorHash = hash("StructureGasSensor")
local nameHash = hash("Sensor 1")
```
