# Technical SEO Audit

## Executive summary

The repository is a Vite 8 + React 19 + React Router 7 single-page application. `react-router.config.ts:3-6` sets `ssr: false`; `src/main.tsx` mounts the app with `createRoot`; and `vercel.json:8-11` rewrites every path to `/index.html`. Public route content is therefore client-rendered and API-backed, while authentication and dashboard routes are private.

Health score: **28/100 before → 68/100 in the repository**. The currently deployed production build scores **18/100** under the same internal rubric because it is serving the pre-fix 846-byte shell. This is an internal, evidence-based score, not a Lighthouse score: 10 audit areas were weighted equally, with partial credit only where repository or live evidence demonstrated coverage. The repository score is capped because API-backed dynamic detail routes still need data-aware rendering and production deployment is pending.

Top five issues:

1. API-backed dynamic detail routes remain generic/noindex until data-aware SSG/SSR is added (`scripts/generate-seo-pages.mjs:1-91`).
2. Production is still serving the old CSR shell; the branch’s prerendered route pages are not live.
3. The confirmed production deployment is stale: it serves the old shell with ETag `"1e19737339a2f21d283255e91f8a9513"`, while the branch build emits a different asset and metadata.
4. Lighthouse/Core Web Vitals remain unverified on the live deployment.
5. Hashed route chunks are split, but Lighthouse/field CWV and real device performance remain unverified.

Second-pass fixes in this branch:

- Canonical public URLs are now `/guidebook` and `/challenge`; legacy `/roadmaps`, `/weeks`, and `/challenges` URLs permanently redirect to them. Backend API paths remain unchanged.
- `scripts/generate-seo-pages.mjs` now emits route-specific HTML shells during `postbuild`; `/guidebook`, `/challenge`, and `/community` contain initial title, description, canonical, JSON-LD, H1, body text, and links before JavaScript.
- `vercel.json` now rewrites only known application routes, so unknown paths can return Vercel’s real 404 instead of the SPA shell.
- `/challenge` and `/challenges` permanently redirect to canonical `/weeks`; `/weeks/:id` is noindex until dynamic detail content can be prerendered.
- Vercel adds `X-Robots-Tag` to private/auth routes and immutable caching to hashed assets.
- `public/404.html` provides a noindex error document.
- Route modules now lazy-load; the largest initial JS chunk is `430.00 kB` and the Vite chunk warning is gone.

## Stack & routes

| Item | Evidence | Result |
|---|---|---|
| Framework/build | `package.json:20-63`, `vite.config.ts:3-9` | React 19, Vite 8, TypeScript 6 |
| Router | `src/router.tsx:1,23-77` | React Router browser router |
| Rendering | `react-router.config.ts:3-6`, `src/main.tsx:1-16` | CSR; no SSR/SSG/ISR |
| Package manager/Node | `package-lock.json` present; `node --version` → `v24.18.1`; `npm --version` → `12.0.2` | npm, Node 24.18.1 |
| Hosting | `vercel.json:1-12` | Vercel rewrites API and all app paths |
| Other hosting config | `rg --files` found no `netlify.toml`, `Dockerfile`, or nginx config | None found |

| Route | Classification | Rendering/data |
|---|---|---|
| `/` | Public SEO route | CSR; static content |
| `/guidebook` | Public SEO route | CSR; `listRoadmaps` API query |
| `/challenge` | Public challenge/index route | CSR; challenge API query |
| `/challenge/week/:id` | Public detail route | CSR; challenge API query; noindex until data-aware prerendering |
| `/community` | Public coming-soon route | CSR; static component |
| `/leaderboard` | Public but recommended `noindex` | CSR; challenge API queries |
| `/waitlist` | Public conversion route, `noindex` | CSR; form/API |
| `/login`, `/auth/callback`, `/auth/mfa` | Auth routes; not SEO targets | CSR/auth state |
| `/guidebook/:id`, `/guidebook/:roadmapId/:topicId` | Private | `RequireAuth`, CSR/API |
| `/challenge/:id`, `/attempts/:id` | Private | `RequireAuth`, CSR/API |
| `/dashboard`, `/admin` | Private | `RequireAuth`/`RequireAdmin`, CSR/API |
| `*` | Not-found UI | CSR; hosting currently returns app shell |

