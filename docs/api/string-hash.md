# String & Hash Utilities

## Hashing

```lua
-- Hash a string (Animator.StringToHash — same as IC10 HASH())
local h = hash("StructureGasSensor")

-- Get the prefab name from a known hash (returns nil if unknown)
local name = prefab_name(h)
```

## ASCII-6 Packing

Pack a short string into a single number (for IC10 interop):

```lua
-- Pack string to number (ASCII-6 encoding, up to ~10 chars)
local packed = pack_ascii6("HELLO")
local str = unpack_ascii6(packed)  -- "HELLO"
```

## String Utilities

```lua
-- Strip Unity rich-text color tags from a string
local clean = strip_color_tags("<color=#FF0000>Error</color>")
-- clean == "Error"

-- Convert a float to a 53-bit integer (truncating fractional part)
local int = to_int53(42.7)  -- 42
```

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `hash(str)` | number | String → hash (Animator.StringToHash) |
| `prefab_name(hash)` | string \| nil | Hash → prefab name |
| `pack_ascii6(str)` | number | Pack string to number |
| `unpack_ascii6(num)` | string | Unpack number to string |
| `strip_color_tags(str)` | string | Remove Unity color tags |
| `to_int53(value)` | number | Convert to 53-bit integer |
