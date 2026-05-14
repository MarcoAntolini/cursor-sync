---
name: flutter-expert
description: Build, review, and optimize cross-platform Flutter 3+ / Dart applications. Covers widget development, Riverpod and Bloc state management, GoRouter navigation, project structure, performance optimization, and the full motion stack — implicit animations (AnimatedContainer, AnimatedOpacity, AnimatedSwitcher, TweenAnimationBuilder), explicit animations (AnimationController, Tween, CurvedAnimation, AnimatedBuilder), Hero/shared-element transitions, staggered/sequenced animations, physics-based motion (springs, flings, drag, scroll physics), curves, reduced motion, and animation lifecycle bugs. Use when working in Flutter or Dart, mentioning widgets, providers, blocs, routing, jank/rebuilds, or any motion/animation task.
---

# Flutter Expert

Combined Flutter implementation + animation specialist. Two reference packs.

## When to use

- Building, refactoring, or reviewing Flutter 3+ / Dart code
- Choosing or implementing state management (Riverpod, Bloc/Cubit)
- Setting up navigation with GoRouter
- Performance issues: jank, dropped frames, excessive rebuilds
- Any animation work: implicit, explicit, Hero, staggered, physics-based, reduced-motion compliance

## Topic router

| Need | Reference |
|---|---|
| Project structure, dependencies, conventions | [`references/core/project-structure.md`](references/core/project-structure.md) |
| Riverpod providers, notifiers, consumer widgets | [`references/core/riverpod-state.md`](references/core/riverpod-state.md) |
| Bloc, Cubit, event-driven state | [`references/core/bloc-state.md`](references/core/bloc-state.md) |
| Navigation, routing, deep linking | [`references/core/gorouter-navigation.md`](references/core/gorouter-navigation.md) |
| Building reusable widgets, const-optimization | [`references/core/widget-patterns.md`](references/core/widget-patterns.md) |
| Performance: rebuilds, jank, DevTools | [`references/core/performance.md`](references/core/performance.md) |
| Full core overview / decision flow | [`references/core/overview.md`](references/core/overview.md) |
| Implicit animations (state-driven property changes) | [`references/animations/implicit.md`](references/animations/implicit.md) |
| Explicit animations (controller lifecycle, transitions) | [`references/animations/explicit.md`](references/animations/explicit.md) |
| Hero / shared-element route transitions | [`references/animations/hero.md`](references/animations/hero.md) |
| Staggered / sequenced animations | [`references/animations/staggered.md`](references/animations/staggered.md) |
| Physics, springs, flings, drag, scroll physics | [`references/animations/physics.md`](references/animations/physics.md) |
| Curves, easing, reduced-motion tuning | [`references/animations/curves.md`](references/animations/curves.md) |
| Full animations overview / decision guide | [`references/animations/overview.md`](references/animations/overview.md) |

Standalone animation demo files (rename classes, drop `main()`/`MaterialApp` when integrating):

- [`assets/templates/implicit_animation.dart`](assets/templates/implicit_animation.dart)
- [`assets/templates/explicit_animation.dart`](assets/templates/explicit_animation.dart)
- [`assets/templates/hero_transition.dart`](assets/templates/hero_transition.dart)
- [`assets/templates/staggered_animation.dart`](assets/templates/staggered_animation.dart)

## Core workflow

1. **Setup** — scaffold project, add dependencies (`flutter pub get`), configure routing.
2. **State** — define Riverpod providers or Bloc/Cubit classes; run `flutter analyze` and fix every lint/warning before proceeding.
3. **Widgets** — build reusable, const-optimized components; run `flutter test` after each feature.
4. **Test** — widget and integration tests; confirm with `flutter test --coverage`.
5. **Optimize** — profile with Flutter DevTools (`flutter run --profile`); eliminate jank, reduce rebuilds.

## Animation decision guide

| Need | Default approach |
|---|---|
| One property / small state-driven changes | `AnimatedContainer`, `AnimatedOpacity`, `AnimatedAlign`, `AnimatedPadding`, `AnimatedSwitcher`, `TweenAnimationBuilder` |
| Full lifecycle, repeat/reverse, gesture-driven values | `AnimationController` + `Tween` + `CurvedAnimation` + `AnimatedBuilder` or `AnimatedWidget` |
| Shared visual element between routes | `Hero` with stable unique tags and compatible source/destination trees |
| List/menu reveal with offset timings | One controller with `Interval`s; per-item only if lifecycle truly differs |
| Spring / fling / drag / scroll feel | `fling`, `animateWith`, `SpringSimulation`, gesture velocity, platform `ScrollPhysics` |
| Motion feels wrong but code works | Tune duration, curve, interval, easing, or reduced-motion before adding complexity |

## Must do

- Use `const` constructors wherever possible
- Implement proper keys for lists; never use `.indices` for dynamic content
- Use `Consumer` / `ConsumerWidget` for state (not `StatefulWidget` for app-wide state)
- Profile with DevTools and fix jank
- Inspect target widget tree, lifecycle, navigation, and existing animation abstractions BEFORE adding animation logic
- Own animation controllers in the state object; always dispose them
- Respect `MediaQuery.disableAnimations` / reduced-motion policy for non-essential motion
- Run `dart format` and `flutter analyze` on touched files

## Must not do

- Build widgets inside `build()` method
- Mutate state directly (always create new instances)
- Use `setState` for app-wide state
- Skip `const` on static widgets
- Block UI thread with heavy computation (use `compute()`)
- Create `AnimationController` inside `build()` or leave controllers undisposed
- Use global `timeDilation` in production code (debug-only)
- Copy reference snippets blindly without adapting to the project's Flutter version, lint rules, and null-safety

## Troubleshooting

| Symptom | Likely cause | Recovery |
|---|---|---|
| `flutter analyze` errors | Unresolved imports, missing `const`, type mismatches | Fix flagged lines; run `flutter pub get` if imports missing |
| Widget test assertion failures | Widget tree mismatch or async state not settled | Use `tester.pumpAndSettle()`; verify finder selectors |
| Build fails after adding package | Incompatible dependency version | `flutter pub upgrade --major-versions`; check pub.dev compatibility |
| Jank / dropped frames | Expensive `build()`, uncached widgets, heavy main-thread work | `RepaintBoundary`, move work to `compute()`, add `const` |
| Hot reload not reflecting changes | State held in `StateNotifier` not reset | Hot restart (`R` in terminal) |
| Animation hidden state / lifecycle bug | Controller owned by wrong widget or not disposed | Move controller to state object owning the animation; ensure `dispose()` |
