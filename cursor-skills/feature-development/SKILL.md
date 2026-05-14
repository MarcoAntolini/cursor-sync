---
name: feature-development
description: >-
  Systematic 7-phase workflow for building a new feature: discover, explore the
  codebase with parallel subagents, ask clarifying questions, design 2-3
  architecture options, implement, review, summarize. Use when the user wants
  to implement a new feature, build new functionality, add a feature, or
  invokes /feature-development. Enforces clarifying questions before design and
  explicit user-approval gates before implementation.
---

# Feature Development

You are helping the user implement a new feature. Follow this 7-phase workflow systematically. **Do not skip phases.** Use `TodoWrite` to track progress across all 7 phases.

## Core Principles

- **Understand before acting** — read existing code patterns first, never jump straight to implementation
- **Ask clarifying questions early** — after codebase exploration, before architecture design (Phase 3)
- **Read files identified by subagents** — when a subagent returns a list of essential files, actually read them before continuing
- **Simple and elegant** over clever — prioritize readable, maintainable, architecturally sound code
- **Stop at every approval gate** — Phase 3 (clarifying questions), Phase 4 (chosen architecture), Phase 6 (review decisions)

---

## Phase 1: Discovery

**Goal**: Understand what the user wants built.

1. Create a `TodoWrite` list with all 7 phases.
2. If the feature is unclear, ask:
   - What problem are they solving?
   - What should the feature do?
   - Any constraints or requirements?
3. Summarize your understanding back to the user. Confirm before proceeding to Phase 2.

---

## Phase 2: Codebase Exploration

**Goal**: Understand the relevant existing code at both high and low levels.

1. Launch **2-3 `explore` subagents in parallel** using the `Task` tool (single message, multiple tool calls). Each targets a different aspect.
2. Use the **code-explorer prompt template** below for each one.
3. When subagents return, **read every "essential file" they identify** before continuing.
4. Present a comprehensive summary of findings and patterns discovered.

### code-explorer prompt template

When calling `Task` with `subagent_type: "explore"`, structure the prompt like this:

> You are an expert code analyst specializing in tracing and understanding feature implementations across codebases.
>
> **Mission**: Provide a complete understanding of how [TARGET FEATURE / AREA] works by tracing its implementation from entry points to data storage, through all abstraction layers.
>
> **Approach**:
>
> 1. **Feature discovery** — entry points (APIs, UI, CLI), core implementation files, feature boundaries, configuration
> 2. **Code flow tracing** — call chains entry -> output, data transformations, dependencies, integrations, state changes, side effects
> 3. **Architecture analysis** — abstraction layers (presentation -> business logic -> data), design patterns, interfaces between components, cross-cutting concerns (auth, logging, caching)
> 4. **Implementation details** — key algorithms, error handling, edge cases, performance, technical debt
>
> **Output**:
>
> - Entry points with `file:line` references
> - Step-by-step execution flow with data transformations
> - Key components and responsibilities
> - Architecture insights: patterns, layers, design decisions
> - Dependencies (external and internal)
> - Observations: strengths, issues, opportunities
> - **A list of 5-10 files absolutely essential to understanding this area** — full paths

Example assignments for the three parallel agents:

- Agent A — "Find features similar to [feature] and trace through their implementation"
- Agent B — "Map the architecture and abstractions for [feature area]"
- Agent C — "Identify UI patterns, testing approaches, and extension points relevant to [feature]"

---

## Phase 3: Clarifying Questions

**Goal**: Resolve every ambiguity *before* designing architecture.

**CRITICAL — DO NOT SKIP.** This is the most important phase.

1. Review the codebase findings + the original feature request together.
2. Identify underspecified aspects: edge cases, error handling, integration points, scope boundaries, design preferences, backward compatibility, performance needs.
3. **Present every question to the user as a clear, organized list.** Use `AskQuestion` if there are many questions.
4. **WAIT for answers** before proceeding to Phase 4.

If the user says *"whatever you think is best"*, provide your concrete recommendation and get **explicit confirmation** before moving on. Do not silently proceed.

---

## Phase 4: Architecture Design

**Goal**: Design 2-3 implementation approaches with different trade-offs.

1. Launch **2-3 `generalPurpose` subagents in parallel** using the `Task` tool, each with a different focus:
   - **Minimal-changes** — smallest possible change, maximum reuse
   - **Clean-architecture** — maintainability, elegant abstractions, deep modules
   - **Pragmatic balance** — speed + quality
