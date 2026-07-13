# `ic.disk` — Portable Data Disk Storage

UTF-8 string blob storage on **vanilla** Data Disks (`ItemDataDisk`) inserted into the enclosing Computer. Data travels with the physical disk between computers.

Use **[`ic.persist`](/api/persist)** for chip-local state that follows the chip. Use **`ic.disk`** for settings or payloads you want on a removable disk.

## Configuration Disk vs Data Disk

| Item | Prefab | Role |
| --- | --- | --- |
| Vanilla Data Disk | `ItemDataDisk` | Portable `ic.disk` blob storage |
| Configuration Disk | `ConfigurationDisk` | ScriptedScreens config-mode key only |

Configuration Disk shares Data Disk slots but is excluded from `ic.disk` and from MCP disk listings.

## Slot indexing

- Lua and MCP use **1-based** slot indices.
- Omit `slot` / `slot_index` only when exactly one vanilla storage disk is present. Multiple disks require an explicit slot or you get an ambiguity error.
- Slot `0` is rejected.

## Functions

| Function | Returns | Description |
| --- | --- | --- |
| `ic.disk.list()` | table | `{ {slot, ref_id, bytes, capacity}, ... }` |
| `ic.disk.present([slot])` | boolean | Any disk, or disk in that slot |
| `ic.disk.read([slot])` | string or nil | Stored blob, or nil when blank/missing |
| `ic.disk.write(blob [, slot])` | boolean | Write one string; throws on no disk / oversize |
| `ic.disk.clear([slot])` | boolean | Erase the blob |
| `ic.disk.info([slot])` | table or nil | `{slot, ref_id, bytes, capacity}` |

Default capacity is **8 KiB** UTF-8 (`[Lua Data Disk] MaxBytes`, clamped). Writes are server-authoritative.

## Persistence

Blobs are encoded into the vanilla save field `ThingSaveData.LogicStack` so worlds remain loadable without StationeersLua (the field is ignored). Wire bodies are always **gzip(UTF-8)** (same `GZipStream` as Lua source compression). An **unmodded re-save may strip the blob**.

## MCP (read-only)

| Surface | Read |
| --- | --- |
| MCP | `list_disks`, `get_disk` |

Writes stay in-game via `ic.disk.write`. Scope matches chip editor allow-lists. No Extension REST routes for disks.

## Example

See `Examples/DataDiskPortableSettings.lua` in StationeersLua: `util.json.encode` / `decode` settings on an inserted vanilla disk, compatible with ScriptedScreens computers that also accept a Configuration Disk in another slot.
