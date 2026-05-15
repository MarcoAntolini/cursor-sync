---
name: git-checkout-branch
description: >-
  Switches to a named branch; if it does not exist locally or on origin,
  asks for explicit confirmation before creating a new local branch. Use
  when the user wants to change branches, switch context, or invokes
  checkout-branch workflows.
disable-model-invocation: true
---

# Git checkout / switch branch

## Branch name

`branch` = name **the user provided** in the same chat as the command (trim whitespace). If missing, ask once; do not invent names.

## Dirty working tree

Run `git status --short`. If there are uncommitted changes, **stop** unless `git switch` can proceed cleanly—if Git errors, report and ask the user to commit, stash, or discard (do not stash/discard unless they explicitly say so in this thread).

## When `branch` already exists locally

- `git switch branch` (or `git checkout branch`).

## When `branch` exists only on the remote (after `git fetch --all`)

- Prefer `git switch branch` if Git resolves `origin/branch` unambiguously, otherwise `git switch -c branch --track origin/branch`.

## When `branch` does not exist locally or on `origin`

1. Say clearly that neither local nor `origin/<branch>` was found (after a fetch if network is allowed).
2. **Authorization gate (required):** ask verbatim-style: whether to **create** a new local branch named `branch` from the **current HEAD** (or offer `from origin/<default>` only if the user specified a base—default is current HEAD).
3. If the user does **not** clearly confirm (yes / proceed / create it), **stop**—do not create the branch.
4. If they confirm: `git switch -c branch` (from current HEAD). If they asked for a different base, use that base explicitly (e.g. `git switch -c branch origin/main`).

## Safety

- No branch delete, no force, no unrelated checkouts of random SHAs unless the user named a full ref intentionally.
