---
name: swiftui-ios-expert
description: Write, review, refactor, and profile SwiftUI code for iOS, iPadOS, macOS, tvOS, watchOS, and visionOS. Covers modern API usage (iOS 26+, Swift 6.2+, Liquid Glass), state management (@State, @Binding, @StateObject, @Observable, @Bindable), view composition, performance, layout, lists/ForEach, animations (basics, transitions, advanced/keyframe, @Animatable), Swift Charts (incl. Chart3D), sheets/navigation (NavigationStack, NavigationSplitView, Inspector), focus/scroll/text patterns, image optimization, macOS scenes/windows, accessibility (Dynamic Type, VoiceOver, Reduce Motion), Human Interface Guidelines (clarity/deference/depth, SF Symbols, semantic colors, materials), iOS navigation patterns (NavigationStack, TabView iOS 18+, modals/sheets), AND Instruments .trace recording and analysis (hangs, hitches, CPU hotspots, excessive view updates). Use when writing or reviewing SwiftUI code, designing iOS interfaces following HIG, profiling SwiftUI performance, or recording and interpreting Instruments traces.
---

# SwiftUI & iOS Expert

Three reference packs covering SwiftUI code review, modern SwiftUI patterns + Instruments tracing, and iOS Human Interface Guidelines.

## When to use

- Writing, reviewing, or refactoring SwiftUI code
- Designing iOS interfaces following Apple HIG
- Implementing iOS navigation (NavigationStack, TabView, sheets, modals)
- Profiling SwiftUI performance — hangs, hitches, CPU hotspots, excessive view updates
- Recording or analyzing Instruments `.trace` files

## Core instructions (apply to every SwiftUI task)

- iOS 26 exists and is the default deployment target for new apps
- Target Swift 6.2+ with modern Swift concurrency
- Prefer native SwiftUI APIs over UIKit/AppKit bridging unless bridging is necessary
- Do not introduce third-party frameworks without asking first
- Break different types into different Swift files (no multiple structs/classes/enums per file)
- Use folder layout by app features
- Only adopt Liquid Glass when explicitly requested (see [`references/expert-patterns/liquid-glass.md`](references/expert-patterns/liquid-glass.md))
- Gate version-specific APIs with `#available` and provide fallbacks
- Read [`references/expert-patterns/latest-apis.md`](references/expert-patterns/latest-apis.md) first on every task to avoid deprecated APIs

## Pack 1: SwiftUI code review

Use when reading, writing, or reviewing SwiftUI projects. See [`references/code-review/overview.md`](references/code-review/overview.md). Report only genuine problems — do not nitpick or invent issues.

Review process (load partial references for partial reviews):

1. Check deprecated API — [`references/code-review/api.md`](references/code-review/api.md)
2. Views, modifiers, and animations — [`references/code-review/views.md`](references/code-review/views.md)
3. Data flow — [`references/code-review/data.md`](references/code-review/data.md)
4. Navigation — [`references/code-review/navigation.md`](references/code-review/navigation.md)
5. HIG compliance — [`references/code-review/design.md`](references/code-review/design.md)
6. Accessibility (Dynamic Type, VoiceOver, Reduce Motion) — [`references/code-review/accessibility.md`](references/code-review/accessibility.md)
7. Performance — [`references/code-review/performance.md`](references/code-review/performance.md)
8. Modern Swift — [`references/code-review/swift.md`](references/code-review/swift.md)
9. Code hygiene — [`references/code-review/hygiene.md`](references/code-review/hygiene.md)

### Output format for reviews

Organize by file. For each issue: state file + line, name the rule violated, show brief before/after. End with a prioritized summary. Skip files with no issues.

## Pack 2: Expert patterns + Instruments tracing

See [`references/expert-patterns/overview.md`](references/expert-patterns/overview.md) for the full topic router. Highlights:

| Topic | Reference |
|---|---|
| Deprecated API lookup (read first) | [`references/expert-patterns/latest-apis.md`](references/expert-patterns/latest-apis.md) |
| State management, `@Observable` migration | [`references/expert-patterns/state-management.md`](references/expert-patterns/state-management.md) |
| View composition, `@ViewBuilder` | [`references/expert-patterns/view-structure.md`](references/expert-patterns/view-structure.md) |
| Performance, hot-path optimization, `_logChanges()` | [`references/expert-patterns/performance-patterns.md`](references/expert-patterns/performance-patterns.md) |
| Lists, ForEach identity, Table (iOS 16+) | [`references/expert-patterns/list-patterns.md`](references/expert-patterns/list-patterns.md) |
| Layout patterns, GeometryReader alternatives | [`references/expert-patterns/layout-best-practices.md`](references/expert-patterns/layout-best-practices.md) |
| Sheets, NavigationSplitView, Inspector | [`references/expert-patterns/sheet-navigation-patterns.md`](references/expert-patterns/sheet-navigation-patterns.md) |
| ScrollView, programmatic scrolling | [`references/expert-patterns/scroll-patterns.md`](references/expert-patterns/scroll-patterns.md) |
| Focus state, focusable views | [`references/expert-patterns/focus-patterns.md`](references/expert-patterns/focus-patterns.md) |
| Animation basics, timing, performance | [`references/expert-patterns/animation-basics.md`](references/expert-patterns/animation-basics.md) |
| View transitions, `matchedGeometryEffect` | [`references/expert-patterns/animation-transitions.md`](references/expert-patterns/animation-transitions.md) |
| Phase/keyframe (iOS 17+), `@Animatable` macro (iOS 26+) | [`references/expert-patterns/animation-advanced.md`](references/expert-patterns/animation-advanced.md) |
| Accessibility patterns | [`references/expert-patterns/accessibility-patterns.md`](references/expert-patterns/accessibility-patterns.md) |
| Swift Charts (incl. Chart3D iOS 26+) | [`references/expert-patterns/charts.md`](references/expert-patterns/charts.md) |
| Charts accessibility (Audio Graph) | [`references/expert-patterns/charts-accessibility.md`](references/expert-patterns/charts-accessibility.md) |
| AsyncImage, downsampling, caching | [`references/expert-patterns/image-optimization.md`](references/expert-patterns/image-optimization.md) |
| Liquid Glass (iOS 26+) | [`references/expert-patterns/liquid-glass.md`](references/expert-patterns/liquid-glass.md) |
| macOS scenes (Settings, MenuBarExtra, WindowGroup) | [`references/expert-patterns/macos-scenes.md`](references/expert-patterns/macos-scenes.md) |
| macOS window styling | [`references/expert-patterns/macos-window-styling.md`](references/expert-patterns/macos-window-styling.md) |
| macOS views (HSplitView, Table, PasteButton, AppKit interop) | [`references/expert-patterns/macos-views.md`](references/expert-patterns/macos-views.md) |
| Text initializer selection | [`references/expert-patterns/text-patterns.md`](references/expert-patterns/text-patterns.md) |
| Instruments trace recording | [`references/expert-patterns/trace-recording.md`](references/expert-patterns/trace-recording.md) |
| Instruments trace analysis | [`references/expert-patterns/trace-analysis.md`](references/expert-patterns/trace-analysis.md) |