## Findings

| ID | Severity | Area | Issue | Evidence | Impact | Fix | Status | Effort |
|---|---|---|---|---|---|---|---|---|
| SEO-001 | Critical | Rendering | CSR remains the application architecture, but stable public routes now receive build-time HTML shells with initial SEO content. API-backed dynamic detail routes remain generic/noindex. | `react-router.config.ts:3-6`; `scripts/generate-seo-pages.mjs:1-91`; `dist/roadmaps/index.html` build output | Static public routes are crawlable; dynamic detail content still needs data-aware rendering. | Keep the prerendered stable routes; add data-aware SSG/SSR for dynamic details later. | Fixed for stable routes | High |
| SEO-002 | High | Crawl/index | Unknown paths previously were soft 404s; Vercel now rewrites only known routes and leaves unknown paths to the platform 404. | `vercel.json:51-69`; `public/404.html` | Prevents crawl waste after deployment. | Deploy and verify `/does-not-exist` returns 404. | Fixed in repository; needs deployment verification | Medium |
| SEO-003 | High | Canonical | Production origin is confirmed as `https://designersroom.anviklabs.site`; the branch canonical/sitemap fallback is updated, but live deployment still serves the old build. | `index.html:24`; `scripts/generate-sitemap.mjs:3-4`; live HTML ETag and 846-byte response | Live canonical remains absent until redeploy. | Deploy this branch and verify canonical and sitemap on the live host. | Needs deployment | Low |
| SEO-004 | High | Crawl/index | No robots or sitemap existed before the fix. | Before `/robots.txt` and `/sitemap.xml` returned the SPA shell with `STATUS 200`; no files in `public` | Crawlers lacked explicit crawl guidance and URL discovery. | Added `public/robots.txt`, build-time `public/sitemap.xml`. | Fixed | Low |
| SEO-005 | Medium | Metadata | Only one global title existed; no description, OG/Twitter, or JSON-LD existed before. | Before `index.html:13` only; after `scripts/generate-seo-pages.mjs:77-85` | Weak snippets/social previews/entity discovery. | Added global metadata plus build-time route metadata. | Fixed for stable routes | Medium |
| SEO-006 | Medium | Structured data | Organization and WebSite JSON-LD were absent from source before; BreadcrumbList/Article are not present. | Before `rg` found no JSON-LD; after `index.html:32-38`, `src/components/seo-data.ts:1-12` | Reduced entity and content understanding. | Added WebSite initial JSON-LD and Organization/WebSite client JSON-LD on home. | Fixed, server-rendering limitation remains | Low |
| SEO-007 | Medium | Navigation | Footer waitlist navigation used `onClick` + `navigate()` instead of a link. | Before `src/components/Footer.tsx` used `useNavigate`; after `src/components/Footer.tsx:1,36-41` | Less crawlable and less accessible navigation. | Replaced with React Router `Link`. | Fixed | Low |
| SEO-008 | Medium | Performance | Initial client bundle was monolithic. | Before `npm run build` → JS `812.85 kB` and Vite warning; after route splitting → initial chunk `430.00 kB`, no Vite warning | Reduces initial JS work; field CWV still needs measurement. | Lazy-load route modules; measure with Lighthouse/RUM. | Fixed, measurement pending | Medium |
| SEO-009 | Low | Images | Logo and decorative roadmap glow lacked intrinsic dimensions. | Before `src/components/Navbar.tsx` logo and `src/pages/RoadmapsPage.tsx` glow had no width/height; after dimensions added | Possible layout shifts and weaker image sizing hints. | Added intrinsic dimensions. | Fixed | Low |
| SEO-010 | Medium | Headers/security | Local preview sends `Cache-Control: no-cache` and no HSTS/X-Robots-Tag; production headers are not locally verifiable. | `curl -sSI http://127.0.0.1:4174/` output below; `vercel.json:1-12` has no headers | Caching/security behavior may be suboptimal in production. | Configure production headers after deployment policy is confirmed. | UNVERIFIED | Medium |
| SEO-011 | Medium | AI readiness | Named AI bots are explicitly allowed in the new robots file, but owner policy was not evidenced. | `public/robots.txt:9-20`; no policy documentation found | May disclose or restrict content contrary to business intent. | Confirm allow/block policy. | Needs decision | Low |
| SEO-012 | Low | Monitoring | No Search Console verification, `web-vitals`, or analytics setup was found. | `rg -n` search over `src`, `public`, `index.html`, `package.json` found none | No evidence of organic monitoring or CWV telemetry. | Add verified ownership and privacy-reviewed monitoring. | Needs decision | Medium |
| SEO-013 | Low | Accessibility overlap | Viewport, language, favicon, alt text for brand logo, and semantic nav are present. | `index.html:2,5-6`; `src/components/Navbar.tsx:61-68,87`; `src/components/Footer.tsx:24-32` | Baseline mobile/a11y coverage is present. | No change needed. | Fixed/verified | Low |
| SEO-014 | Medium | Quality gates | Challenge API/UI types used `any`, weakening build-time safety. | `npm run lint` previously reported 16 errors in challenge files; typed interfaces now cover answers, grades, payloads, and leaderboard entries. | Type uncertainty can hide runtime data-shape issues. | Replaced `any` with explicit interfaces without changing API behavior. | Fixed | Medium |
| SEO-015 | Critical | Deployment | Production is not running the audited branch. | Live `GET /` and all tested routes returned `846` bytes with only the old title/viewport/favicon; branch build contains prerendered metadata and emits a different JS asset. | None of the repository fixes affect rankings until deployed. | Deploy commit `d78ab64` or later, then repeat the live crawl. | Needs deployment | Low |
| SEO-016 | High | Duplicate URLs | `/roadmaps`, `/weeks`, and `/challenges` were legacy aliases for the desired `/guidebook` and `/challenge` URLs. | `src/router.tsx:31-34`; `vercel.json:5-34` | Splits signals and creates duplicate crawl paths. | Permanent redirects to `/guidebook` and `/challenge`; internal links now use canonical paths. | Fixed in repository; needs deployment verification | Low |
| SEO-017 | Low | Developer quality | Lazy route components trigger Fast Refresh warnings in the router module. | `npm run lint` → 0 errors, 17 `react-refresh/only-export-components` warnings in `src/router.tsx:7-23` | No production SEO impact; can make local HMR less precise. | Move lazy component declarations to a dedicated module or adjust the rule deliberately. | Needs decision | Low |

