---
name: react-native-expo
description: Build, optimize, and ship React Native + Expo apps. Covers Expo Router (NativeTabs, Stack, Sheets, Link previews, modals), Reanimated motion, native iOS controls, SF Symbols, blur/liquid glass, camera/audio/video, SQLite/AsyncStorage, search bars, headers, gradients, WebGPU/Three.js, Apple Zoom transitions, plus performance optimization (FPS, TTI, bundle size, memory leaks, re-renders, Hermes, FlashList, Turbo Modules, native profiling) and Tailwind v4 setup via NativeWind v5 + react-native-css. Use when working with React Native, Expo, expo-router, NativeWind/Tailwind, Reanimated, FlashList, Hermes, Turbo Modules, or debugging jank, slow startup, large bundles, memory issues on mobile.
---

# React Native + Expo

Three coordinated reference packs.

## When to use

- Building native UI with Expo Router patterns
- Performance work: FPS, re-renders, TTI, bundle size, memory, animations
- Setting up Tailwind CSS v4 with NativeWind v5 + react-native-css

## Topic router

| Need | Reference |
|---|---|
| Expo Router conventions, routes, NativeTabs | [`references/expo-ui/route-structure.md`](references/expo-ui/route-structure.md), [`references/expo-ui/tabs.md`](references/expo-ui/tabs.md) |
| Animations (Reanimated entering/exiting/layout/scroll) | [`references/expo-ui/animations.md`](references/expo-ui/animations.md) |
| Native iOS controls (Switch, Slider, SegmentedControl, DateTimePicker, Picker) | [`references/expo-ui/controls.md`](references/expo-ui/controls.md) |
| Form sheets in expo-router | [`references/expo-ui/form-sheet.md`](references/expo-ui/form-sheet.md) |
| CSS gradients via `experimental_backgroundImage` | [`references/expo-ui/gradients.md`](references/expo-ui/gradients.md) |
| SF Symbols via `expo-image` (`source="sf:name"`) | [`references/expo-ui/icons.md`](references/expo-ui/icons.md) |
| Camera, audio, video, file saving | [`references/expo-ui/media.md`](references/expo-ui/media.md) |
| Search bar with `headerSearchBarOptions`, `useSearch` | [`references/expo-ui/search.md`](references/expo-ui/search.md) |
| Storage (SQLite, AsyncStorage, SecureStore) | [`references/expo-ui/storage.md`](references/expo-ui/storage.md) |
| Stack headers and toolbar buttons | [`references/expo-ui/toolbar-and-headers.md`](references/expo-ui/toolbar-and-headers.md) |
| Blur (`expo-blur`) and liquid glass (`expo-glass-effect`) | [`references/expo-ui/visual-effects.md`](references/expo-ui/visual-effects.md) |
| 3D graphics, games, GPU visualizations | [`references/expo-ui/webgpu-three.md`](references/expo-ui/webgpu-three.md) |
| Apple Zoom transitions (`Link.AppleZoom`) | [`references/expo-ui/zoom-transitions.md`](references/expo-ui/zoom-transitions.md) |
| Full Expo UI overview / code style | [`references/expo-ui/overview.md`](references/expo-ui/overview.md) |
| Tailwind v4 + NativeWind v5 + react-native-css setup | [`references/tailwind-setup/overview.md`](references/tailwind-setup/overview.md) |
| RN performance overview / problem-to-skill mapping | [`references/rn-perf/overview.md`](references/rn-perf/overview.md) |

## Performance: prefix conventions

| Prefix | Topic |
|---|---|
| `js-*` | JavaScript / React (FlatList/FlashList, re-renders, FPS, atomic state, concurrent React, React Compiler, memory leaks, Reanimated, BottomSheet, TextInput) |
| `native-*` | Native iOS/Android (Turbo Modules, threading, profiling, memory patterns, view flattening, 16KB alignment) |
| `bundle-*` | Bundling (barrel exports, tree shaking, R8, Hermes mmap, native assets, library size, code splitting) |

### Problem → reference