2. Use the **code-architect prompt template** below for each one.
3. Review all approaches. Form your own opinion on which fits best (consider: small fix vs large feature, urgency, complexity, team context).
4. Present to the user:
   - Brief summary of each approach
   - Trade-offs comparison
   - **Your recommendation with reasoning**
   - Concrete implementation differences
5. **Ask the user which approach they prefer.** Wait for answer before Phase 5.

### code-architect prompt template

When calling `Task` with `subagent_type: "generalPurpose"` for architecture design:

> You are a senior software architect delivering a comprehensive, actionable architecture blueprint. Bias: **[MINIMAL CHANGES | CLEAN ARCHITECTURE | PRAGMATIC]**.
>
> **Process**:
>
> 1. **Pattern analysis** — existing patterns, conventions, stack, module boundaries, abstraction layers, `CLAUDE.md` / `CONTEXT.md` / `AGENTS.md` / `.cursor/rules/` guidelines, similar features
> 2. **Architecture design** — based on patterns found, design the complete feature. Make decisive choices, pick one approach, commit. Design for testability, performance, maintainability.
> 3. **Implementation blueprint** — every file to create/modify, component responsibilities, integration points, data flow, build phases
>
> **Output** (be decisive, do NOT present multiple options):
>
> - **Patterns & conventions found** with `file:line` references
> - **Architecture decision** with rationale and trade-offs
> - **Component design** — each component with file path, responsibilities, dependencies, interfaces
> - **Implementation map** — specific files to create/modify with detailed change descriptions
> - **Data flow** — entry points -> transformations -> outputs
> - **Build sequence** — phased steps as a checklist
> - **Critical details** — error handling, state management, testing, performance, security

---

## Phase 5: Implementation

**Goal**: Build the feature.

**DO NOT START WITHOUT EXPLICIT USER APPROVAL OF THE PHASE 4 RECOMMENDATION.**

1. Wait for explicit approval of the chosen architecture.
2. Re-read all relevant files identified in earlier phases — don't trust your memory of them.
3. Implement following the chosen architecture, strictly respecting codebase conventions.
4. Write clean code. Comment only non-obvious intent (no narration comments).
5. Update `TodoWrite` as you progress through sub-tasks.

---

## Phase 6: Quality Review

**Goal**: Verify the implementation is simple, DRY, correct, and convention-compliant.

1. Launch **3 `generalPurpose` subagents in parallel** using the `Task` tool, each with a different focus:
   - **Simplicity & DRY & elegance**
   - **Bugs & functional correctness**
   - **Project conventions & abstractions**
2. Use the **code-reviewer prompt template** below for each one.
3. Consolidate findings. Identify the highest-severity issues that genuinely need fixing.
4. **Present findings to the user and ask**: fix now, fix later, or proceed as-is?
5. Act on the user's decision.

### code-reviewer prompt template

When calling `Task` with `subagent_type: "generalPurpose"` for review:

> You are an expert code reviewer. Focus: **[SIMPLICITY/DRY/ELEGANCE | BUGS/CORRECTNESS | CONVENTIONS/ABSTRACTIONS]**.
>
> **Scope**: review unstaged changes from `git diff` unless the user specifies otherwise.
>
> **Responsibilities**:
>
> - **Project guidelines compliance** — `CLAUDE.md` / `AGENTS.md` / `CONTEXT.md` / `.cursor/rules/`: imports, framework conventions, language style, function declarations, error handling, logging, testing, platform compatibility, naming
> - **Bug detection** — logic errors, null/undefined handling, race conditions, memory leaks, security, performance
> - **Code quality** — duplication, missing critical error handling, accessibility, test coverage gaps
>
> **Confidence scoring** (0-100). **Only report issues with confidence >= 80.** Quality over quantity.
>
> **Per issue, output**:
>
> - Description + confidence score
> - File path + line number
> - Specific guideline reference or bug explanation
> - Concrete fix suggestion
>
> Group by **Critical** vs **Important**. If no high-confidence issues, briefly confirm the code meets standards.

---

## Phase 7: Summary

**Goal**: Close the loop.

1. Mark all `TodoWrite` items complete.
2. Summarize:
   - What was built
   - Key decisions made
   - Files modified
   - Suggested next steps (tests, docs, follow-ups)
