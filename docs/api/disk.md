# `ic.disk` — Portable Data Disk Storage

Store a UTF-8 string on a **vanilla Data Disk** in the computer that hosts your chip. The data travels with the physical disk.

Use **[`ic.persist`](/api/persist)** for state that should stay on the chip. Use **`ic.disk`** for settings you want to carry between computers.

## Configuration Disk vs Data Disk

| Item | Role |
| --- | --- |
| **Data Disk** | Portable `ic.disk` storage |
| **Configuration Disk** | Opens ScriptedScreens config mode only (not storage) |

Configuration Disks use the same computer slots but are ignored by `ic.disk` and MCP disk tools.

## Labeller names

Rename a Data Disk with a powered **Labeller**. The name appears on the yellow front (wrapping to two lines) and on the exposed edge. The front text hides while the disk is inserted in a computer.

## Slot indexing

- Slot numbers are **1-based**.
- You can omit the slot when exactly one Data Disk is present. With more than one, pass the slot or you get an ambiguity error.
- Slot `0` is not allowed.

## Functions

| Function | Returns | Description |
| --- | --- | --- |
| `ic.disk.list()` | table | `{ {slot, ref_id, bytes, capacity}, ... }` |
| `ic.disk.present([slot])` | boolean | Any disk, or disk in that slot |
| `ic.disk.read([slot])` | string or nil | Stored text, or nil when blank/missing |
| `ic.disk.write(blob [, slot])` | boolean | Write one string; throws if missing disk or oversize |
| `ic.disk.clear([slot])` | boolean | Erase the stored text |
| `ic.disk.info([slot])` | table or nil | `{slot, ref_id, bytes, capacity}` |

Default capacity is **8 KiB** (configurable in mod settings under **Lua Data Disk**).

## MCP

Read-only tools: `list_disks`, `get_disk`. Write with `ic.disk.write` in-game.

## Examples

- StationeersLua: `Examples/DataDiskPortableSettings.lua`
- ScriptedScreens: `Examples/DataDiskPortableTheme.lua` (SAVE/LOAD panel theme + accent)
