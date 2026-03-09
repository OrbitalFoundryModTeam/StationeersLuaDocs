# JSON Utilities

General-purpose JSON encode/decode under the `util` namespace.

## Usage

```lua
-- Encode a Lua value to JSON
local json = util.json.encode({ name = "test", value = 42, tags = {1, 2, 3} })
print(json)  -- {"name":"test","value":42,"tags":[1,2,3]}

-- Decode JSON to a Lua value
local obj = util.json.decode('{"temp": 300, "status": "ok"}')
print(obj.temp)    -- 300
print(obj.status)  -- "ok"
```

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `util.json.encode(value)` | string | Encode Lua value to JSON string |
| `util.json.decode(str)` | any | Decode JSON string to Lua value |