### Recording an Instruments trace

User says "record a trace", "profile the app", or "capture a session":

1. **Confirm target** — attach to a running app, launch an app, or record all processes? List devices:
   ```bash
   python3 ".cursor/skills/swiftui-ios-expert/scripts/record_trace.py" --list-devices
   ```
2. **Pick template** — `SwiftUI` template for real devices (incl. host Mac); switch to `--template "Time Profiler"` on iOS Simulator (SwiftUI lane empty there)
3. **Start recording** — for agent-driven sessions with a stop-file:
   ```bash
   python3 ".cursor/skills/swiftui-ios-expert/scripts/record_trace.py" \
       --device "<name|udid>" --attach "<AppName>" \
       --stop-file /tmp/stop-trace --output ~/Desktop/session.trace
   ```
4. **Signal stop** — when user finishes, `touch /tmp/stop-trace`
5. **Analyse** with the trace-driven improvement workflow

### Analysing an Instruments trace

```bash
python3 ".cursor/skills/swiftui-ios-expert/scripts/analyze_trace.py" --trace <path> --json-only --top 10 [--window START_MS:END_MS]
```

Key diagnostics:
- `main_running_coverage_pct` per correlation (<25% = blocked; ≥75% = CPU-bound)
- `swiftui-causes.top_sources` reveals **why** updates keep happening — high-edge-count sources like `UserDefaultObserver.send()` or wide `EnvironmentWriter` entries are structural invalidation bugs
- `--fanin-for "<view name>"` ranks source nodes driving a specific view's updates

Full reference: [`references/expert-patterns/trace-analysis.md`](references/expert-patterns/trace-analysis.md).

## Pack 3: iOS HIG + SwiftUI design patterns

See [`references/hig-design/overview.md`](references/hig-design/overview.md) for HIG principles (Clarity, Deference, Depth), SwiftUI layout system, navigation patterns (NavigationStack, TabView iOS 18+), SF Symbols, Dynamic Type, materials, shadows, and a quick-start `FeatureCard` component.

Additional design references in [`references/hig-design/`](references/hig-design/):

- [`hig-patterns.md`](references/hig-design/hig-patterns.md)
- [`ios-navigation.md`](references/hig-design/ios-navigation.md)
- [`swiftui-components.md`](references/hig-design/swiftui-components.md)

## Correctness checklist (hard rules — violations are bugs)

- [ ] `@State` properties are `private`
- [ ] `@Binding` only where a child modifies parent state
- [ ] Passed values never declared as `@State` or `@StateObject` (they ignore updates)
- [ ] `@StateObject` for view-owned objects; `@ObservedObject` for injected
- [ ] iOS 17+: `@State` with `@Observable`; `@Bindable` for injected observables needing bindings
- [ ] `ForEach` uses stable identity (never `.indices` for dynamic content)
- [ ] Constant number of views per `ForEach` element
- [ ] `.animation(_:value:)` always includes the `value` parameter
- [ ] `@FocusState` properties are `private`
- [ ] No redundant `@FocusState` writes inside tap gesture handlers on `.focusable()` views
- [ ] iOS 26+ APIs gated with `#available` and fallback provided
- [ ] `import Charts` present in files using chart types

## Design best practices

1. Use semantic colors (`.primary`, `.secondary`, `.background`) for automatic light/dark mode
2. Embrace SF Symbols for consistency and automatic accessibility
3. Support Dynamic Type via semantic fonts (`.body`, `.headline`)
4. Add `.accessibilityLabel()` and `.accessibilityHint()` on every meaningful control
5. Respect `safeAreaInset`; avoid hardcoded edge padding
6. Use `@SceneStorage` for state restoration
7. Design for iPad multitasking (split view, slide over)
8. Test on device (simulator misses haptics and full perf)

## Common issues

- **Layout breaking**: avoid `.fixedSize()`; prefer flexible layouts
- **Performance**: use `LazyVStack` / `LazyHStack` for long lists
- **Navigation bugs**: ensure `NavigationLink` values are `Hashable`
- **Dark mode**: never hardcode colors; use semantic or asset catalog colors
- **Accessibility**: test with VoiceOver enabled
- **Memory leaks**: watch for strong reference cycles in closures
