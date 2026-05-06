---
name: Optional setup (Supabase MCP)
description: Advanced setup for Supabase integration — optional, only if needed
type: reference
---

# Optional Setup

## Supabase MCP (optional)

**When to use:** If you need direct database access from Claude Code (edge functions, migrations, schema changes).

**When NOT to use:** If you're just using Supabase client in app code — that works without this.

### Install

```bash
cp .mcp.json.example .mcp.json
```

Edit `.mcp.json` with your Supabase credentials:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_URL": "https://xyz.supabase.co",
        "SUPABASE_ACCESS_TOKEN": "your_supabase_jwt_token"
      }
    }
  }
}
```

Get credentials from:
- `SUPABASE_URL` → Project settings > API
- `SUPABASE_ACCESS_TOKEN` → Create a new access token in Project settings > Access tokens

### Security

- `.mcp.json` is in `.gitignore` — **never commit it**
- Contains sensitive tokens — keep it local
- Restart Claude Code after editing `.mcp.json`

### What it unlocks

Once enabled, Claude Code can:
- Run `list_tables`, `list_migrations` — inspect schema
- `execute_sql` — run queries directly
- `apply_migration` — run migrations programmatically
- `deploy_edge_function` — deploy serverless functions

Normal Supabase client in app code doesn't need this.
