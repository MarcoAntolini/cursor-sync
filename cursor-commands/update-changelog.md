# Update changelog

Follow the skill **update-changelog** at `.cursor/skills/update-changelog/SKILL.md`. Read and apply it completely ([Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)).

## Default (no arguments)

1. Locate `CHANGELOG.md` (or path the project uses).
2. Update **`## [Unreleased]`** from **uncommitted + staged** changes (`git diff`, `git diff --staged`, `git status`).
3. Merge with existing bullets; do not duplicate.
4. Show the updated `[Unreleased]` section in the reply.

## Optional arguments

If I passed **`commits`** (or "recent commits"): also include changes from recent commits per the skill, not only the working tree.

If I passed **`release`** (or "cut release"):

1. Complete the default update if `[Unreleased]` is still empty or stale.
2. Run the skill's **release workflow**: semver recommendation, rename `[Unreleased]` → `[X.Y.Z] - YYYY-MM-DD`, add a new empty `[Unreleased]`.
3. **Discover** version manifests in the repo and **list** files/keys that should match `X.Y.Z`.
4. **Do not** edit version manifests or create git tags unless I explicitly asked to bump versions or tag in this message.

## Constraints

- Do not commit, push, or tag unless I ask separately (e.g. `/commit-all`, `/push-branch`).
- Do not invent changes unsupported by git.
- Stack- and language-agnostic; do not assume a specific package ecosystem.