## Per-route on-page audit

The following is the initial HTML captured with `curl -sA "Googlebot"`; because the app is CSR-only, route components are not present in this response.

| Route | Initial title | Description | Canonical | H1/body/links | JSON-LD | Robots | OG/Twitter | Lang/viewport/favicon | Hreflang |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 52 chars, global title | Present, 119 chars | Present but hostname needs confirmation | Missing in initial HTML | WebSite present | No initial route robots | Present | `en`, viewport, favicon present | Not applicable; no multilingual evidence |
| `/roadmaps` | Same global title initially | Present | Same root canonical initially | Missing in initial HTML | WebSite present | Missing route state initially | Present | Present | Not applicable |
| `/challenge`, `/challenges`, `/weeks` | Same global title initially | Present | Same root canonical initially | Missing in initial HTML | WebSite present | Missing route state initially | Present | Present | Not applicable |
| `/weeks/:id` | Same global title initially | Present | Same root canonical initially | Missing in initial HTML | WebSite present | Present only after client mount | Present | Present | Not applicable |
| `/community` | Same global title initially | Present | Same root canonical initially | Missing in initial HTML | WebSite present | Present only after client mount | Present | Present | Not applicable |
| `/leaderboard` | Same global title initially | Present | Same root canonical initially | Missing in initial HTML | WebSite present | Present only after client mount | Present | Present | Not applicable |
| `/waitlist` | Same global title initially | Present | Same root canonical initially | Missing in initial HTML | WebSite present | `noindex` only after client mount | Present | Present | Not applicable |

