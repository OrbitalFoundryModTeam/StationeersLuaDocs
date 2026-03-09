# Bitwise Operations

StationeersLua provides 53-bit-safe bitwise operations matching IC10's numeric precision.

## Basic Operations

```lua
local result = bit_and(a, b)    -- Bitwise AND
local result = bit_or(a, b)     -- Bitwise OR
local result = bit_xor(a, b)    -- Bitwise XOR
local result = bit_nor(a, b)    -- Bitwise NOR
local result = bit_not(a)       -- Bitwise NOT
```

## Bit Shifts

```lua
local result = bit_sll(a, n)    -- Shift left logical
local result = bit_srl(a, n)    -- Shift right logical (unsigned)
local result = bit_sra(a, n)    -- Shift right arithmetic (signed)
```

## Bit Fields

```lua
-- Extract a bit field: n bits starting at position pos
local field = bit_ext(value, pos, len)

-- Insert src into dst at position pos, width len
local result = bit_ins(dst, src, pos, len)
```

## Example: Packing Flags

```lua
local flags = 0
flags = bit_or(flags, bit_sll(1, 0))  -- Set bit 0 (power on)
flags = bit_or(flags, bit_sll(1, 3))  -- Set bit 3 (alert active)

-- Check if bit 3 is set
if bit_and(flags, bit_sll(1, 3)) ~= 0 then
    print("Alert is active")
end
```

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `bit_and(a, b)` | number | Bitwise AND |
| `bit_or(a, b)` | number | Bitwise OR |
| `bit_xor(a, b)` | number | Bitwise XOR |
| `bit_nor(a, b)` | number | Bitwise NOR |
| `bit_not(a)` | number | Bitwise NOT |
| `bit_sll(a, n)` | number | Shift left logical |
| `bit_srl(a, n)` | number | Shift right logical |
| `bit_sra(a, n)` | number | Shift right arithmetic |
| `bit_ext(val, pos, len)` | number | Extract bit field |
| `bit_ins(dst, src, pos, len)` | number | Insert bit field |
