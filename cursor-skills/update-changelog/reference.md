# Changelog reference

- [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
- [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)

## SemVer decision (Workflow B)

| `[Unreleased]` contains | Bump from latest `X.Y.Z` |
|-------------------------|---------------------------|
| Fixes only, no breaking surface | **PATCH** `Z+1` |
| New backwards-compatible features | **MINOR** `Y+1`, reset `Z` to 0 |
| Breaking changes users must handle | **MAJOR** `X+1` (on `0.y.z`, often **MINOR** — state why) |

Pre-release (`1.0.0-alpha.1`) only if the project already uses that style.

## Version manifests to search and bump

Find the **current** release version (from changelog), then update matching fields to **newVersion**:

| Location | Field / pattern |
|----------|-----------------|
| `package.json` | `"version": "…"` |
| `package-lock.json` | top-level `"version"` only if it mirrors the package (often auto-regenerated; mention if user should run `npm install`) |
| `pyproject.toml` | `version = "…"` under `[project]` |
| `Cargo.toml` | `version = "…"` under `[package]` |
| `composer.json` | `"version": "…"` |
| `*.gemspec` | `spec.version = "…"` |
| `gradle.properties` / `build.gradle.kts` | `version=…` / `version = "…"` |
| `Chart.yaml` | `version:` |
| `thunderstore.toml` | `versionNumber = "…"` under `[package]` |
| `setup.py` / `__version__` | project-specific |

**Never treat as product semver:** `schemaVersion`, `apiVersion`, `formatVersion`, `lockfile` dependency entries, CI action versions.

## Bump examples

**thunderstore.toml**

```toml
versionNumber = "0.2.0"   →   versionNumber = "0.3.0"
```

**package.json**

```json
"version": "0.2.0"   →   "version": "0.3.0"
```

## Good vs poor bullets

**Good**

```markdown
### Changed
- Removed `guaranteeFieldNPCs`; per-NPC `fieldNPCs.*` toggles now control field guarantees.
```

**Poor**

```markdown
### Misc
- updated src/tracker.lua
```

## Release checklist (Workflow B)

- [ ] `[Unreleased]` refreshed from git
- [ ] New `## [X.Y.Z] - date` section created; empty `[Unreleased]` above it
- [ ] All product version manifests match `X.Y.Z`
- [ ] User commits (`git-commit`) and runs publish/tag/CI as needed
