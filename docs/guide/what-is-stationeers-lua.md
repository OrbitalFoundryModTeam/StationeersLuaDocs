# What is StationeersLua?

StationeersLua is a [BepInEx](https://github.com/BepInEx/BepInEx) mod for [Stationeers](https://store.steampowered.com/app/544550/Stationeers/) that brings **full Lua 5.2 scripting** to programmable chips, replacing the vanilla IC10 assembly language with a modern, powerful scripting language.

## Why Lua instead of IC10?

IC10 assembly is powerful but painful at scale:

| IC10 Pain Point                          | Lua Solution                                                    |
| ---------------------------------------- | --------------------------------------------------------------- |
| 16 registers (`r0`–`r15`)                | Unlimited local variables and tables                            |
| Jump-label spaghetti (`j`, `beq`, `jal`) | `if/else`, `while`, `for`, functions                            |
| Max 128 lines per chip                   | No practical line limit (disable in IC10Editor with `?` button) |
| No strings (only ASCII-6 packing)        | Native string support                                           |
| No data structures                       | Tables, arrays, maps                                            |
| No error recovery                        | `pcall()`, nil-safe reads                                       |
| No inter-chip communication              | Full networking: messaging, pub/sub, RPC                        |
| No code reuse across chips               | Library chips with `require()`                                  |

## Key Features

- **Full Lua 5.2 Runtime** — Standard Lua syntax with loops, functions, tables, closures, coroutines
- **Integrated Circuit (Lua)** — New chip item that accepts Lua code instead of IC10 assembly
- **IC10 Editor Integration** — Syntax highlighting and formatting in the in-game code editor
- **Comprehensive Device API** — Read/write logic values, slots, reagents, memory, batch operations
- **Coroutine Support** — `sleep()` and `yield()` for natural control flow without mandatory `tick()` loops
- **Inter-Chip Networking** — Direct messaging, topic-based pub/sub, and RPC between Lua chips
- **Library Chips** — Write reusable modules loaded via `require()` across the data network
- **Event System** — Register handlers for game and mod events
- **Save/Load Persistence** — Opt-in `serialize()`/`deserialize()` hooks for custom state
- **Instruction Limits** — Built-in safety limits prevent infinite loops
- **Multiplayer Compatible** — Fully synced across all connected clients
- **Server-Authoritative** — All execution on the server/host; clients see results via game state sync

## Architecture

```
┌─────────────┐
│  Code saved  │  Editor saves source to chip
└──────┬───────┘
       ▼
┌─────────────┐
│ Compile/Init │  Lua VM created, ic table injected,
│              │  module-level code runs (500K instruction budget)
└──────┬───────┘
       ▼
┌─────────────┐
│  Tick loop   │  Every game tick (~0.5s):
│              │   1. Network messages processed
│              │   2. Events dispatched
│              │   3. Main coroutine resumed
│              │   4. tick(dt) called if defined
│              │  Budget: 50K instructions per tick
└──────┬───────┘
       ▼
┌─────────────┐
│   Shutdown   │  Housing powered off, chip removed, or game exit
└─────────────┘
```

## Companion Mods

**[ScriptedScreens](/guide/what-is-stationeers-lua#companion-mods)** — Build custom touchscreen UIs on computer consoles and tablets. Buttons, sliders, charts, gauges, canvas drawing, games, media playback, and more — all driven by Lua scripts on ScriptedScreens boards.

## Community

- **[Discord](https://discord.gg/HxvySSu5G3)** — Orbital Foundry Mod Team
- **[Ko-fi](https://ko-fi.com/G2G61S5ZB5)** — Support development
