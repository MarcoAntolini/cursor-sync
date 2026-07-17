# skills-tree

Hierarchy-aware wrapper around the official [`npx skills`](https://skills.sh) CLI. Preserves nested skill locations when updating global installs under `~/.agents/skills/`.

Local shell wrappers expose this as the `skills` command. The publishable binary name is `skills-tree` so it does not collide with the upstream package.

## Usage

```bash
# via shell wrapper (cursor-sync)
skills check
skills update
skills update my-skill other-skill
skills locations

# direct
node scripts/skills-cli/bin/skills-tree.mjs locations
```

Hierarchy-aware commands:

| Command | Behavior |
| --- | --- |
| `check` | Forwards to `npx skills check -g` |
| `update [skills…]` | Stages an official update, then copies changed skills back to their nested paths |
| `locations` | Lists discovered root and nested skills |

All other arguments are forwarded to `npx skills`.

## Environment

| Variable | Purpose |
| --- | --- |
| `AGENTS_HOME` | Override `~/.agents` (useful for testing) |
| `NO_COLOR` | Disable ANSI colors |

## Why it exists

The official CLI installs and updates skills as flat directories under `skills/<name>`. This repo (and many personal setups) nests skills (`mattpocock/…`, `vercel-…`, etc.). `skills-tree update` runs the official updater in a temporary home, then reapplies only hash-changed skills to their current nested paths and merges the lock file.

## Local install (cursor-sync)

**Windows (PowerShell)** — add to `$PROFILE`:

```powershell
. "$env:USERPROFILE\cursor-sync\scripts\skills.ps1"
```

**macOS / Linux:**

```bash
source ~/cursor-sync/scripts/skills.sh
```

No `npm install` required — zero runtime dependencies.

## Future publish checklist

When extracting to a public npm package:

1. Set `"private": false` in `package.json`
2. Add `repository` / `author` fields
3. Optionally add `picocolors` / `ora` (API in `src/ui.mjs` can swap without changing commands)
4. Publish as `skills-tree` (`npx skills-tree …`)
5. Point cursor-sync wrappers at the published bin, or keep vendoring this folder
