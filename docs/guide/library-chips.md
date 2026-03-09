# Library Chips — `require()`

Library chips let you write **reusable Lua modules** that other chips can load via `require()`. A library chip is a passive source code store — it has **no Lua VM of its own**.

## Creating a Library Chip

Add a `--@module <name>` annotation anywhere in the script:

```lua
--@module atmos
-- Atmosphere utilities for Stationeers

local atmos = {}

atmos.MIN_PRESSURE_KPA = 20
atmos.MAX_TEMP_K = 323.15

function atmos.is_breathable(pressure, temp, co2)
    if pressure < atmos.MIN_PRESSURE_KPA then return false, "low pressure" end
    if temp > atmos.MAX_TEMP_K then return false, "too hot" end
    if co2 > 2.0 then return false, "CO2 toxicity" end
    return true, "safe"
end

return atmos
```

Put this on a Lua chip in an IC Housing on the **same data cable network** as consumer chips.

## Using a Library

```lua
local atmos = require("atmos")

local safe, reason = atmos.is_breathable(101, 295, 0.5)
print(safe and "OK" or reason)
```

## How It Works

1. **Detection** — When a chip's source is saved, StationeersLua scans for `--@module` annotations. If found, the chip is registered as a library chip and **no VM is created**
2. **Syntax check** — The library source is compiled in a temporary state to catch syntax errors early. Errors are flagged on the housing
3. **Network search** — When `require("modname")` is called, the system searches the requesting chip's data cable network for a library chip exporting that module
4. **Compilation** — The library source is compiled inside the requesting chip's VM using Lua's `load()`, with a chunk name like `@HousingName:modname` for clear error attribution
5. **Caching** — The module return value is cached per-VM. Subsequent `require()` calls return the cached value instantly

## Multi-Module Chips

A single chip can export multiple modules:

```lua
--@module pid
--@module utils

local M = {}

M.pid = { ... }    -- PID controller module
M.utils = { ... }  -- Utility functions

return M  -- Must return a table with keys matching module names
```

When `require("pid")` is called, the source runs once and all declared modules are cached from the returned table.

## Hot Reload

Pass `true` as a second argument to force re-loading:

```lua
local atmos = require("atmos", true)  -- Clears cache, re-compiles
```

## Error Handling

| Scenario | Behavior |
|---|---|
| Module not found on network | `error("module 'x' not found on data network")` |
| Library chip has syntax errors | `error("module 'x' has syntax errors...")` |
| Library source fails to compile | `error("require 'x': compile error: ...")` |
| Runtime error in library init | Standard Lua error with `@HousingName:modname` in traceback |

## Configuration

| Config Entry | Default | Description |
|---|---|---|
| `AllowLibraryChips` | `true` | Enable/disable the library chip system |
| `AllowMultiModule` | `true` | Allow multiple `--@module` annotations per chip |
| `LibraryLoadInstructionBudget` | `200000` | Max instructions for loading a library module |

## Key Rules

- Library chips have **no VM** — they don't tick, can't read devices, and don't consume CPU
- Scope is per **data cable network** — only chips on the same physical cable segment can see each other
- The library source runs inside the **requesting chip's** VM, so `read()`, `write()`, `ic.*` all refer to the consumer's devices
- Library chips persist via existing chip source save/load — no new save data needed
