# Installation

## Requirements

| Dependency | Description |
|---|---|
| [BepInEx 5.x](https://github.com/BepInEx/BepInEx) | Unity mod framework |
| [StationeersLaunchPad](https://github.com/StationeersLaunchPad/StationeersLaunchPad) | Stationeers modding framework |
| [IC10Editor](https://steamcommunity.com/sharedfiles/filedetails/?id=3389894703) | In-game code editor (Steam Workshop) |

## Install Steps

1. **Install BepInEx** for Stationeers if you haven't already
2. **Install StationeersLaunchPad** plugin
3. **Subscribe to IC10Editor** on the Steam Workshop
4. **Place the `StationeersLua` folder** in your Stationeers mods directory:

```
%USERPROFILE%\Documents\My Games\Stationeers\mods\StationeersLua\
```

5. **Launch the game** — the mod will automatically load

::: tip Verify Installation
If StationeersLua is loaded correctly, you'll be able to craft or spawn an **Integrated Circuit (Lua)** item in-game. Check the BepInEx console for any error messages if things aren't working.
:::

## Optional: ScriptedScreens

For custom touchscreen UIs on computer consoles and tablets, also install the **ScriptedScreens** companion mod:

```
%USERPROFILE%\Documents\My Games\Stationeers\mods\ScriptedScreens\
```

ScriptedScreens requires StationeersLua — it validates the version on load and will self-disable if StationeersLua is missing or too old.

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
