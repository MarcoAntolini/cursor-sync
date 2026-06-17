---
name: github-issue-triage
description: Triage GitHub issues into a ready-to-run markdown workplan for another agent skill. Use when explicitly invoked to review open issues, classify GitHub issue readiness, prepare recursive issue work, or create an ISSUE_WORKPLAN.md queue.
disable-model-invocation: true
---

# GitHub Issue Triage

Prepare GitHub issues for automated follow-up work. This skill does not implement fixes; it creates or updates an `ISSUE_WORKPLAN.md` queue that `github-issue-runner` can consume.

## Rules

- Use `gh` for GitHub issue operations when available.
- If repo or issue scope is unclear, ask for the repo and filter: label, milestone, assignee, issue numbers, or "all open issues".
- Read each issue title, body, comments, labels, linked PRs, and referenced errors before classifying.
- Do not edit product code, create branches, or open PRs during triage.
- Prefer small, independent, testable issues for the ready queue.

## Classification

Classify each issue as:

- **Ready**: expected behavior is clear, scope is bounded, and verification is possible.
- **Needs clarification**: acceptance criteria, reproduction, or product behavior is unclear.
- **Blocked**: requires credentials, external service state, migration, dependency work, unavailable environment, or another issue.
- **Duplicate/stale**: likely superseded, already fixed, inactive, or not actionable.

## Workplan Contract

Create or update `ISSUE_WORKPLAN.md` at the repo root unless the user requests another path.

Use this structure:

```md
# Issue Workplan

## Ready Queue
- [ ] #<number> <title>
  - URL: <issue-url>
  - Goal: <one-sentence measurable outcome>
  - Scope: <files/areas likely involved>
  - Verify: <tests/checks/manual evidence>
  - Branch: issue-<number>-<short-slug>
  - Stop if: <ambiguity/blocker condition>

## Needs Clarification
- #<number> <title>: <single question to ask>

## Blocked
- #<number> <title>: <blocker and unblocker>

## Duplicate Or Stale
- #<number> <title>: <reason>
```

## Triage Workflow

1. Gather issues in scope with `gh issue list` and `gh issue view`.
2. Classify issues using the definitions above.
3. Write ready issues in recommended order: lowest ambiguity, smallest scope, strongest verification first.
4. Add a measurable goal for each ready issue. Use the `goal` skill if available.
5. Keep each ready queue item independent; split or downgrade issues that would require broad refactors.
6. Present a short summary and tell the user to invoke `github-issue-runner` when ready.

## Safety

Do not put an issue in Ready if it involves unclear product behavior, secrets, billing, auth policy, production data, schema migrations, external credentials, destructive operations, or multiple overlapping architectural changes.
