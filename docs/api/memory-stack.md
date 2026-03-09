# Memory & Stack

## Chip Internal Memory

Each chip has 512 memory addresses (0–511) that persist across ticks and across save/load:

```lua
-- Read from chip memory address 0
local value = mem_read(0)

-- Write to chip memory address 10
mem_write(10, 42.5)

-- Clear all chip memory
mem_clear()
```

::: tip
Chip memory is the easiest way to persist simple values across save/load — no `serialize`/`deserialize` needed.
:::

## External Device Memory

Read/write another device's memory:

```lua
-- Read address 5 from device on d0
local value = mem_get(0, 5)

-- Write value to address 5 on device d0
mem_put(0, 5, 100)

-- Clear all memory on device d0
mem_clear_device(0)

-- By reference ID
local value = mem_get_id(deviceId, 5)
mem_put_id(deviceId, 5, 100)
mem_clear_id(deviceId)
```

## Stack Operations

The chip has an internal stack (shared with memory). These map directly to IC10 `push`/`pop`/`peek`/`poke`:

```lua
stack_push(42)           -- Push value onto stack
local top = stack_peek() -- Read top without removing
local val = stack_pop()  -- Pop from top

stack_poke(5, 100)       -- Write directly to stack address 5

-- Stack/return address pointers
local sp = stack_get_sp()
stack_set_sp(0)

local ra = stack_get_ra()
stack_set_ra(0)
```

::: info
In Lua, you'll almost always use local variables and tables instead of the IC10 stack. These functions exist for IC10 compatibility and for communicating with vanilla IC10 chips via shared memory.
:::

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `mem_read(addr)` | number | Read chip memory |
| `mem_write(addr, value)` | — | Write chip memory |
| `mem_clear()` | — | Clear all chip memory |
| `mem_get(dev, addr [, net])` | number | Read device memory |
| `mem_put(dev, addr, value [, net])` | — | Write device memory |
| `mem_clear_device(dev [, net])` | — | Clear device memory |
| `mem_get_id(id, addr [, net])` | number | Read device memory by ID |
| `mem_put_id(id, addr, value [, net])` | — | Write device memory by ID |
| `mem_clear_id(id [, net])` | — | Clear device memory by ID |
| `stack_push(value)` | — | Push to stack |
| `stack_pop()` | number | Pop from stack |
| `stack_peek()` | number | Peek top of stack |
| `stack_poke(addr, value)` | — | Write to stack address |
| `stack_get_sp()` | number | Get stack pointer |
| `stack_set_sp(value)` | — | Set stack pointer |
| `stack_get_ra()` | number | Get return address |
| `stack_set_ra(value)` | — | Set return address |
