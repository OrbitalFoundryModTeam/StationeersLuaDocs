# RPC (Remote Procedure Calls)

Request/response pattern with correlation IDs and timeouts. Call a function on another chip and get a result back.

## Server Side — Register Methods

```lua
-- Register an RPC method
ic.net.register("get_status", function(payload, fromId, fromName)
    print("get_status called by " .. fromName)
    
    local temp = ic.read(0, ic.enums.LogicType.Temperature)
    local pressure = ic.read(0, ic.enums.LogicType.Pressure)
    
    -- Return value becomes the response payload
    return {
        temp = temp,
        pressure = pressure,
        uptime = os.clock()
    }
end)

-- If the handler throws, the error is sent back to the caller
ic.net.register("set_mode", function(payload, fromId, fromName)
    if type(payload) ~= "table" or payload.mode == nil then
        error("expected payload with 'mode' field")
    end
    mem_write(0, payload.mode)
    return { ok = true }
end)

-- Unregister a method
ic.net.unregister("get_status")

-- Keep alive to process incoming requests
while true do yield() end
```

### Handlers with `yield()` or `sleep()`

RPC handlers may call `yield()` or `sleep()` before returning. The runtime resumes the handler through the RPC machinery only (not the generic user-coroutine scheduler), honors the sleep duration, and delivers the handler's return value or error to the caller when the handler finishes.

```lua
ic.net.register("slow_status", function(payload, fromId, fromName)
    sleep(2)  -- pause inside the handler; caller waits until this completes or times out
    return { ok = true, from = fromName }
end)
```

If the handler throws (including after a `yield()` or `sleep()`), the caller receives `ok = false` and `err` contains the message.

## Client Side — Call Methods

```lua
-- Call by target name or ID
ic.net.request("ServerChip", "get_status", nil,
    function(ok, payload, err, fromId, fromName)
        if ok then
            print("Temp: " .. tostring(payload.temp))
            print("Pressure: " .. tostring(payload.pressure))
        else
            print("RPC failed: " .. tostring(err))
        end
    end,
    10  -- Timeout in seconds (default 10, max 120)
)

-- Call with parameters
ic.net.request("ServerChip", "set_mode", { mode = 3 },
    function(ok, payload, err)
        if ok then print("Mode set!") end
    end
)

-- Keep alive to receive callbacks
while true do yield() end
```

## RPC Rules

| Rule | Detail |
|---|---|
| Method name max | 64 characters |
| Timeout | Default 10s, max 120s |
| Handler pauses | `yield()` and `sleep()` are allowed; return value and errors reach the caller when the handler completes |
| Error handling | If handler throws, `ok = false` and `err` contains the message |
| Timed-out requests | Silently expired (no callback) |

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `ic.net.register(method, handler)` | — | Register RPC method |
| `ic.net.unregister(method)` | — | Unregister RPC method |
| `ic.net.request(target, method, payload, callback [, timeout])` | — | Call RPC method |
