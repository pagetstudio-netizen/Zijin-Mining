---
name: Drizzle schema push limitation
description: Non-interactive schema updates in this project can encounter existing named-schema conflicts.
---

When a development-only Drizzle schema change is blocked by a named-schema conflict and the CLI requires an interactive TTY, apply only the required additive DDL through the database tooling after checking that it is non-destructive. Do not use force flags for changes that could rewrite existing data.

**Why:** The project has an existing database layout that can make `drizzle-kit push` ask for a rename/schema choice; the workflow shell is non-interactive.

**How to apply:** Prefer the normal schema/publish flow whenever it is interactive. For a small additive table needed by the running app, create that table safely in development and keep the Drizzle schema as the source of truth for future publish diffs.