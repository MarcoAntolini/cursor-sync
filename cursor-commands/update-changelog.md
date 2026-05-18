# Update changelog (Unreleased only)

Follow **Workflow A — Unreleased only** in `.cursor/skills/update-changelog/SKILL.md`. Read the skill’s [Shared preparation](#shared-preparation) and KAC rules first.

## Do

1. Update **`CHANGELOG.md`** → **`## [Unreleased]`** from **uncommitted + staged** changes (`git status`, `git diff`, `git diff --staged`).
2. Merge with existing bullets; do not duplicate.
3. Show the full updated **`## [Unreleased]`** section in the reply.
4. If `[Unreleased]` has content, state the **suggested next semver** (PATCH / MINOR / MAJOR) and remind me to use **`/update-changelog-release`** when I am ready to ship.

## Optional argument

If I passed **`commits`** (or “recent commits”): also include changes from commits after the latest released changelog version (or after the latest git release tag), not only the working tree.

## Do not

- Rename `[Unreleased]` or add a dated version section.
- Edit `package.json`, `thunderstore.toml`, or any other version manifest.
- `git commit`, `git push`, or `git tag` (use `/commit-all`, `/push-branch`, or your release workflow separately).
