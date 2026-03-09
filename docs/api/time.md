# Time Utilities

Server-authoritative game time helpers for tracking world time, day counts, and time-of-day.

## Game Time

```lua
local t = util.game_time()   -- seconds since world start
local day = util.days_past()  -- integer day count
print(t, day)
```

## Time of Day

```lua
local tod = util.time_of_day()  -- 0..1 (fraction of day)
```

## Clock Time

Formatted clock display using pattern tokens:

```lua
local clock24 = util.clock_time()            -- "HH:MM"
local clock12 = util.clock_time("hh:MM A")   -- "HH:MM AM/PM"
local clock24s = util.clock_time("HH:MM:ss") -- with seconds
```

### Pattern Tokens

| Token | Description |
|---|---|
| `HH` | 24-hour hour |
| `hh` | 12-hour hour |
| `MM` / `mm` | Minutes |
| `ss` | Seconds |
| `A` / `a` | AM/PM |

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `util.game_time()` | number | Seconds since world start |
| `util.days_past()` | number | Days passed in world |
| `util.time_of_day()` | number | Fraction of day (0..1) |
| `util.clock_time([pattern])` | string | Formatted clock time |
