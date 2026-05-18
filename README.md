# cursor-sync

Personal [Cursor](https://cursor.com) configuration in Git: rules, slash commands, and agent skills. Clone once, point your Cursor config directories at this repo (or copy the folders), then pull to stay up to date across machines.

## What’s in the repo


| Folder             | Cursor location                        | Purpose                                                                 |
| ------------------ | -------------------------------------- | ----------------------------------------------------------------------- |
| `cursor-rules/`    | User rules (`~/.cursor/rules/`)        | Always-on or requestable guidance (`.mdc` files)                        |
| `cursor-skills/`   | User skills (`~/.cursor/skills/`)      | Agent skills (TDD, Playwright, git helpers, framework experts, etc.)    |
| `cursor-commands/` | Slash commands (`~/.cursor/commands/`) | Short prompts that delegate to skills (e.g. `commit-all`, `fetch-pull`) |
| `agents/skills/`   | Agent skills (`~/.agents/skills/`)     | Cross-agent skills (diagnose, handoff, grill-me, …)                     |
| `scripts/`         | *(not installed into Cursor)*          | `csync` sync helper and optional pull-on-start for your shell profile   |


Slash commands in `cursor-commands/` reference skills under `.cursor/skills/…`. With the layout below, that path is satisfied by linking `~/.cursor/skills` to this repo’s `cursor-skills/` folder.

This repo does **not** include Cursor’s built-in `~/.cursor/skills-cursor/` skills.

## Quick start

### 1. Clone

```bash
git clone https://github.com/MarcoAntolini/cursor-sync.git
cd cursor-sync
```

Pick any directory you like (e.g. `~/cursor-sync` or `C:\Users\you\cursor-sync`).

### 2. Link into Cursor (recommended)

Linking keeps one source of truth: edits and `git pull` apply everywhere Cursor reads config.

**macOS / Linux** — create parent dirs if needed, then symlink:

```bash
mkdir -p ~/.cursor ~/.agents

ln -sfn "$(pwd)/cursor-rules"   ~/.cursor/rules
ln -sfn "$(pwd)/cursor-skills"  ~/.cursor/skills
ln -sfn "$(pwd)/cursor-commands" ~/.cursor/commands
ln -sfn "$(pwd)/agents/skills"  ~/.agents/skills
```

**Windows (PowerShell, run as your user)** — use directory junctions or symlinks. Enable [Developer Mode](https://learn.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development) if `mklink` requires it.

```powershell
$Repo = "C:\Users\you\cursor-sync"   # your clone path

New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor" | Out-Null
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents" | Out-Null

cmd /c mklink /D "$env:USERPROFILE\.cursor\rules"    "$Repo\cursor-rules"
cmd /c mklink /D "$env:USERPROFILE\.cursor\skills"   "$Repo\cursor-skills"
cmd /c mklink /D "$env:USERPROFILE\.cursor\commands" "$Repo\cursor-commands"
cmd /c mklink /D "$env:USERPROFILE\.agents\skills"   "$Repo\agents\skills"
```

If a real folder already exists at the target (e.g. `~/.cursor/rules`), rename or back it up before linking.

### 3. Verify

1. Restart Cursor (or reload the window).
2. **Settings → Rules**: you should see rules from `cursor-rules/`.
3. In chat, type `/` and check for commands like `commit-all`, `fetch-pull`.
4. Ask the agent to use a skill by name (e.g. TDD, diagnose) or invoke a slash command that points at one.

## Alternative: copy instead of link

If you do not want symlinks:

```bash
cp -R cursor-rules   ~/.cursor/rules
cp -R cursor-skills  ~/.cursor/skills
cp -R cursor-commands ~/.cursor/commands
cp -R agents/skills  ~/.agents/skills
```

You must re-copy (or merge manually) when you pull updates from upstream.

## Daily workflow: `csync` (optional)

After you change rules, skills, or commands (in Cursor or in this repo), sync to GitHub with one command instead of `cd`, `add`, `commit`, `pull`, and `push` by hand.

[`scripts/csync.ps1`](scripts/csync.ps1) and [`scripts/csync.sh`](scripts/csync.sh) stage everything, commit only if there are changes, then `pull --rebase --autostash` and `push` (quiet). Default commit message is a timestamp; pass a custom message as the first argument.

Scripts resolve the repo from their own location. If your clone lives elsewhere, set `CURSOR_SYNC` to its path (e.g. `C:\Users\you\dev\cursor-sync` or `/opt/dotfiles/cursor-sync`).

### Install `csync`

Add **one** line to your shell [profile](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles) (`$PROFILE` on Windows, `~/.bashrc` or `~/.zshrc` on macOS/Linux). Adjust the path to match where you cloned:

**Windows (PowerShell):**

```powershell
. "$env:USERPROFILE\cursor-sync\scripts\csync.ps1"
```

**macOS / Linux (bash/zsh):**

```bash
source ~/cursor-sync/scripts/csync.sh
```

Reload the shell, then:

```bash
csync                            # message: sync <timestamp>
csync "add TDD skill tweaks"     # custom message
```

You can also run a one-off sync without loading your profile:

```powershell
pwsh -File "$env:USERPROFILE\cursor-sync\scripts\csync.ps1" "optional message"
```

```bash
~/cursor-sync/scripts/csync.sh "optional message"
```

With symlinks, Cursor writes directly into this repo, so `csync` is usually all you need on the machine where you edited.

### Pull on shell start (optional)

On a second machine, you often only need the latest config from GitHub. [`scripts/pull-on-start.ps1`](scripts/pull-on-start.ps1) and [`scripts/pull-on-start.sh`](scripts/pull-on-start.sh) run a silent background `git pull --rebase` when you open a shell (no commit or push).

**Windows (PowerShell)** — add to `$PROFILE` (in addition to `csync` if you use it):

```powershell
. "$env:USERPROFILE\cursor-sync\scripts\pull-on-start.ps1"
```

**macOS / Linux:**

```bash
source ~/cursor-sync/scripts/pull-on-start.sh
```

Respects `CURSOR_SYNC` the same way as `csync`. Skip this if you prefer to pull manually or only use `csync` on that machine.

### Manual sync

If you prefer not to install `csync`:

```bash
cd ~/cursor-sync   # or your clone path
git add -A && git commit -m "sync" && git pull --rebase --autostash && git push
```

With copies instead of symlinks, you still need to re-copy or merge after pulling on another machine.

## Making it yours

1. **Fork** the repository on GitHub (or clone and use your own remote).
2. Edit rules, skills, and commands in this repo; Cursor reads them via the links above.
3. Commit and push from `cursor-sync` like any other dotfiles repo.

To override something for a single project only, use that project’s `.cursor/rules/` or `.cursor/skills/` — project rules can stack with user rules.

## Per-machine notes

- Paths differ by OS (`~/.cursor` vs `%USERPROFILE%\.cursor`), but the four mappings are the same.
- Do not commit secrets (API keys, `.env`, tokens). This repo is intended for prompts and tooling only.
- Line endings are normalized to LF (see `.gitattributes`).

