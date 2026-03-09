# Temperature Conversion

Universal temperature conversion via `util.temp(value, from, to)`.

## Usage

Units: `"K"` (Kelvin), `"C"` (Celsius), `"F"` (Fahrenheit). Case-insensitive.

```lua
-- Stationeers sensors report Kelvin — convert to Celsius
local tempK = read(0, ic.enums.LogicType.Temperature)
local tempC = util.temp(tempK, "K", "C")
print(tempC)  -- e.g. 21.85

-- Celsius to Fahrenheit
local tempF = util.temp(tempC, "C", "F")
print(tempF)  -- e.g. 71.33

-- Fahrenheit back to Kelvin
local tempK2 = util.temp(tempF, "F", "K")
print(tempK2)  -- e.g. 295.0
```

::: tip Shorthand
The `from` parameter defaults to `"K"` and `to` defaults to `"C"`, so `util.temp(295)` is a quick Kelvin→Celsius shorthand.
:::

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `util.temp(value [, from [, to]])` | number | Convert temperature between units |
