# AGENTS.md

This file provides session continuity guidance for AI coding agents working on this repository.

---

## Session Start Workflow

Before writing any code, always do this:

1. Run `pwd` — confirm you're in the repo root.
2. Read `claude-progress.md` — last verified state + next step.
3. If `session-handoff.md` is non-empty — read it first, it means the previous session was interrupted mid-feature.
4. Read `feature_list.json` — pick the highest-priority unfinished feature.
5. Run `git log --oneline -5` — see recent commits.
6. Run `./init.sh` — smoke-check (TypeScript + lint + unit tests).

**If smoke check fails — fix it first. Do not start new feature work on a broken base.**

---

## Working Rules

- Work on one feature at a time.
- Don't mark a feature as done just because code was added.
- Keep changes within the scope of the selected feature unless a blocker forces a narrow fix.
- Don't silently change verification rules during implementation.
- Prefer durable repository artifacts over chat summaries.

---

## Session End Checklist

Before finishing any session:

1. Update `claude-progress.md` — log what was done, current verified state, next step.
2. Update `feature_list.json` — mark feature as `done` if Definition of Done is met.
3. Record any unresolved blockers or risks.
4. Commit with a descriptive message when work is in a safe state.
5. Leave the repo clean enough that the next session can immediately run `./init.sh`.

If the session is interrupted mid-feature — fill in `session-handoff.md` before stopping.
When the feature is done — clear `session-handoff.md` back to its empty template.

---

## Definition of Done

A feature is only `done` when **all** of the following are true:

- Target behaviour is implemented
- Required verification was actually run (lint + tsc + tests)
- Evidence is recorded in `feature_list.json` or `claude-progress.md`
- Repo is still startable via `./init.sh`

---

## Key Continuity Files

| File | Purpose |
|---|---|
| `feature_list.json` | Source of truth for feature status (done / in-progress / pending / blocked) |
| `claude-progress.md` | Live session log + current verified status + next step |
| `session-handoff.md` | Filled only when interrupted mid-feature; cleared when feature is done |
| `init.sh` | Standard start + smoke verification |
| `CLAUDE.md` | Code style, architecture rules, project patterns, GG command |
| `docs/` | Feature documentation including architectural decisions (Decisions section) |
