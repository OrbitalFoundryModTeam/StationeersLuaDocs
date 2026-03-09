# Direct Messaging

Lua chips on the **same data network** can send messages to each other. All networking is server-authoritative and scoped to the physical data cable network (including bridged networks).

## Setup

```lua
-- Get your own endpoint ID (the housing's ReferenceId)
local myId = ic.net.id()
print("My endpoint: " .. tostring(myId))

-- List all Lua chip peers on the network
local peers = ic.net.peers()
for _, p in ipairs(peers) do
    print(string.format("  Peer: %s (id=%d)", p.name, p.id))
end
```

## Sending Messages

```lua
-- Send to a specific target by name (set via labeller on the housing)
ic.net.send("ReceiverChip", "alerts", { temp = 300, status = "critical" })

-- Send to a specific target by ReferenceId
ic.net.send(targetId, "alerts", "Hello!")

-- Broadcast to ALL Lua chips on the network
local delivered = ic.net.broadcast("status", { online = true })
print("Delivered to " .. delivered .. " peers")
```

## Receiving Messages

### Option A: Handler Function (Recommended)

```lua
-- Register a listener for a channel
ic.net.listen("alerts", function(fromId, fromName, payload)
    print("Alert from " .. fromName .. ": " .. tostring(payload))
end)

-- Handler by name (persists better across save/load)
function onAlert(fromId, fromName, payload)
    print("Alert from " .. fromName)
end
ic.net.listen("alerts", "onAlert")

-- Unregister
ic.net.listen("alerts", nil)
```

### Option B: Poll-Style

```lua
while true do
    local fromId, fromName, channel, payload = ic.net.recv()
    if fromId ~= nil then
        print("Message on " .. channel .. " from " .. fromName)
    end
    yield()
end
```

## Channel Rules

| Rule | Detail |
|---|---|
| Type | Strings (e.g. `"alerts"`, `"sensor_data"`) |
| Integer channels | Treated as `"1000"` (string conversion) |
| Max payload size | 128 KB (MessagePack encoded) |
| Supported types | `nil`, `boolean`, `number`, `string`, `table` |
| Unsupported | Functions, userdata, cyclic tables |

## Function Reference

| Function | Returns | Description |
|---|---|---|
| `ic.net.id()` | number | Get own endpoint ID |
| `ic.net.peers()` | table[] | List all Lua chip peers |
| `ic.net.send(target, channel, payload)` | — | Send to target (name or ID) |
| `ic.net.broadcast(channel, payload)` | number | Broadcast to all peers |
| `ic.net.listen(channel, handler)` | — | Register/unregister listener |
| `ic.net.recv()` | fromId, fromName, channel, payload | Poll for messages |
