# Installation

## Install from Steam Workshop (Recommended)

All required mods are available on the **Steam Workshop**. Simply subscribe to each:

1. Install **[StationeersLaunchPad](https://github.com/StationeersLaunchPad/StationeersLaunchPad)** (BepInEx modding framework — see its GitHub for install instructions)
2. Subscribe to **[StationeersLua](https://steamcommunity.com/sharedfiles/filedetails/?id=3659911735)** on the Steam Workshop
3. Subscribe to **[IC10Editor](https://steamcommunity.com/sharedfiles/filedetails/?id=3592775931)** on the Steam Workshop (in-game code editor)
4. Launch Stationeers — all mods load automatically

::: tip
When creating or joining a world, make sure the mods are enabled in the mod list.
:::

::: tip Verify Installation
If StationeersLua is loaded correctly, you'll be able to craft or spawn an **Integrated Circuit (Lua)** item in-game. Check the BepInEx console for any error messages if things aren't working.
:::

## Optional: ScriptedScreens

For custom touchscreen UIs on computer consoles and tablets, also subscribe to the **[ScriptedScreens](https://steamcommunity.com/sharedfiles/filedetails/?id=3666779631)** mod on the Steam Workshop.

ScriptedScreens requires StationeersLua — it validates the version on load and will self-disable if StationeersLua is missing or too old.

## Optional: VS Code Extension

For external editing, chip browsing, and debugger attach, install the **StationeersLua VS Code extension** from the repository alongside this mod.

::: info Multiplayer Debugging Model
In multiplayer, VS Code talks to a **local StationeersLua bridge** running in your own game client. That local bridge proxies debugger traffic to the authoritative server over in-game mod network messages when the server enables multiplayer debug proxying.

Dedicated servers do **not** expose the HTTP/MCP listener directly.
:::

## Building from Source

### Prerequisites

- .NET SDK (targeting `netstandard2.1`)
- Visual Studio 2022 or compatible IDE
- Stationeers game installed

### Build Steps

1. Clone the repository
2. Update `Stationeers.VS.User.props` with your local paths:
   ```xml
   <StationeersDirectory>C:\Program Files (x86)\Steam\steamapps\common\Stationeers</StationeersDirectory>
   <StationeersDocumentsDirectory>$(USERPROFILE)\Documents\My Games\Stationeers</StationeersDocumentsDirectory>
   ```
3. Build the solution:
   ```bash
   dotnet build -c Release
   ```
4. The mod will be automatically copied to your mods folder
