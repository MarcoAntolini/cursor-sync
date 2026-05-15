---
name: git-fetch-pull
description: >-
  Fetches from remotes then pulls the current branch’s upstream so local
  tracking branches stay current. Use when the user wants to sync with
  remote, update from origin, or invokes fetch-pull workflows.
disable-model-invocation: true
---

# Git fetch and pull

## Workflow

1. From repo root: `git fetch --all`.
2. Then `git pull` on the **current branch** (uses configured `pull.rebase` / merge behavior—do not override unless the user asked for rebase or merge explicitly in this message).

## Preconditions and errors

- If `git pull` fails because **no upstream** is configured, explain and suggest `git branch -vv` and either `git push -u origin HEAD` after commits or `git branch --set-upstream-to=origin/<branch>`—do not guess remotes.
- If there are **uncommitted** changes and Git refuses to pull/merge, stop and report; do not stash or discard unless the user explicitly says so in this thread.

## Safety

- No `fetch` with destructive refspecs, no `reset --hard`, no force-pull unless explicitly requested.
- Do not create commits or merge unrelated branches as part of this workflow.
