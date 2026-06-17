---
name: github-issue-runner
description: Consume an ISSUE_WORKPLAN.md ready queue and recursively work GitHub issues one branch and PR at a time. Use when explicitly invoked to run prepared GitHub issue work, process ready issues from triage, or continue an issue workplan until blocked.
disable-model-invocation: true
---

# GitHub Issue Runner

Work through ready GitHub issues from `ISSUE_WORKPLAN.md` sequentially. Do not ask the user to invoke this skill for each issue; continue until the ready queue is empty or the first blocker appears.

## Rules

- Use `ISSUE_WORKPLAN.md` at the repo root unless the user gives another path.
- Process only unchecked items in `## Ready Queue`.
- Handle one issue per branch and PR.
- Stop on the first blocker, merge conflict, failed required check, ambiguous requirement, unsafe operation, or missing verification path.
- Use `gh` for GitHub issue and PR operations when available.
- Never force-push, skip hooks, close issues manually, or use destructive git commands unless explicitly requested.

## Per-Issue Loop

For each unchecked ready issue:

1. Re-read the workplan item and the GitHub issue.
   - Confirm the issue still exists, is open, and matches the workplan.
   - Stop if comments or labels changed the scope materially.

2. Define the active goal.
   - Use the `Goal`, `Verify`, `Scope`, and `Stop if` fields from the workplan.
   - Use the `goal` skill if available; otherwise restate the goal in chat.

3. Create or switch to the listed branch.
   - Branch format should be `issue-<number>-<short-slug>`.
   - If the branch already exists, inspect status before continuing.

4. Implement the smallest safe fix.
   - Read local patterns before editing.
   - Avoid opportunistic refactors.
   - Add or update tests that prove the issue is resolved.

5. Verify.
   - Run the workplan validator first.
   - Run lint/typecheck/build when the change touches shared behavior or repo convention requires it.
   - Stop if verification fails and the fix is not obvious.

6. Open a PR.
   - Include the issue URL, summary, test plan, risks, and follow-up.
   - Use a title that describes the fix, not a vague issue title.

7. Mark progress in the workplan.
   - Change the checkbox to `[x]`.
   - Add `PR: <url>` below the item.
   - Add `Verified: <commands/evidence>` below the item.

8. Continue to the next unchecked ready issue.

## Stop Conditions

Stop immediately and report the current issue, branch, and blocker when:

- requirements are ambiguous or contradict the workplan
- code changes require migrations, secrets, billing/auth policy decisions, production data, or external credentials
- tests fail repeatedly or reveal unrelated failures
- another ready issue would touch the same files before the current PR merges
- git status contains unrelated user changes that affect the issue
- PR creation fails or required checks cannot be started

## Final Report

When the queue is empty or blocked, report:

- issues completed and PR URLs
- issue currently blocked, if any
- checks run and failures
- remaining unchecked ready issues
- recommended next user action
