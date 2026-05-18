# Changelog skill — examples

## Workflow A only (`/update-changelog`)

**Git:** unstaged change removes a config flag and updates README.

**Result in CHANGELOG:**

```markdown
## [Unreleased]

### Changed

- Removed `legacyMode` config flag; use `mode` instead.
- README options table updated.
```

**Reply includes:** “Suggested next version: **0.4.0** (MINOR) when you ship — use `/update-changelog-release`.”

---

## Workflow B (`/update-changelog-release`)

**Before:** latest release `0.2.0`, `[Unreleased]` lists new feature + breaking config removal.

**After:**

```markdown
## [Unreleased]

## [0.3.0] - 2026-05-18

### Added
- …

### Changed
- …
```

**Manifest table in reply:**

| File | Key | Change |
|------|-----|--------|
| `thunderstore.toml` | `versionNumber` | `0.2.0` → `0.3.0` |
| `package.json` | `version` | `0.2.0` → `0.3.0` |

No git commit unless the user asked in the same message.
