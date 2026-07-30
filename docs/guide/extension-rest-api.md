# Extension REST API (Swagger)

The **StationeersLua VS Code extension** talks to the game over plain HTTP REST on `/api/*`.
This is separate from:

- The **MCP JSON-RPC** server on the same port (for AI editors)
- The in-game Lua **`ic.http`** client API ([HTTP reference](/api/http))

## Enable the API

In BepInEx config, section **`[MCP Server]`**:

| Setting | Required for REST |
|---------|-------------------|
| `EnableExtensionApi` | **Yes** — gates all `/api/*` routes |
| `Port` | Default `3030` |
| `BindAddress` | Default `127.0.0.1` (localhost only) |
| `EnableExperimentalDebugger` | Only for `/api/debug/*` routes |

Default base URL: `http://127.0.0.1:3030`

See also [MCP Server & Reference Panel](./mcp-server) and [VS Code Extension](./vscode-extension).

## OpenAPI spec

The machine-readable spec is at [`/openapi/extension-api.yaml`](/openapi/extension-api.yaml).

## API reference

<SwaggerUI />

## Route overview

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/status` | Health + version |
| GET | `/api/editor` | Editor selection and network scope |
| GET/PUT | `/api/editor/code` | Read/write IC editor draft (raw Lua body on PUT) |
| GET | `/api/chips` | List accessible chips |
| GET/PUT | `/api/chips/{refId}/code` | Read/write chip source |
| GET | `/api/chips/{refId}/errors` | Compile/runtime errors |
| POST | `/api/debug/session` | Create debugger session |
| GET/DELETE | `/api/debug/session/{id}` | Session state / close |
| GET | `/api/debug/session/{id}/events` | Poll debug events |
| GET | `/api/debug/session/{id}/stack` | Stack trace |
| GET | `/api/debug/session/{id}/scopes` | Scopes for a frame |
| GET | `/api/debug/session/{id}/variables` | Variables for a reference |
| POST | `/api/debug/session/{id}/evaluate` | Evaluate expression |
| POST | `/api/debug/session/{id}/setVariable` | Set variable |
| POST | `/api/debug/session/{id}/completions` | Completions |
| POST | `/api/debug/session/{id}/breakpoints` | Set breakpoints |
| POST | `/api/debug/session/{id}/continue` | Continue |
| POST | `/api/debug/session/{id}/pause` | Pause |
| POST | `/api/debug/session/{id}/next` | Step over |
| POST | `/api/debug/session/{id}/stepin` | Step in |
| POST | `/api/debug/session/{id}/stepout` | Step out |
| POST | `/api/debug/session/{id}/restart` | Restart session |

## Error semantics

- **403** — REST or debugger disabled in config
- **400** — Bridge returned `success: false` or an `error` string in JSON
- **404** — Unknown path
- **500** — Unhandled server error

Debug session JSON errors may include a structured **`reason`** field:

| `reason` | Meaning |
|----------|---------|
| `unknown_session` | Session id is not registered (closed, timed out, or never created) |
| `session_owned_by_other_client` | Another multiplayer client owns this session |

Code PUT endpoints (`/api/editor/code`, `/api/chips/{refId}/code`) expect **`text/plain`**
raw Lua source, not a JSON wrapper.

## Debug protocol notes

`GET /api/status` includes:

```json
{
  "debugger_enabled": true,
  "debug_protocol": {
    "breakpoints_source_path": true,
    "event_seq": true,
    "session_timeout_seconds": 60
  }
}
```

- **Breakpoints:** `POST .../breakpoints` accepts optional request-level `source_path` and per-breakpoint `source_path`. Breakpoints are keyed by `(source_path, line)` so `require()`d modules do not collide with the main chunk. Omitting `source_path` falls back to the session’s attached source (legacy clients).
- **Verification:** each returned breakpoint includes `verified` (against the compiled prototype line table when available) and optional `message`.
- **Events:** each polled event includes a monotonic `seq` so the extension can detect gaps / ordering.
- **Session timeout:** if the client stops contacting the session for `DebugSessionTimeoutSeconds`, the game force-resumes the chip and closes the session.
