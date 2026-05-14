# Phase 4 — Instrument & Fix

You have a feedback loop, a reproduced bug, an investigation, and a ranked hypothesis. Now instrument minimally, fix at the root cause, and lock it down with a regression test.

## Instrument

Each probe must map to a specific prediction from the hypothesis pack. **Change one variable at a time.**

Tool preference:

1. **Debugger / REPL inspection** if the env supports it. One breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses.
3. Never "log everything and grep".

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end becomes a single grep. Untagged logs survive; tagged logs die.

**Perf branch.** For performance regressions, logs are usually wrong. Instead: establish a baseline measurement (timing harness, `performance.now()`, profiler, query plan), then bisect. Measure first, fix second.

## Fix at the root, not the symptom

When the bug appears deep in the call stack, trace backward to the original trigger — see [`../references/root-cause-tracing.md`](../references/root-cause-tracing.md). Fix at the source.

Then, where appropriate, harden with validation at multiple layers — see [`../references/defense-in-depth.md`](../references/defense-in-depth.md). This is the "make the bug structurally impossible" pattern.

## Regression test — before the fix, if there's a correct seam

Write the regression test **before the fix** — but only if there is a **correct seam** for it.

A correct seam is one where the test exercises the **real bug pattern** as it occurs at the call site. If the only available seam is too shallow (single-caller test when the bug needs multiple callers, unit test that can't replicate the chain that triggered the bug), a regression test there gives false confidence.

**If no correct seam exists, that itself is the finding.** Note it. The codebase architecture is preventing the bug from being locked down. Flag this for the cleanup phase.

If a correct seam exists:

1. Turn the minimised repro into a failing test at that seam (use the [`tdd`](../../tdd/SKILL.md) skill for writing it well).
2. Watch it fail.
3. Apply the fix.
4. Watch it pass.
5. Re-run the Phase 1 feedback loop against the original (un-minimised) scenario.

## Implement a single fix

1. Create the failing test case (see [`tdd/packs/ritual.md`](../../tdd/packs/ritual.md))
2. Address the root cause identified
3. **One change at a time.** No "while I'm here" improvements. No bundled refactoring.
4. Verify: test passes, no other tests broken, issue actually resolved

## If the fix doesn't work

**STOP.** Count: how many fixes have you tried?

- **< 3:** Return to investigation, re-analyze with the new information you have
- **≥ 3:** STOP and question the architecture (see below). **DON'T** attempt fix #4 without architectural discussion.

## The 3+ failed fixes rule — question the architecture

**Pattern indicating an architectural problem:**

- Each fix reveals new shared state/coupling/problem in a different place
- Fixes require "massive refactoring" to implement
- Each fix creates new symptoms elsewhere

**STOP and question fundamentals:**

- Is this pattern fundamentally sound?
- Are we "sticking with it through sheer inertia"?
- Should we refactor architecture vs. continue fixing symptoms?

**Discuss with your human partner before attempting more fixes.**

This is NOT a failed hypothesis — this is a wrong architecture. Hand off to `improve-codebase-architecture` with the specifics.
