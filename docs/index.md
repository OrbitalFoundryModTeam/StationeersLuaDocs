---
layout: home
hero:
  name: StationeersLua
  text: Lua Scripting for Stationeers
  tagline: Write cleaner, more powerful automation code using Lua instead of IC10 assembly
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/device-io
    - theme: alt
      text: View on GitHub
      link: https://github.com/your-org/StationeersLua

features:
  - icon: 🚀
    title: Full Lua 5.4 Runtime
    details: Write scripts using standard Lua syntax — loops, functions, tables, closures, and more. No more 16-register limits or jump-label spaghetti.
  - icon: 🔌
    title: Complete Device API
    details: Read/write logic values, slots, reagents, memory, and batch operations. Everything IC10 can do, but with clean function calls.
  - icon: 🌐
    title: Inter-Chip Networking
    details: Send messages, publish/subscribe to topics, and call remote procedures between Lua chips on the same data network.
  - icon: 📚
    title: Library Chips
    details: Write reusable modules on library chips. Other chips load them with require() — just like real Lua development.
  - icon: 💾
    title: Save/Load Persistence
    details: Chip memory persists automatically. Opt-in serialize/deserialize hooks let you save custom Lua state across game saves.
  - icon: 🎮
    title: ScriptedScreens Integration
    details: Build custom touchscreen UIs on computer consoles with the companion ScriptedScreens mod — buttons, charts, gauges, and more.
---

## Quick Example

```lua
-- Blink a light on d0 every second
local LT = ic.enums.LogicType
local on = false

while true do
    on = not on
    write(0, LT.On, on and 1 or 0)
    sleep(1)
end
```

::: tip New to StationeersLua?
Check out the [Getting Started guide](/guide/getting-started) for a step-by-step walkthrough, or jump straight to the [API Reference](/api/device-io) if you know what you're looking for.
:::
