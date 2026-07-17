# Update changelog and release

Follow **Workflow B — Release** in `.cursor/skills/update-changelog/SKILL.md` end to end (includes **Workflow A** first). Specs: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## Do

1. **Refresh `[Unreleased]`** from git (uncommitted + staged; include all work that belongs in this release).
2. **Choose `newVersion`** from `[Unreleased]` vs the latest released version in the changelog (SemVer). Explain the bump in the reply **before** editing files.
3. **Cut the changelog:** `[Unreleased]` → `## [newVersion] - YYYY-MM-DD`, then add a new empty `## [Unreleased]` at the top.
4. **Bump every product version manifest** in the repo to `newVersion` (search for the previous version; see skill `reference.md`). Examples: `package.json` `version`, `thunderstore.toml` `versionNumber`, `pyproject.toml`, `Cargo.toml`, etc.
5. Reply with: semver rationale, the new version section, and a **table of every file/key** you updated (`old` → `new`).

## Optional arguments

- **`commits`** — when refreshing `[Unreleased]`, also include recent commits not only the working tree (same as `/update-changelog commits`).
- **Explicit version** (e.g. `1.2.0`) — use that as `newVersion` if it is valid SemVer and ≥ latest; still justify briefly.
- **Date** — use the given ISO date on the version heading instead of today.

## Do not

- Bump `schemaVersion`, `apiVersion`, or other non-product version fields.
- `git commit`, `git push`, or `git tag` unless I **explicitly** asked in this same message (otherwise remind me to use `git-commit` and my publish workflow).

## After this command

Typical follow-up: `git-commit` → GitHub Release / Thunderstore `tcli publish` / CI release workflow with tag matching `newVersion`.