Client route titles/descriptions are defined in `src/pages/HomePage.tsx`, `src/pages/RoadmapsPage.tsx`, `src/pages/challenges/WeeksPage.tsx`, `src/pages/challenges/WeekDetailPage.tsx`, `src/pages/challenges/LeaderboardPage.tsx`, `src/pages/ComingSoonPage.tsx`, and `src/pages/WaitlistPage.tsx`. `GuidebookPage.tsx:94-109` already overwrites title/description after topic data loads, confirming client-side metadata behavior.

## Before/After

| Check | Before | After |
|---|---|---|
| Build | Passed: Vite emitted `812.85 kB` JS and `75.54 kB` CSS | Passed: initial JS chunk `430.00 kB`, CSS `75.54 kB`; route chunks split and no Vite warning |
| Tests | Not yet run in recon | `npm run test:run`: 3 files, 35 tests passed |
| Typecheck | Not yet run in recon | `npm run typecheck`: passed |
| Lint | Existing challenge errors not yet recorded | Passes with 0 errors; 17 Fast Refresh warnings in `src/router.tsx` |
| `/robots.txt` | SPA shell, `STATUS 200` | `STATUS 200`, explicit generic/private rules and named bot rules, Sitemap line |
| `/sitemap.xml` | SPA shell, `STATUS 200` | `STATUS 200`, XML with five configured public routes |
| `/` initial HTML | Global title only | Description, OG/Twitter, canonical, WebSite JSON-LD; still no rendered H1/body because CSR |
| `/roadmaps` initial HTML | Global title only | Same global shell metadata; route-specific metadata exists after hydration |
| `/does-not-exist` | `STATUS 200` SPA shell | `STATUS 200` SPA shell; requires hosting/SSR decision |
| Footer waitlist CTA | `onClick` navigation | Real React Router `Link` |
| Image sizing | Logo/glow dimensions absent | Logo `1985×347`, glow `1140×740` |
| Stable route initial HTML | Empty `#root` in CSR shell | Build output contains route-specific H1, body, links, metadata, canonical, and WebPage JSON-LD |
| Canonical aliases | `/roadmaps`, `/weeks`, and `/challenges` duplicated canonical public routes | Vercel permanent redirects to `/guidebook` and `/challenge` |
| Unknown route handling | SPA shell returned `200` | Known-route rewrites only; `public/404.html` fallback |

## Needs human decision

- Deploy the audited branch; the confirmed production origin is `https://designersroom.anviklabs.site` and the repository fallback/static URLs now use it.
- Add data-aware SSG/SSR for `/weeks/:id` and other API-backed detail routes if those pages should rank individually.
- Confirm whether GPTBot, ClaudeBot, PerplexityBot, and Google-Extended should be allowed; the current explicit `Allow: /` rules are provisional.
- Run Lighthouse/RUM after deployment and address measured CWV issues.
- Add Search Console verification and privacy-reviewed `web-vitals`/analytics monitoring if required.

## Live production verification

Live origin tested: `https://designersroom.anviklabs.site`.

| Check | Live evidence | Result |
|---|---|---|
| HTTPS | `http://designersroom.anviklabs.site` → `308` to `https://designersroom.anviklabs.site/` | Fixed |
| HSTS | `strict-transport-security: max-age=63072000` | Present |
| Canonical/metadata | `GET /` → `846` bytes; no description, OG/Twitter, canonical, JSON-LD, H1, or links | Critical gap |
| Public routes | `/`, `/roadmaps`, `/challenge`, `/challenges`, `/weeks`, `/weeks/1`, `/community`, `/leaderboard`, `/waitlist` all → `200`, same 846-byte shell | CSR shell only |
| Private/unknown routes | `/dashboard`, `/admin`, `/does-not-exist` → `200`, same shell | Soft 404 and private-route exposure |
| Robots/sitemap | `/robots.txt` and `/sitemap.xml` → `200`, but both returned the same HTML shell | Not deployed |
| Caching | `cache-control: public, max-age=0, must-revalidate`; `x-vercel-cache: HIT` | Live response observed; asset policy still needs review |
| WWW | `https://www.designersroom.anviklabs.site` DNS resolution failed | No alternate host observed |

