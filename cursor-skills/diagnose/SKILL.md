---
name: diagnose
description: Disciplined diagnosis loop for any bug, test failure, build failure, integration issue, performance regression, or unexpected behavior. Build a feedback loop, investigate, hypothesize 3-5 ranked causes, instrument minimally, fix at the root, regression-test, clean up. Use when user says "diagnose this", "debug this", "fix this bug", reports a bug, says something is broken/throwing/failing, describes a performance regression, or when a previous fix did not work.
---

# Diagnose

Six reference packs covering the full debug lifecycle. Skip phases only when explicitly justified.

## When to use

- Any technical issue: test failures, production bugs, unexpected behavior, performance problems, build failures, integration issues
- **Especially when:** under time pressure, "just one quick fix" seems obvious, you've already tried multiple fixes, previous fix didn't work, or you don't fully understand the issue

## Iron laws

```
1. NO INVESTIGATION WITHOUT A FEEDBACK LOOP
2. NO FIXES WITHOUT ROOT CAUSE
```

If you don't have a fast, deterministic, pass/fail signal for the bug, you don't have a bug — you have a vibe. If you haven't found a root cause, your fix is a guess. Both of those mean: do not propose a fix yet.

## Phases (read in order)

1. [Feedback loop](packs/feedback-loop.md) — build the pass/fail signal first. 90% of the skill. Reproduce confirmation lives here too.
2. [Investigation](packs/investigation.md) — read errors carefully, check recent changes, gather evidence at component boundaries, trace data flow backward.
3. [Hypothesize](packs/hypothesize.md) — 3–5 ranked falsifiable hypotheses before instrumenting anything.
4. [Instrument & fix](packs/instrument-and-fix.md) — one variable at a time, tagged debug logs, regression test at the correct seam, the "3+ failed fixes = question architecture" rule.
5. [Cleanup](packs/cleanup.md) — verify original repro is gone, remove instrumentation, post-mortem with architectural handoff.
6. [Rationalizations](packs/rationalizations.md) — red flags, partner signals, anti-excuse table.

## References

- [root-cause-tracing.md](references/root-cause-tracing.md) — trace bugs backward through the call stack
- [defense-in-depth.md](references/defense-in-depth.md) — validation at multiple layers after finding root cause
- [condition-based-waiting.md](references/condition-based-waiting.md) — replace arbitrary timeouts with condition polling (+ [example.ts](references/condition-based-waiting-example.ts))

## Scripts

- [scripts/hitl-loop.template.sh](scripts/hitl-loop.template.sh) — human-in-the-loop reproduction harness
- [scripts/find-polluter.sh](scripts/find-polluter.sh) — bisect which test creates unwanted files/state

## Related skills

- [`tdd`](../tdd/SKILL.md) — for writing the regression test in Phase 4
- `improve-codebase-architecture` — handoff target when 3+ fixes fail or no correct seam exists
