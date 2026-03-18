# HTTP API

StationeersLua can make outbound HTTP requests through the `ic.http` namespace when the server enables it.

::: warning Server-Gated Feature
`ic.http` is disabled by default. The server admin must enable `AllowHttp` before requests will succeed.
:::

## Request Flow

```lua
local requestId = ic.http.get("https://example.com/api/status")

while true do
    local id, ok, status, body, err = ic.http.poll()
    if id == requestId then
        if ok then
            print("status", status)
            print(body)
        else
            print("http error", err)
        end
        break
    end
    yield()
end
```

Requests are asynchronous:

- Start a request with `get`, `post`, `put`, `delete`, or `patch`
- Store the returned request id
- Poll for completions with `ic.http.poll()` inside your normal `tick()` or `yield()` loop

## Request Functions

| Function | Returns | Description |
|---|---|---|
| `ic.http.get(url [, headers] [, timeout])` | request id | Start a GET request |
| `ic.http.post(url, body [, contentType] [, headers] [, timeout])` | request id | Start a POST request |
| `ic.http.put(url, body [, contentType] [, headers] [, timeout])` | request id | Start a PUT request |
| `ic.http.delete(url [, headers] [, timeout])` | request id | Start a DELETE request |
| `ic.http.patch(url, body [, contentType] [, headers] [, timeout])` | request id | Start a PATCH request |
| `ic.http.poll()` | `id, ok, status, body, err` | Retrieve the next completed response |

## URL Helper Functions

```lua
local params = {
    device = "Main Sensor",
    includeHistory = true,
    limit = 20,
}

local query = ic.http.build_query(params)
local url = ic.http.build_url("https://example.com/api/readings", params)
print(query)
print(url)
```

| Function | Returns | Description |
|---|---|---|
| `ic.http.url_encode(str)` | string | Percent-encode a value |
| `ic.http.url_decode(str)` | string | Decode a percent-encoded value |
| `ic.http.build_query(table)` | string | Build a query string from a Lua table |
| `ic.http.build_url(base, params)` | string | Build a full URL with query parameters |

## Limits

HTTP limits are configurable by the server admin.

| Setting | Default | Description |
|---|---|---|
| `MaxConcurrentRequests` | `8` | Maximum concurrent HTTP requests per chip host |
| `MaxRequestBodyKB` | `64` | Maximum request body size |
| `MaxResponseBodyKB` | `256` | Maximum response body size |
| `DefaultTimeoutSeconds` | `10` | Default timeout when omitted |
| `MaxTimeoutSeconds` | `30` | Maximum allowed timeout |
| `MaxCustomHeaders` | `8` | Maximum custom headers per request |
| `MaxUrlLength` | `2048` | Maximum URL length |

## Tips

- Keep request/response bodies small
- Always handle failure paths from `ic.http.poll()`
- Use the URL helper functions instead of hand-building query strings when values may contain spaces or symbols
- Poll inside a normal `yield()` / `tick()` loop instead of blocking other chip work