| Problem | Start with |
|---|---|
| App feels slow / janky | [`rn-perf/js-measure-fps.md`](references/rn-perf/js-measure-fps.md) → [`rn-perf/js-profile-react.md`](references/rn-perf/js-profile-react.md) |
| Too many re-renders | [`rn-perf/js-profile-react.md`](references/rn-perf/js-profile-react.md) → [`rn-perf/js-react-compiler.md`](references/rn-perf/js-react-compiler.md) |
| Slow startup (TTI) | [`rn-perf/native-measure-tti.md`](references/rn-perf/native-measure-tti.md) → [`rn-perf/bundle-analyze-js.md`](references/rn-perf/bundle-analyze-js.md) |
| Large app size | [`rn-perf/bundle-analyze-app.md`](references/rn-perf/bundle-analyze-app.md) → [`rn-perf/bundle-r8-android.md`](references/rn-perf/bundle-r8-android.md) |
| Memory growing | [`rn-perf/js-memory-leaks.md`](references/rn-perf/js-memory-leaks.md) or [`rn-perf/native-memory-leaks.md`](references/rn-perf/native-memory-leaks.md) |
| Animation drops frames | [`rn-perf/js-animations-reanimated.md`](references/rn-perf/js-animations-reanimated.md) |
| List scroll jank | [`rn-perf/js-lists-flatlist-flashlist.md`](references/rn-perf/js-lists-flatlist-flashlist.md) |
| TextInput lag | [`rn-perf/js-uncontrolled-components.md`](references/rn-perf/js-uncontrolled-components.md) |
| Native module slow | [`rn-perf/native-turbo-modules.md`](references/rn-perf/native-turbo-modules.md) → [`rn-perf/native-threading-model.md`](references/rn-perf/native-threading-model.md) |
| Native library alignment for Google Play | [`rn-perf/native-android-16kb-alignment.md`](references/rn-perf/native-android-16kb-alignment.md) |

### Optimization workflow

**Measure → Optimize → Re-measure → Validate.** Capture baseline (FPS, TTI, bundle size). Apply one targeted fix. Re-measure same metric. Revert if no improvement.

## Running an Expo app

**Always try Expo Go first.** Run `npx expo start`, scan QR with Expo Go. Test thoroughly there.

Only create custom builds (`npx expo run:ios/android` / `eas build`) when using:

- Local Expo modules (custom native code in `modules/`)
- Apple targets (widgets, app clips, extensions via `@bacons/apple-targets`)
- Third-party native modules not in Expo Go
- Custom native config that can't live in `app.json`

## Library preferences (must follow)

- Never use removed RN modules: `Picker`, `WebView`, `SafeAreaView`, `AsyncStorage` (use community/native alternatives)
- Never use legacy `expo-permissions`
- `expo-audio` not `expo-av`
- `expo-video` not `expo-av`
- `expo-image` with `source="sf:name"` for SF Symbols (not `expo-symbols` or `@expo/vector-icons`)
- `react-native-safe-area-context` not RN `SafeAreaView`
- `process.env.EXPO_OS` not `Platform.OS`
- `React.use` not `React.useContext`
- `expo-image` `<Image>` instead of intrinsic `<img>`
- `expo-glass-effect` for liquid glass backdrops

## Code style

- File names: kebab-case (`comment-card.tsx`)
- Always use import statements at the top
- Always remove old route files when restructuring navigation
- Configure `tsconfig.json` path aliases; prefer aliases over relative imports for refactors
- Routes belong in the `app/` directory; never co-locate components/types/utilities there
- Ensure the app has a "/" route (may be inside a group route)

## Styling rules

- Prefer flex `gap` over margin and padding
- Prefer padding over margin where possible
- Always account for safe area (Stack headers, NativeTabs, or `contentInsetAdjustmentBehavior="automatic"`)
- Inline styles, not `StyleSheet.create`, unless reusing styles is faster
- Add entering and exiting animations for state changes
- Use `{ borderCurve: 'continuous' }` for rounded corners (not capsule shapes)
- Use Stack navigation title, not custom text on the page
- When padding a `ScrollView`, use `contentContainerStyle` padding/gap (not padding on the `ScrollView` itself)
- CSS and Tailwind are not natively supported on RN — use inline styles, OR set up NativeWind v5 (see Tailwind setup pack)
- Use CSS `boxShadow` style prop, never legacy `shadow*`/`elevation`

## Critical pre-flight checks before suggesting fixes

- **Check library versions before suggesting API fixes.** Example: FlashList v2 deprecates `estimatedItemSize`.
- Do not suggest `useMemo` / `useCallback` dependency changes unless profiling shows wasted work tied to that value.
- Do not report stale closures speculatively; show the stale read path, a repro, or profiler evidence.
- Measure the actual interaction; component tree depth or component count are NOT proof of a perf problem.
