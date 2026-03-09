# Pack/Unpack

Serialize Lua values to/from base64-encoded MessagePack. Useful for storing structured data in chip memory or transferring via non-network channels.

## Usage

```lua
-- Pack a Lua table to a base64 string
local packed = ic.net.pack({ x = 1, y = 2, items = {"a", "b"} })
print(type(packed))  -- "string"

-- Unpack back to a Lua value
local value = ic.net.unpack(packed)
print(value.x, value.y)  -- 1  2
print(value.items[1])     -- "a"
```

## Supported Types

| Type | Support |
|---|---|
| `nil` | Yes |
| `boolean` | Yes |
| `number` (double) | Yes |
| `string` | Yes |
| `table` (array or map) | Yes |
| `function` | No |
| `userdata` | No |
| Cyclic tables | No |

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `ic.net.pack(value)` | string | Serialize to base64 MessagePack |
| `ic.net.unpack(str)` | any | Deserialize from base64 MessagePack |
