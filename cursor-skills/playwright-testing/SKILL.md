---
name: playwright-testing
description: Write, debug, and maintain Playwright tests AND drive live web apps with Playwright automation. Covers E2E, component, API, GraphQL, visual regression, accessibility, security (XSS, CSRF), performance (Web Vitals, Lighthouse), Electron, browser extensions, iframes, canvas/WebGL, service workers/PWA, mobile/responsive layouts, touch gestures, WebSockets, geolocation, permissions, multi-tab/popup flows, OAuth, file uploads/downloads, date/time mocking, multi-user collaboration, third-party services (payments, email/SMS verification), console error monitoring, Page Object Model, fixtures, global setup/teardown, test annotations, tags, CI/CD (GitHub Actions, GitLab, Docker), sharding, parallel execution, reporting, and Python Playwright scripts for verifying local web apps. Use when writing or fixing Playwright tests, debugging flakes, mocking APIs, configuring CI, or automating verification of local frontends.
---

# Playwright Testing

Two reference packs:

1. **Best-practices reference** — writing/maintaining Playwright test suites.
2. **Live webapp automation** — driving local web apps with Python Playwright scripts for verification.

## When to use

- Writing new Playwright tests (E2E, component, API, GraphQL, visual)
- Debugging test failures, flakes, timeouts, race conditions
- Mocking APIs, OAuth, payment gateways
- Setting up CI/CD pipelines for Playwright
- Verifying frontend behavior of a running local app, capturing screenshots, inspecting DOM/logs

## Topic router

### Pack 1: Playwright best practices

Browse the full activity-based reference guide at [`references/best-practices/index.md`](references/best-practices/index.md). Detailed sub-references organized by area:

| Area | Folder |
|---|---|
| Test structure, locators, assertions, fixtures, configuration, POM, annotations, tags, global setup | [`references/best-practices/core/`](references/best-practices/core/) |
| Authentication, mobile testing, clock mocking, multi-context, multi-user, network-advanced, third-party | [`references/best-practices/advanced/`](references/best-practices/advanced/) |
| Architecture decisions (POM vs fixtures, when to mock, test type selection) | [`references/best-practices/architecture/`](references/best-practices/architecture/) |
| WebSockets, iframes, browser APIs, service workers | [`references/best-practices/browser-apis/`](references/best-practices/browser-apis/) |
| Debugging, flaky tests, console errors, error testing | [`references/best-practices/debugging/`](references/best-practices/debugging/) |
| React, Angular, Vue, Next.js specifics | [`references/best-practices/frameworks/`](references/best-practices/frameworks/) |
| CI/CD, GitHub Actions, GitLab, Docker, parallel/sharding, performance, reporting, coverage | [`references/best-practices/infrastructure-ci-cd/`](references/best-practices/infrastructure-ci-cd/) |
| Component, API, GraphQL, visual regression, accessibility, security, performance, electron, browser extensions, drag-drop, forms, file ops, canvas/WebGL, i18n | [`references/best-practices/testing-patterns/`](references/best-practices/testing-patterns/) |

### Pack 2: Live webapp automation (Python)

See [`references/webapp-automation/overview.md`](references/webapp-automation/overview.md). Use this pack when you need to drive a running local app (verify behavior, capture screenshots, inspect rendered DOM).

Helper script: [`scripts/with_server.py`](scripts/with_server.py) — manages server lifecycle (one or multiple servers).

Example automation patterns: [`examples/element_discovery.py`](examples/element_discovery.py), [`examples/console_logging.py`](examples/console_logging.py), [`examples/static_html_automation.py`](examples/static_html_automation.py).

**Always run scripts with `--help` first.** Do not read the script source unless absolutely necessary — they are black-box helpers designed to keep your context window clean.

## Quick decision tree

```
What are you doing?

Writing a test?
├─ E2E test → references/best-practices/core/test-suite-structure.md + core/locators.md + core/assertions-waiting.md
├─ Component test → references/best-practices/testing-patterns/component-testing.md
├─ API test → references/best-practices/testing-patterns/api-testing.md
├─ Visual regression → references/best-practices/testing-patterns/visual-regression.md
├─ Accessibility → references/best-practices/testing-patterns/accessibility.md
├─ Mobile / responsive → references/best-practices/advanced/mobile-testing.md
└─ Multi-user / collaboration → references/best-practices/advanced/multi-user.md

Test failing or flaky?
├─ Flake investigation → references/best-practices/debugging/flaky-tests.md
├─ Element not found → references/best-practices/core/locators.md + debugging/debugging.md
├─ Timeouts → references/best-practices/core/assertions-waiting.md + debugging/debugging.md
└─ Console errors → references/best-practices/debugging/console-errors.md

Setting up infrastructure?
├─ CI/CD → references/best-practices/infrastructure-ci-cd/ci-cd.md
├─ GitHub Actions → references/best-practices/infrastructure-ci-cd/github-actions.md
├─ Sharding / parallel → references/best-practices/infrastructure-ci-cd/parallel-sharding.md
└─ Docker → references/best-practices/infrastructure-ci-cd/docker.md

Verifying a live local app (not writing tests)?
└─ references/webapp-automation/overview.md + scripts/with_server.py
```

## Test validation loop

After writing or modifying tests:

1. **Run tests**: `npx playwright test --reporter=list`
2. **If tests fail**:
   - Review error output and trace: `npx playwright show-trace`
   - Fix locators, waits, or assertions
   - Re-run tests
3. **Only proceed when all tests pass**
4. **Run multiple times for critical tests**: `npx playwright test --repeat-each=5`

## Live webapp verification: reconnaissance-then-action

For dynamic apps (always do this on apps that hydrate or render client-side):

1. Navigate and `page.wait_for_load_state('networkidle')`
2. Take screenshot or inspect DOM:
   ```python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   ```
3. Identify selectors from rendered state
4. Execute actions with discovered selectors

**Common pitfall**: do NOT inspect the DOM before `networkidle` on dynamic apps.

## Multi-server example

For backend + frontend testing in one run:

```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

The automation script only contains Playwright logic; the helper manages server lifecycle automatically. Always launch chromium in headless mode and close the browser when done.