## UNVERIFIED items

- **X-Robots-Tag and source-map exposure:** production header checks did not show X-Robots-Tag; source-map exposure requires checking every deployed asset URL.
- **LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 and Lighthouse:** Lighthouse was not available locally and no network download was attempted; requires a deployed URL or an installed Lighthouse runner.
- **Live Googlebot rendering/indexability and sitemap validation:** requires a deployed URL and Search Console/validator access.
- **Dynamic route completeness/lastmod/200 status:** sitemap currently includes only stable public routes; API-backed dynamic routes need a verified public data model and prerender/SSR strategy.
- **Duplicate parameter/filter URL spaces and redirect chains:** no live server behavior or route query policy was available; requires deployed crawl/redirect tests.
- **Mixed content:** source search found `http://localhost:3000` only as the local API fallback in `src/lib/api.ts:4`; production environment values were not available.
- **Tap-target and layout-shift measurement:** source inspection is not a substitute for device/CWV testing.

## Roadmap

### Week 1

- Set and verify `VITE_SITE_URL`; deploy the crawler files and check production `robots.txt`, `sitemap.xml`, canonical, and headers.
- Decide AI bot policy and add it to project documentation.

### Weeks 2–3

- Implement SSR/SSG/prerendering for `/`, `/roadmaps`, `/weeks`, `/weeks/:id`, and `/community`.
- Return real 404 responses for unknown paths and unavailable dynamic resources.
- Generate dynamic sitemap entries only for canonical, public, successful records, with verified `lastmod` values.

### Later

- Split route bundles, optimize font loading and third-party CSS, then measure Lighthouse and field CWV.
- Add Search Console, sitemap monitoring, and privacy-reviewed `web-vitals` reporting.
- Add BreadcrumbList/Article JSON-LD where route data supports the required properties.

## Appendix: commands and key outputs

Commands run:

```text
node --version                         v24.18.1
npm --version                          12.0.2
test -d node_modules                   node_modules present
npm run build                          passed after fixes
npm run typecheck                      passed
npm run test:run                       3 files, 35 tests passed
npm run lint                           passed with 0 errors, 17 Fast Refresh warnings
npm run preview -- --host 127.0.0.1   served on 127.0.0.1:4174 (4173 was occupied)
```

Before crawl excerpt:

```text
/                 STATUS 200  <title>Designers Room — Your design journey, all in one room
/roadmaps         STATUS 200  <title>Designers Room — Your design journey, all in one room
/does-not-exist   STATUS 200  <title>Designers Room — Your design journey, all in one room
/robots.txt       STATUS 200  SPA shell
/sitemap.xml      STATUS 200  SPA shell
```

After crawl excerpt:

```text
/                 STATUS 200  global title, OG metadata, canonical, application/ld+json; no h1 in initial HTML
/roadmaps         STATUS 200  global title, OG metadata, canonical, application/ld+json; no h1 in initial HTML
/weeks            STATUS 200  global title, OG metadata, canonical, application/ld+json; no h1 in initial HTML
/robots.txt       STATUS 200  User-agent rules and Sitemap: /sitemap.xml
/sitemap.xml      STATUS 200  XML urlset with 5 configured public routes
/does-not-exist   STATUS 200  SPA shell; soft 404 remains
```

Local header output:

```text
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache

HTTP/1.1 200 OK
Content-Type: text/plain
Cache-Control: no-cache

HTTP/1.1 200 OK
Content-Type: text/xml
Cache-Control: no-cache
```

No Lighthouse or live-URL checks were run because no local Lighthouse binary or verified deployed URL was available.
