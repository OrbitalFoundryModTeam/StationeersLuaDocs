# Quick Reference Card

Device logic (read/write by pin or id, slots, reagents, batch ops, find) is exposed on **`ic`** (mirrored under `ic.logic`). The global environment uses IC10-style names for the same operations: `logic_read`, `logic_write`, `logic_read_id`, `logic_batch_read`, `logic_find`, etc.

## `ic` — logic, slots, batch, lookup

| Function                                                               | Description                               |
| ---------------------------------------------------------------------- | ----------------------------------------- |
| `ic.read(dev, logicType [, net])`                                         | Read logic value                          |
| `ic.write(dev, logicType, value [, net])`                                 | Write logic value                         |
| `ic.read_id(id, logicType [, net])`                                       | Read by ReferenceId                       |
| `ic.write_id(id, logicType, value [, net])`                               | Write by ReferenceId                      |
| `ic.read_slot(dev, slot, slotType [, net])`                               | Read slot value                           |
| `ic.write_slot(dev, slot, slotType, value [, net])`                       | Write slot value                          |
| `ic.read_slot_id(id, slot, slotType [, net])`                             | Read slot by ReferenceId                  |
| `ic.write_slot_id(id, slot, slotType, value [, net])`                     | Write slot by ReferenceId                 |
| `ic.read_reagent(dev, mode, hash [, net])`                                | Read reagent value                        |
| `ic.rmap(dev [, net])`                                                    | Get reagent→prefab map                    |
| `ic.batch_read(hash, logicType, method [, net])`                          | Batch read                                |
| `ic.batch_read_name(hash, nameHash, logicType, method [, net])`           | Batch read + name filter                  |
| `ic.batch_read_slot(hash, slot, slotType, method [, net])`                | Batch read slot                           |
| `ic.batch_read_slot_name(hash, nameHash, slot, slotType, method [, net])` | Batch read slot + name                    |
| `ic.batch_write(hash, logicType, value [, net])`                          | Batch write                               |
| `ic.batch_write_name(hash, nameHash, logicType, value [, net])`           | Batch write + name                        |
| `ic.batch_write_slot(hash, slot, slotType, value [, net])`                | Batch write slot                          |
| `ic.batch_write_slot_name(hash, nameHash, slot, slotType, value [, net])` | Batch write slot + name                   |
| `ic.find(name [, mode [, net]])`                                           | Find by label/pattern → ReferenceId (`mode`: auto/exact/glob/regex); one number only → `net` |
| `ic.find_all(name [, mode [, net]])`                                      | Find all matches → ReferenceId[]                                    |
| `ic.host_info()`                                                          | Host metadata (name, type, wearer for wearable hosts) |

## Global functions

| Function                                                               | Description                               |
| ---------------------------------------------------------------------- | ----------------------------------------- |
| `mem_read(addr)`                                                       | Read chip memory                          |
| `mem_write(addr, value)`                                               | Write chip memory                         |
| `mem_clear()`                                                          | Clear chip memory                         |
| `mem_get(dev, addr [, net])`                                           | Read device memory                        |
| `mem_put(dev, addr, value [, net])`                                    | Write device memory                       |
| `mem_clear_device(dev [, net])`                                        | Clear device memory                       |
| `mem_get_id(id, addr [, net])`                                         | Read device memory by id                  |
| `mem_put_id(id, addr, value [, net])`                                  | Write device memory by id                 |
| `mem_clear_id(id [, net])`                                             | Clear device memory by id                 |
| `stack_push(value)`                                                    | Push to stack                             |
| `stack_pop()`                                                          | Pop from stack                            |
| `stack_peek()`                                                         | Peek top of stack                         |
| `stack_poke(addr, value)`                                              | Write to stack address                    |
| `stack_get_sp()` / `stack_set_sp(v)`                                   | Get/set stack pointer                     |
| `stack_get_ra()` / `stack_set_ra(v)`                                   | Get/set return address                    |
| `hash(str)`                                                            | String → hash                             |
| `prefab_name(hash)`                                                    | Hash → prefab name                        |
| `device_name(dev [, net])`                                             | Get device display name                   |
| `device_label(dev, name)`                                              | Set device label                          |
| `namehash_name(devHash, nameHash [, net])`                             | Resolve nameHash to display name          |
| `device_list([net])`                                                   | List all devices on the data network      |
| `host_info()`                                                          | Host metadata (name, type, wearer for wearable hosts) |
| `pack_ascii6(str)`                                                     | Pack string to number                     |
| `unpack_ascii6(num)`                                                   | Unpack number to string                   |
| `strip_color_tags(str)`                                                | Remove Unity color tags                   |
| `to_int53(value)`                                                      | Convert to 53-bit int                     |
| `util.game_time()`                                                     | Seconds since world start                 |
| `util.days_past()`                                                     | Days passed in world                      |
| `util.time_of_day()`                                                   | Fraction of day (0..1)                    |
| `util.clock_time([pattern])`                                           | Formatted clock time                      |
| `bit_and/or/xor/nor/not(a [, b])`                                      | Bitwise ops                               |
| `bit_sll/srl/sra(a, n)`                                                | Bit shifts                                |
| `bit_ext(val, pos, len)`                                               | Extract bit field                         |
| `bit_ins(dst, src, pos, len)`                                          | Insert bit field                          |
| `require(modname [, reload])`                                          | Load module from library chip             |
| `sleep(seconds)`                                                       | Pause current context (main, tick, or user coroutine) |
| `yield()`                                                              | Pause until next tick (main, tick, or user coroutine) |
| `throw(msg)`                                                           | Throw runtime error                       |
| `hcf()`                                                                | Halt and Catch Fire                       |
| `raise_error(state)`                                                   | Set IC housing error state                |
| `clear_error()`                                                        | Clear IC housing error state              |
| `print(...)`                                                           | Print to debugger logs                    |

## Namespaces

| Namespace           | Key Members                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `ic.enums`          | `LogicType`, `LogicSlotType`, `LogicBatchMethod`, `LogicReagentMode`, `SoundAlert`, `SorterInstruction`, `ConditionOperation` |
| `ic.const`          | `BASE_UNIT_INDEX`, `BASE_NETWORK_INDEX`, game constants                            |
| `ic.events`         | `.on(name, handler)`, `.off(name)`                                                 |
| `ic.net`            | `.id()`, `.peers()`, `.send()`, `.broadcast()`, `.recv()`, `.listen()`             |
| `ic.net` (pub/sub)  | `.publish()`, `.subscribe()`, `.unsubscribe()`                                     |
| `ic.net` (rpc)      | `.request()`, `.register()`, `.unregister()`                                       |
| `ic.net` (pack)     | `.pack()`, `.unpack()`                                                             |
| `util.json`         | `.encode()`, `.decode()`                                                           |
| `util`              | `.temp()`, `.game_time()`, `.days_past()`, `.time_of_day()`, `.clock_time()`       |
| `ic.http`           | `.get()`, `.post()`, `.put()`, `.delete()`, `.patch()`, `.poll()`                  |
| `ic.http` (helpers) | `.url_encode()`, `.url_decode()`, `.build_query()`, `.build_url()`                 |
