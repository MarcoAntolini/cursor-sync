---
name: update-changelog
description: >-
  Updates CHANGELOG.md under [Unreleased] from git changes (working tree and
  optional recent commits), following Keep a Changelog 1.1.0 and Semantic
  Versioning 2.0.0. Works across languages and project types; discovers version
  manifests at release time. Use when the user asks to update the changelog,
  refresh [Unreleased], document changes since last commit, or prepare a release.
disable-model-invocation: true
---

# Update changelog

Specs: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) · [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)

Language- and stack-agnostic: use **git** for changes and **KAC** for prose. Do not assume a specific package manager, mod platform, or repo layout beyond a changelog file.

## When to use

- User wants `CHANGELOG.md` updated with work **since the last commit** (uncommitted + staged).
- User wants `[Unreleased]` filled before a release.
- User asks which **semver** bump fits the accumulated changes.
- User is preparing a release and needs version files aligned with the new changelog section.

## Workflow

1. **Locate changelog** — default `CHANGELOG.md` at repo root; use `CHANGELOG` or a path the user gives if the project differs. Read it fully. If the project does not use KAC, say so and follow the user’s format or suggest adopting KAC.
2. **Gather changes** (parallel when possible):
   - `git status`
   - `git diff` and `git diff --staged`
   - `git log -1 --oneline` (context for “since last commit”)
   - Optional: `git log -10 --oneline` and `git diff HEAD~N..HEAD` only when the user asked to include **recent commits**, not only the working tree.
3. **Infer notable changes** from diffs and commit messages. Group into KAC categories (below). Write for **humans**, not a file list.
4. **Edit only `[Unreleased]`** unless the user explicitly asked to **cut a release** (see Release workflow).
5. **Merge, don’t duplicate**: if a bullet already states the same change, refine it instead of adding a second line.
6. **Show the user** the new or updated `[Unreleased]` section in the reply.

## Keep a Changelog rules (required)

- Prefer file name `CHANGELOG.md`; format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- **Newest version at the top**; `[Unreleased]` **must** be the first version section.
- Use exactly these change-group headings (only include sections that apply):
  - `### Added` — new features
  - `### Changed` — changes in existing functionality
  - `### Deprecated` — soon-to-be removed
  - `### Removed` — removed features
  - `### Fixed` — bug fixes
  - `### Security` — vulnerabilities
- **Do not** use custom sections (no “Documentation”, “Internal”, “Misc”).
- Each bullet: **concise**; prefer clear **user impact**. Link issues/PRs when IDs are known.
- **Do not** dump raw commit messages or every touched path.

Map from diffs (guide, not rigid):

| Signal in diff | Section |
|----------------|---------|
| New files, features, options, APIs | Added |
| Behavior/config/docs adjustments | Changed |
| Bug fix | Fixed |
| Deleted feature or option | Removed |
| `SECURITY`, CVE, auth fix | Security |
| “Will be removed” warnings | Deprecated |

## Map conventional commits → KAC (when using commit log)

| Commit type | Usually KAC |
|-------------|-------------|
| `feat` | Added (or Changed if only extending behavior) |
| `fix` | Fixed |
| `docs` | Changed (if user-facing) or skip if trivial |
| `refactor`, `perf` | Changed |
| `BREAKING CHANGE` / `!` | Changed + note breaking, or Removed |
| `chore`, `ci`, `build` | Omit unless user-visible |

## `[Unreleased]` template

If missing, add after the intro blurb (keep existing KAC/semver intro lines if present):

```markdown
## [Unreleased]

### Added

- …

### Changed

- …
```

Omit empty `###` sections entirely.

## Release workflow (only when user asks to release)

1. Decide **semver** from accumulated `[Unreleased]` content ([SemVer 2.0.0](https://semver.org/spec/v2.0.0.html)):
   - **MAJOR**: incompatible API/behavior changes users must react to.
   - **MINOR**: backwards-compatible new functionality.
   - **PATCH**: backwards-compatible bug fixes only.
   - For `0.y.z` initial development, **MINOR** may include breaking changes; still document breaks clearly.
   - If the project uses **CalVer** or another scheme, follow existing changelog conventions and say which bump you recommend.
2. Rename `[Unreleased]` → `## [X.Y.Z] - YYYY-MM-DD` (ISO 8601 date, today unless user says otherwise).
3. Add a fresh empty `## [Unreleased]` at the top.
4. **Discover version manifests** (read-only scan; see [reference.md](reference.md)). List files/keys that should match `X.Y.Z`. **Only edit** them if the user asked to bump versions in the same task.
5. **Do not bump** keys that are **not** product semver (e.g. `schemaVersion`, `apiVersion`, lockfile versions, tool config schema ids). When unsure, name the field and ask.

## Monorepos and multiple packages

- Ask which package or path the changelog entry is for, or use the path the user’s diff touches.
- One `[Unreleased]` may not fit all packages; prefer separate changelogs or prefixed bullets if the repo already does.

## What not to do

- Do not remove or rewrite **released** version sections unless the user asked.
- Do not add `[Unreleased]` entries for changes already listed under a released version.
- Do not invent changes not supported by git diff / commits.
- Do not assume Thunderstore, npm, or any single ecosystem.

## Additional reference

- Version manifest table, examples, release checklist: [reference.md](reference.md)
