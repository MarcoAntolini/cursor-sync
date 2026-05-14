---
name: web-react-performance
description: Optimize web, React, and Next.js performance — Core Web Vitals (LCP, CLS, INP, TBT), critical rendering path, bundle size, waterfall elimination, Suspense streaming, Cache Components (PPR), use cache directive, cacheLife, cacheTag, updateTag, image/font/CSS optimization, third-party scripts, re-render reduction, code splitting, tree shaking, runtime perf. Use for "speed up my site", "optimize performance", "reduce load time", "fix slow loading", "improve page speed", "performance audit", "Lighthouse audit", React/Next.js refactors, bundle analysis, or migration from `unstable_cache` to `use cache`.
---

# Web & React Performance

Three coordinated reference packs covering generic web performance, React/Next.js optimization rules, and Next.js 16 Cache Components.

## When to use

- Lighthouse audits, Core Web Vitals regressions, slow loading
- Writing or reviewing React components and Next.js pages
- Bundle size investigations, code splitting decisions
- Migrating from older Next.js caching primitives (`unstable_cache`, `experimental.ppr`) to Next.js 16+
- Suspense, streaming, server vs client component decisions

## Topic router

| What you're doing | Start here |
|---|---|
| Generic web perf: critical path, CWV, images, fonts, caching headers | [`references/web-perf/overview.md`](references/web-perf/overview.md) |
| React/Next.js: 70 prioritized rules across 8 categories | [`references/vercel-react-rules/index.md`](references/vercel-react-rules/index.md) |
| Next.js 16 Cache Components, `use cache`, PPR | [`references/next-cache-components/overview.md`](references/next-cache-components/overview.md) |

## Pack 1: Generic web performance

See [`references/web-perf/overview.md`](references/web-perf/overview.md). Covers:

- **Performance budget**: page weight < 1.5 MB, JS < 300 KB, CSS < 100 KB, images < 500 KB above fold
- **Critical rendering path**: TTFB < 800ms, Brotli compression, HTTP/2/3, Early Hints (103), preconnect, preload, defer non-critical CSS
- **Resource loading**: Speculation Rules API, View Transitions API, deferred/async scripts
- **Code splitting**: route-based, component-based, feature-based; tree shaking patterns
- **Image optimization**: AVIF/WebP, responsive `srcset`/`sizes`, LCP priority, lazy-loading below fold
- **Font optimization**: `font-display: swap`, preloading, variable fonts, unicode-range subsetting
- **Caching strategy**: `Cache-Control` immutable, service worker patterns
- **Runtime performance**: avoid layout thrashing, debounce, `requestAnimationFrame`, virtualize long lists with `content-visibility`
- **Third-party scripts**: async, IntersectionObserver-delayed loading, facade pattern

Key targets: LCP < 2.5s, FCP < 1.8s, TBT < 200ms, TTI < 3.8s.

## Pack 2: React & Next.js rules (70 prioritized)

Browse the index at [`references/vercel-react-rules/index.md`](references/vercel-react-rules/index.md). Each individual rule file (`async-parallel.md`, `bundle-barrel-imports.md`, etc.) contains explanation + incorrect/correct code examples.

Rules are organized by impact:

| Priority | Category | Prefix | Impact |
|---|---|---|---|
| 1 | Eliminating waterfalls | `async-` | CRITICAL |
| 2 | Bundle size | `bundle-` | CRITICAL |
| 3 | Server-side perf | `server-` | HIGH |
| 4 | Client-side data fetching | `client-` | MEDIUM-HIGH |
| 5 | Re-render optimization | `rerender-` | MEDIUM |
| 6 | Rendering performance | `rendering-` | MEDIUM |
| 7 | JavaScript performance | `js-` | LOW-MEDIUM |
| 8 | Advanced patterns | `advanced-` | LOW |

Critical rules to know:

- **`async-parallel`**: use `Promise.all()` for independent operations
- **`async-suspense-boundaries`**: stream content with `<Suspense>`
- **`bundle-barrel-imports`**: import directly, avoid barrel files
- **`bundle-dynamic-imports`**: use `next/dynamic` for heavy components
- **`server-cache-react`**: use `React.cache()` for per-request deduplication
- **`server-parallel-fetching`**: restructure components to parallelize fetches
- **`rerender-derived-state-no-effect`**: derive state during render, not in `useEffect`

## Pack 3: Next.js 16 Cache Components (PPR)

See [`references/next-cache-components/overview.md`](references/next-cache-components/overview.md). Covers:

- **Enabling**: `cacheComponents: true` in `next.config.ts` (replaces `experimental.ppr`)
- **Three content types**: Static (auto-prerendered) / Cached (`use cache`) / Dynamic (Suspense)
- **`use cache` directive**: file-level, component-level, function-level
- **Cache profiles**: `default`, `remote`, `private`; `cacheLife('hours' | 'minutes' | 'days' | 'weeks' | 'max')`; inline `{ stale, revalidate, expire }`
- **Tags**: `cacheTag('products', \`product-\${id}\`)`
- **Invalidation**: `updateTag()` (immediate, same-request) vs `revalidateTag()` (background SWR)
- **Runtime data constraint**: cannot use `cookies()`/`headers()` inside `use cache` — pass as arguments OR use `'use cache: private'`
- **Cache key generation**: build ID + function ID + serializable args + closure variables
- **Migration table** from `experimental.ppr`, `dynamic = 'force-*'`, `revalidate = N`, `unstable_cache` to the new directive

## Combined workflow

For a performance audit, work the layers in order:

1. **Measure**: Lighthouse, `web-vitals` library, CrUX. Capture baseline LCP / INP / CLS / TTI / bundle size.
2. **Critical path** (Pack 1): TTFB, compression, preconnect/preload, defer CSS, hero image priority, font strategy.
3. **React/Next architecture** (Pack 2): eliminate waterfalls (`async-*`), shrink bundles (`bundle-*`), parallel server fetches (`server-*`).
4. **Cache strategy** (Pack 3, Next.js 16+): convert hot paths to `use cache` with appropriate `cacheLife` and `cacheTag`; wrap genuinely dynamic content in `<Suspense>`.
5. **Re-renders & runtime** (Pack 2 + Pack 1): `rerender-*` rules; debounce/throttle; virtualize long lists.
6. **Re-measure**: confirm improvement on the same metrics. Revert if no win.

## Quick decision: cache or not?

```
Data origin?
├─ Static (constants, build-time) → no decoration needed, auto-prerendered
├─ Database / API, same for all users → 'use cache' + cacheLife + cacheTag
├─ Per-user, can tolerate seconds of staleness → 'use cache' with userId as arg
├─ Per-user, must be fresh per request → Suspense + dynamic component (no caching)
└─ Per-user with compliance constraints → 'use cache: private'
```
