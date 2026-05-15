---
name: git-smart-commit
description: >-
  Stages all working-tree changes and creates one commit whose message follows
  Conventional Commits 1.0.0. Use when the user wants to commit everything,
  wants conventional commit messages, or invokes commit-all / smart commit
  workflows.
disable-model-invocation: true
---

# Git smart commit

Spec: [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/#specification). Commit messages **MUST** match that grammar unless the user explicitly asks for a different format in this thread.

## When to use

- User wants **one commit** that includes **all** current changes (`git add -A`).
- User wants a **clear** message: informative description and optional body/footers—not a vague title, not a changelog dump.

## Workflow

1. Run `git status` and `git diff` (unstaged) plus `git diff --staged` if anything is already staged. Understand **what** changed and **why** (infer intent from diffs and file paths). Detect **breaking** API or behavior changes from the diff when obvious.
2. If there is nothing to commit, say so and stop (do not create an empty commit).
3. Stage everything: `git add -A`.
4. Re-check `git diff --staged` (and `git status --short`) so the message matches **staged** content only.
5. Choose **one** `type` that matches the dominant change per the spec:
   - Use **`feat`** when the commit **adds a new feature** (spec: type `feat` MUST be used for that).
   - Use **`fix`** when the commit **fixes a bug** (spec: type `fix` MUST be used for that).
   - Otherwise use another allowed noun type when it fits (e.g. `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `style`)—the spec allows types other than `feat` and `fix`.
6. Write the full message per **Commit message structure** below, then commit:
   - Prefer `git commit -m "header" -m "body and footers"` (or equivalent) so the blank line between header and body is preserved.
   - Do **not** push unless the user explicitly asked to push in the same request.
7. After a **successful** commit, **always show the user the full commit message in the chat**—the exact text Git recorded (header, body, footers). Use `git log -1 --format=%B` or paste the same message you passed to `git commit`; do not summarize or omit it.

## Commit message structure (Conventional Commits 1.0.0)

Overall shape:

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

### Header (first line)

Per the spec:

1. Commits **MUST** be prefixed with a **type** (noun: `feat`, `fix`, etc.), then optional **scope** in parentheses, optional **`!`** for breaking, then **REQUIRED** **`: `** (colon + single space) and the **description**.
2. **Scope**, if present, **MUST** be a noun naming a section of the codebase inside parentheses, e.g. `fix(parser):` …  
3. The **description** **MUST** immediately follow `: `—a **short** summary of the code change, **imperative mood**, no trailing period unless it is part of a proper noun. Prefer roughly **50–72 characters** when practical; go slightly longer for clarity rather than cryptic shorthand.
4. **Breaking changes** **MUST** be signaled either by **`!`** immediately before the **`:`** (e.g. `feat(api)!: …`, `refactor!: …`) **or** by a **`BREAKING CHANGE:`** footer (see Footers). If `!` is used in the header, the **`BREAKING CHANGE:`** footer **MAY** be omitted; in that case the **description** **SHALL** describe the breaking change (per spec).
5. Casing: spec says types are not case-sensitive for tooling, but **be consistent**; prefer **lowercase** types (`feat`, `fix`).

### Body

- A longer body **MAY** follow the header; it **MUST** begin **one blank line** after the description.
- The body is free-form and **MAY** be multiple paragraphs separated by blank lines.
- Use a body when the change has **multiple themes**, **non-obvious rationale**, or **migration notes**—keep paragraphs focused; wrap near **72 characters** per line for readability (not a spec requirement, but standard Git practice).

### Footers

- Footers **MAY** appear **one blank line** after the body (or after the header if there is no body).
- Each footer **MUST** be a **word token**, then **`:`** + space **or** **`#`** + space, then the value (git trailer style). Example: `Refs: #123`, `Reviewed-by: Name`.
- Footer tokens **MUST** use **hyphens** instead of spaces in the token (e.g. `Acked-by`), **except** **`BREAKING CHANGE`** (and **`BREAKING-CHANGE`** is synonymous with **`BREAKING CHANGE`** per spec).
- **`BREAKING CHANGE:`** (uppercase) footer **MUST** read: `BREAKING CHANGE: ` followed by the migration description when breaking is communicated in the footer.

### Tone and length

- Professional, specific, no marketing fluff.
- Mention **user-visible behavior** and **risky areas** (auth, data, migrations) in the body or footers when relevant.
- Avoid ultra-short meaningless descriptions (`fix: stuff`). Avoid essay-length bodies unless the diff truly needs it.

## Split vs squash

- Default: **one commit** for this workflow.
- If the staged set clearly mixes **unrelated** work, warn the user and offer to split; only split if they confirm (aligns with spec FAQ: prefer multiple commits when multiple types apply).

## Safety

- Never `git add` / commit **outside** the repo unless the user asked.
- Do not rewrite history (`rebase`, `reset --hard`, force-push) unless explicitly requested.
- Do not put secrets or huge blobs in the message; reference paths instead.

## Examples (shape only)

```
fix(extension): restore popup focus after settings save

Guard the postMessage handler so we do not steal focus from the active tab.
```

```
feat(storage): persist event tone preference

Load defaults from contracts; migrate missing keys on read.
```

```
refactor(background)!: drop legacy message envelope

BREAKING CHANGE: onMessage listeners must use the v2 envelope shape; v1 is no longer accepted.
```

```
feat(cli)!: require Node 20 or later
```
