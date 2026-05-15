---
name: git-merge-into-branch
description: >-
  Merges the branch you were on into a named target branch (checkout target,
  merge source), then switches back to the original branch. Use when the user
  wants to land current work on another branch without staying on the target,
  or invokes merge-into-branch workflows.
disable-model-invocation: true
---

# Git merge into target branch

## Meaning (non-negotiable)

**“Merge current into `<target>`”** means: **`<target>`** ends up containing a merge of **the branch you started on** (`source`).

1. Record `source =` current branch (`git branch --show-current`).
2. `target` = branch name **the user provided** in the same chat as the command (trim whitespace). If missing or ambiguous, ask once; do not guess names.

If `source` and `target` are the same, report that and stop.

## Preconditions

1. Run `git status --short`. If there are **uncommitted** changes, **stop** and tell the user to commit, stash, or discard—do not stash or discard unless they explicitly instruct that in this thread.
2. `git fetch --all` so local refs for `target` / `source` are reasonably current (unless the user forbids network; then use existing refs and say so).

## Resolve `target`

- If local branch `target` exists: use it.
- Else if `origin/target` exists after fetch: create/update local tracking branch with `git switch target` (Git creates from remote when unambiguous) or `git switch -c target --track origin/target`.
- Else: report that `target` does not exist locally or on `origin`; **stop** (do not invent branches).

## Merge steps

1. `git switch target` (or `git checkout target`).
2. `git merge source` using normal merge defaults (respect repo’s merge/ff configuration).
3. If merge conflicts: list conflicted files, stop, and tell the user conflicts must be resolved manually while still on **`target`**; do not force-merge, delete work, or switch back to **`source`** until the merge is completed or aborted.

## Aftermath

- After a **successful** merge (no conflicts, merge completed): `git switch source` so HEAD returns to the **original** branch you started on.
- Do **not** push unless the user explicitly asked to push in the same message.
- No `rebase`, `--force`, `reset --hard`, or history rewrite unless explicitly requested.
