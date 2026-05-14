# Installation

## Install from Steam Workshop (Recommended)

All required mods are available on the **Steam Workshop**. Subscribe to each:

1. Install **[StationeersLaunchPad](https://github.com/StationeersLaunchPad/StationeersLaunchPad)** (BepInEx modding framework - see its GitHub for install instructions)
1. Subscribe to **[StationeersLua](https://steamcommunity.com/sharedfiles/filedetails/?id=3659911735)** on the Steam Workshop
1. Subscribe to **[IC10Editor](https://steamcommunity.com/sharedfiles/filedetails/?id=3592775931)** on the Steam Workshop
1. Launch Stationeers - all mods load automatically

:::: tip
When creating or joining a world, make sure the mods are enabled in the mod list.
::::

:::: tip Verify Installation
If StationeersLua is loaded correctly, you'll be able to craft or spawn an **Integrated Circuit (Lua)** item in-game. Check the BepInEx console for any error messages if things aren't working.
::::

:::: info IC10Editor is required for the player docs flow
Treat **IC10Editor** as required for the intended StationeersLua experience. The guides assume you have its in-game editor, Lua formatter, reference panel, and the `?` button for working with real scripts.
::::

## Optional: ScriptedScreens

For custom touchscreen UIs on computer consoles, tablets, and programmable visors, also subscribe to the **[ScriptedScreens](https://steamcommunity.com/sharedfiles/filedetails/?id=3666779631)** mod on the Steam Workshop.

ScriptedScreens requires StationeersLua - it validates the version on load and will self-disable if StationeersLua is missing or too old.

## Optional: VS Code Extension

For external editing, chip browsing, and debugger attach, install the **StationeersLua VS Code extension** from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=OrbitalFoundryModdingCrew.stationeers-lua) or from [Open VSX](https://open-vsx.org/extension/OrbitalFoundryModdingCrew/stationeers-lua) (VSCodium and other Open VSX-based editors).

For full Stationeers-specific code intelligence (enum completions, diagnostics, `require()` suggestions), enable `EnableLspServer = true` in the mod config under `[MCP Server]`. The extension connects to the mod's built-in LSP server alongside Sumneko Lua for a dual-LSP experience.

IC10Editor remains the expected in-game workflow, and the game can also use an external `lua-language-server` path for the in-game editor. See [Language Servers & Editor Intelligence](/guide/language-servers).

See the [VS Code Extension guide](/guide/vscode-extension) for full setup and feature details.

:::: info Multiplayer Debugging Model
In multiplayer, VS Code talks to a **local StationeersLua bridge** running in your own game client. That local bridge proxies debugger traffic to the authoritative server over in-game mod network messages when the server enables multiplayer debug proxying.

Dedicated servers do **not** expose the HTTP/MCP listener directly.
::::

## Building from Source

### Prerequisites

- .NET SDK (targeting `netstandard2.1`)
- Visual Studio 2022 or compatible IDE
- Stationeers game installed

### Build Steps

1. Clone the repository
1. Update `Stationeers.VS.User.props` with your local paths:

   ```xml
   <StationeersDirectory>C:\Program Files (x86)\Steam\steamapps\common\Stationeers</StationeersDirectory>
   <StationeersDocumentsDirectory>$(USERPROFILE)\Documents\My Games\Stationeers</StationeersDocumentsDirectory>
   ```

1. Build the solution:

   ```bash
   dotnet build -c Release
   ```

1. The mod will be automatically copied to your mods folder
