# Conventional Commits — message rules

Spec: [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/#specification). Follow this grammar unless the user asks for a different format in the thread.

## Shape

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

## Header

1. Prefix with a **type** (noun), optional **scope** in parentheses, optional **`!`** for breaking, then required `: ` and the **description**.
2. **Scope**, if present, is a noun naming a codebase section, e.g. `fix(parser):`.
3. **Description**: short summary, imperative mood, no trailing period unless part of a proper noun. Prefer ~50–72 characters; clarity beats cryptic shorthand.
4. **Breaking changes**: `!` immediately before `:` (e.g. `feat(api)!: …`) and/or a `BREAKING CHANGE:` footer. If only `!` is used, the description SHALL describe the breaking change.
5. Prefer lowercase types (`feat`, `fix`).

## Body

- Begins one blank line after the description.
- Free-form; multiple paragraphs OK.
- Use when there are multiple themes, non-obvious rationale, or migration notes. Wrap near 72 characters for readability.

## Footers

- One blank line after the body (or after the header if no body).
- Trailer style: token, then `: ` or `# `, then value (`Refs: #123`).
- Hyphenate multi-word tokens (`Acked-by`), except `BREAKING CHANGE` / `BREAKING-CHANGE`.
- Breaking footer: `BREAKING CHANGE: ` + migration description.

## Tone

- Specific and professional.
- Call out user-visible behavior and risky areas (auth, data, migrations) when relevant.
- Avoid meaningless short headers (`fix: stuff`) and essay bodies unless the diff needs them.

## Examples

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
