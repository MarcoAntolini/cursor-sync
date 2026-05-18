# Changelog reference (Keep a Changelog + SemVer)

Official specs:
- [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
- [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)

## Good bullets (any project)

```markdown
### Added
- OAuth2 refresh-token support for API clients.

### Changed
- Default request timeout increased from 30s to 60s.

### Fixed
- Pagination cursor no longer resets on empty pages.
```

## Poor bullets (avoid)

```markdown
### Misc
- Updated files

### Added
- src/main.rs, lib/foo.ts
- various fixes
```

## SemVer quick decision

| Unreleased contains | Bump |
|---------------------|------|
| Only fixes, no API/config break | PATCH |
| New features, backwards compatible | MINOR |
| Breaking API, removed public options, incompatible migrations | MAJOR (or MINOR if `0.y.z`) |

Pre-release labels (`1.0.0-alpha.1`) only when the project already uses them.

## Version manifest discovery

At release time, search the repo (or the package path the user cares about) for **product version** fields. Common locations — use what exists; ignore what does not:

| Ecosystem / tool | File(s) | Typical key / field |
|------------------|---------|---------------------|
| Node.js | `package.json` | `version` |
| Python | `pyproject.toml`, `setup.cfg` | `version` |
| Rust | `Cargo.toml` | `package.version` |
| .NET | `*.csproj` | `<Version>` |
| Java / Kotlin | `gradle.properties`, `build.gradle.kts` | `version` |
| Ruby | `*.gemspec`, `lib/**/version.rb` | `version` |
| Go | — | often git tags only; check `README` / release docs |
| PHP | `composer.json` | `version` |
| iOS / macOS | `Info.plist`, Xcode project | `CFBundleShortVersionString` |
| Android | `build.gradle.kts` | `versionName` |
| Helm / K8s | `Chart.yaml` | `version` |
| Terraform module | often tags only | — |
| Thunderstore / tcli | `thunderstore.toml` | `[package]` `versionNumber` |
| Generic TOML/YAML | `manifest.toml`, `app.yml`, etc. | `version`, `appVersion` |

**Usually not product semver** (do not bump to match changelog without user confirmation):

- `schemaVersion`, `apiVersion`, `formatVersion` (file/schema format)
- Dependency versions inside lockfiles
- CI or linter config versions

## Release checklist (tell user when releasing)

- [ ] `CHANGELOG.md`: `[Unreleased]` renamed to `[X.Y.Z] - YYYY-MM-DD`; new empty `[Unreleased]` added
- [ ] Discovered version manifest(s) set to `X.Y.Z` (if user requested bumps)
- [ ] Git tag `vX.Y.Z` or `X.Y.Z` (if the project tags releases — match existing tag style)
- [ ] Release notes / GitHub Release / store listing (if the project uses them)

## When KAC does not apply

If the repo has no `CHANGELOG.md` or uses only GitHub Releases:

- Offer to draft release notes in KAC style, or
- Ask the user which file or tag message to update.
