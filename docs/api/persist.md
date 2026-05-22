# `ic.persist` — Save/Load & Power Cycle

String key/value store for custom chip state. Survives **world save/load**, **IC housing power off/on** (chip stays in the housing), and **chip pull/reinsert** when the script source hash still matches. Works on vanilla IC housings and on ScriptedScreens hosts (console board, tablet cartridge, programmable visor).

Legacy global `serialize()` / `deserialize(blob)` still work but are deprecated; new scripts should use `ic.persist`.

## Functions

| Function | Returns | Description |
|---|---|---|
| `ic.persist.set(key, value)` | boolean | Store a string. Keys starting with `__` are reserved. |
| `ic.persist.get(key)` | string or nil | Read a value. |
| `ic.persist.has(key)` | boolean | Whether the key exists. |
| `ic.persist.delete(key)` | boolean | Remove one key. |
| `ic.persist.clear()` | boolean | Remove **all** keys for this chip (including legacy serialize blob). |

Use `util.json.encode` / `util.json.decode` for tables.

## Limits

Defaults (per chip): key 128 chars, value 8192 chars, total 32 KiB across all keys. Configure under BepInEx **Lua Persist** (`MaxKeyLength`, `MaxValueLength`, `MaxTotalBytes`). Server/host config is authoritative in multiplayer.

## Example

```lua
local KEY = "settings"

local function load_settings()
    if not ic.persist.has(KEY) then return nil end
    local raw = ic.persist.get(KEY)
    if type(raw) ~= "string" then return nil end
    local ok, t = pcall(util.json.decode, raw)
    return ok and t or nil
end

local function save_settings(t)
    local ok, raw = pcall(util.json.encode, t)
    if ok and raw then ic.persist.set(KEY, raw) end
end

local mode = "auto"
local saved = load_settings()
if saved and type(saved.mode) == "string" then mode = saved.mode end

function tick(dt)
    save_settings({ mode = mode })
end
```

## Load order

KV is hydrated **before** module-level init when a saved blob exists, so you can read `ic.persist` at the top of your script. See [Save/Load Persistence](/guide/persistence).
