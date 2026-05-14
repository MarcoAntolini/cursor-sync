# Phase 5 — Cleanup & Post-Mortem

Required before declaring done:

- [ ] Original repro no longer reproduces (re-run the Phase 1 feedback loop)
- [ ] Regression test passes (or absence of a correct seam is documented)
- [ ] All `[DEBUG-...]` instrumentation removed (`grep` the prefix)
- [ ] Throwaway prototypes deleted (or moved to a clearly-marked debug location)
- [ ] The hypothesis that turned out correct is stated in the commit / PR message — so the next debugger learns

## Post-mortem question

**Ask: what would have prevented this bug?**

If the answer involves architectural change (no good test seam, tangled callers, hidden coupling) hand off to the `/improve-codebase-architecture` skill with the specifics. Make the recommendation **after** the fix is in, not before — you have more information now than when you started.

If the answer involves additional validation, see [`../references/defense-in-depth.md`](../references/defense-in-depth.md).

## "No root cause" cases

If systematic investigation reveals the issue is truly environmental, timing-dependent, or external:

1. You've completed the process
2. Document what you investigated
3. Implement appropriate handling (retry, timeout, error message)
4. Add monitoring/logging for future investigation

**But:** 95% of "no root cause" cases are incomplete investigation. Before declaring environmental, confirm you actually built a feedback loop and ran multiple hypotheses.
