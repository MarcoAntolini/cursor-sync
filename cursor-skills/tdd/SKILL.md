---
name: tdd
description: Test-driven development with strict red-green-refactor loop. Write a failing test first, watch it fail, then write minimal code to pass. Use when implementing any feature, fixing any bug, refactoring, or making behavior changes — before writing implementation code. Triggers on "implement X", "fix this bug", "add feature", "refactor", "TDD", "red-green-refactor", "integration tests", or any request for test-first development.
---

# Test-Driven Development

Four reference packs.

## When to use

- New features, bug fixes, refactors, behavior changes
- Triggers: "implement X", "fix this bug", "add feature", "refactor", "TDD", "red-green-refactor", "integration tests", "test-first"

## Iron law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

If you didn't watch the test fail, you don't know if it tests the right thing.

## Packs

- [Philosophy](packs/philosophy.md) — why behavior over implementation; vertical slices vs horizontal slicing; why test-order matters
- [Workflow](packs/workflow.md) — planning, tracer bullet, incremental loop, refactor, verification checklist
- [Ritual](packs/ritual.md) — strict red-green-refactor with verify-fail and verify-pass gates, examples
- [Rationalizations](packs/rationalizations.md) — anti-excuses, red flags, when-stuck table

## References

- [tests.md](references/tests.md) — good vs bad test examples
- [mocking.md](references/mocking.md) — when (and when not) to mock
- [testing-anti-patterns.md](references/testing-anti-patterns.md) — mocks-as-tested-thing, test-only production methods, incomplete mocks
- [deep-modules.md](references/deep-modules.md) — small interface, deep implementation
- [interface-design.md](references/interface-design.md) — designing for testability
- [refactoring.md](references/refactoring.md) — refactor candidates after green

## Related skills

- [`diagnose`](../diagnose/SKILL.md) — for hard bugs that need a feedback loop before you can write a failing test
