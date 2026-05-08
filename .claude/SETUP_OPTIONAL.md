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

- `.claude/settings.local.json` is in `.gitignore` — **never commit it**
- `SUPABASE_ACCESS_TOKEN` must be set as a shell environment variable:

```bash
# Add to ~/.zshrc or ~/.bash_profile
export SUPABASE_ACCESS_TOKEN="sbp_your_token_here"
```

The token is read at Claude Code startup via `${SUPABASE_ACCESS_TOKEN}` in `settings.local.json` — it is never hardcoded.

Get your token from: Supabase Dashboard → Account → Access Tokens

- Restart Claude Code after changing env vars or token rotation

### What it unlocks

Once enabled, Claude Code can:

- Run `list_tables`, `list_migrations` — inspect schema
- `execute_sql` — run queries directly
- `apply_migration` — run migrations programmatically
- `deploy_edge_function` — deploy serverless functions

Normal Supabase client in app code doesn't need this.
