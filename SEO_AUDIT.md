# Technical SEO Audit

## Executive summary

The repository is a Vite 8 + React 19 + React Router 7 single-page application. `react-router.config.ts:3-6` sets `ssr: false`; `src/main.tsx` mounts the app with `createRoot`; and `vercel.json:8-11` rewrites every path to `/index.html`. Public route content is therefore client-rendered and API-backed, while authentication and dashboard routes are private.

Health score: **28/100 before → 56/100 in the repository**. The currently deployed production build scores **18/100** under the same internal rubric because it is serving the pre-fix 846-byte shell. This is an internal, evidence-based score, not a Lighthouse score: 10 audit areas were weighted equally, with partial credit only where repository or live evidence demonstrated coverage. The repository score is capped because public route content is not present in initial HTML and the SPA serves a soft 404. The production score is additionally capped because crawler files and metadata fixes are not deployed.

Top five issues:

1. Public routes are CSR-only and initial HTML contains no route H1/body/links (`react-router.config.ts:3-6`; Googlebot curl output below).
2. `vercel.json:8-11` rewrites unknown paths to the app shell; localhost `/does-not-exist` returned `200`.
3. The confirmed production deployment is stale: it serves the old shell with ETag `"1e19737339a2f21d283255e91f8a9513"`, while the branch build emits a different asset and metadata.
4. The production JS bundle is `815.09 kB` minified (`npm run build` output); Lighthouse/Core Web Vitals are unverified.
5. Lint has 16 pre-existing `no-explicit-any` errors in challenge files; the SEO changes add no lint errors (`npm run lint` output).

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
| `/roadmaps` | Public SEO route | CSR; `listRoadmaps` API query |
| `/challenge`, `/challenges`, `/weeks` | Public challenge/index routes | CSR; challenge API query |
| `/weeks/:id` | Public detail route | CSR; challenge API query |
| `/community` | Public coming-soon route | CSR; static component |
| `/leaderboard` | Public but recommended `noindex` | CSR; challenge API queries |
| `/waitlist` | Public conversion route, `noindex` | CSR; form/API |
| `/login`, `/auth/callback`, `/auth/mfa` | Auth routes; not SEO targets | CSR/auth state |
| `/roadmaps/:id`, `/guidebook/:roadmapId/:topicId` | Private | `RequireAuth`, CSR/API |
| `/challenges/:id`, `/attempts/:id` | Private | `RequireAuth`, CSR/API |
| `/dashboard`, `/admin` | Private | `RequireAuth`/`RequireAdmin`, CSR/API |
| `*` | Not-found UI | CSR; hosting currently returns app shell |

## Findings

| ID | Severity | Area | Issue | Evidence | Impact | Fix | Status | Effort |
|---|---|---|---|---|---|---|---|---|
| SEO-001 | Critical | Rendering | Public routes have no H1, body content, links, route title, description, canonical, or route JSON-LD in initial HTML. | `react-router.config.ts:3-6`; before/after Googlebot curl output | Search engines and AI crawlers may index only the shell. | Move public pages to SSR/SSG/prerendering, including API data strategy. | Needs decision | High |
| SEO-002 | High | Crawl/index | Unknown paths are soft 404s. | `vercel.json:8-11`; localhost `/does-not-exist` → `STATUS 200` before and after | Wastes crawl budget and weakens error handling. | Add server/edge 404 handling or adopt SSR hosting; preserve client fallback for navigation. | Needs decision | Medium |
| SEO-003 | High | Canonical | Production origin is confirmed as `https://designersroom.anviklabs.site`; the branch canonical/sitemap fallback is updated, but live deployment still serves the old build. | `index.html:24`; `scripts/generate-sitemap.mjs:3-4`; live HTML ETag and 846-byte response | Live canonical remains absent until redeploy. | Deploy this branch and verify canonical and sitemap on the live host. | Needs deployment | Low |
| SEO-004 | High | Crawl/index | No robots or sitemap existed before the fix. | Before `/robots.txt` and `/sitemap.xml` returned the SPA shell with `STATUS 200`; no files in `public` | Crawlers lacked explicit crawl guidance and URL discovery. | Added `public/robots.txt`, build-time `public/sitemap.xml`. | Fixed | Low |
| SEO-005 | Medium | Metadata | Only one global title existed; no description, OG/Twitter, or JSON-LD existed before. | Before `index.html:13` only; after `index.html:7-38` | Weak snippets/social previews/entity discovery. | Added global metadata and client route metadata via `src/components/Seo.tsx`. | Fixed, SSR limitation remains | Medium |
| SEO-006 | Medium | Structured data | Organization and WebSite JSON-LD were absent from source before; BreadcrumbList/Article are not present. | Before `rg` found no JSON-LD; after `index.html:32-38`, `src/components/seo-data.ts:1-12` | Reduced entity and content understanding. | Added WebSite initial JSON-LD and Organization/WebSite client JSON-LD on home. | Fixed, server-rendering limitation remains | Low |
| SEO-007 | Medium | Navigation | Footer waitlist navigation used `onClick` + `navigate()` instead of a link. | Before `src/components/Footer.tsx` used `useNavigate`; after `src/components/Footer.tsx:1,36-41` | Less crawlable and less accessible navigation. | Replaced with React Router `Link`. | Fixed | Low |
| SEO-008 | Medium | Performance | Main bundle exceeds Vite’s 500 kB warning threshold. | `npm run build` → JS `815.09 kB`, CSS `75.54 kB`; Vite emitted chunk warning | Potentially slower LCP/INP on mobile. | Code-split route modules and measure with Lighthouse/RUM. | Needs decision | Medium |
| SEO-009 | Low | Images | Logo and decorative roadmap glow lacked intrinsic dimensions. | Before `src/components/Navbar.tsx` logo and `src/pages/RoadmapsPage.tsx` glow had no width/height; after dimensions added | Possible layout shifts and weaker image sizing hints. | Added intrinsic dimensions. | Fixed | Low |
| SEO-010 | Medium | Headers/security | Local preview sends `Cache-Control: no-cache` and no HSTS/X-Robots-Tag; production headers are not locally verifiable. | `curl -sSI http://127.0.0.1:4174/` output below; `vercel.json:1-12` has no headers | Caching/security behavior may be suboptimal in production. | Configure production headers after deployment policy is confirmed. | UNVERIFIED | Medium |
| SEO-011 | Medium | AI readiness | Named AI bots are explicitly allowed in the new robots file, but owner policy was not evidenced. | `public/robots.txt:9-20`; no policy documentation found | May disclose or restrict content contrary to business intent. | Confirm allow/block policy. | Needs decision | Low |
| SEO-012 | Low | Monitoring | No Search Console verification, `web-vitals`, or analytics setup was found. | `rg -n` search over `src`, `public`, `index.html`, `package.json` found none | No evidence of organic monitoring or CWV telemetry. | Add verified ownership and privacy-reviewed monitoring. | Needs decision | Medium |
| SEO-013 | Low | Accessibility overlap | Viewport, language, favicon, alt text for brand logo, and semantic nav are present. | `index.html:2,5-6`; `src/components/Navbar.tsx:61-68,87`; `src/components/Footer.tsx:24-32` | Baseline mobile/a11y coverage is present. | No change needed. | Fixed/verified | Low |
| SEO-014 | Medium | Quality gates | Lint fails on unrelated pre-existing explicit `any` errors. | `npm run lint` → 16 errors in `src/lib/api/challenges.ts`, `src/pages/challenges/ChallengeDetailPage.tsx`, `src/pages/challenges/LeaderboardPage.tsx` | Full lint gate is not green. | Fix separately; excluded to avoid unrelated business-logic changes. | Needs decision | Medium |
| SEO-015 | Critical | Deployment | Production is not running the audited branch. | Live `GET /` and all tested routes returned `846` bytes with only the old title/viewport/favicon; branch build contains metadata and emits a different JS asset. | None of the repository fixes affect rankings until deployed. | Deploy commit `b0c5974` or later, then repeat the live crawl. | Needs deployment | Low |

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
| Build | Passed: Vite emitted `812.85 kB` JS and `75.54 kB` CSS | Passed: Vite emitted `815.09 kB` JS and `75.54 kB` CSS; same >500 kB warning |
| Tests | Not yet run in recon | `npm run test:run`: 3 files, 35 tests passed |
| Typecheck | Not yet run in recon | `npm run typecheck`: passed |
| Lint | Existing challenge errors not yet recorded | Fails with 16 existing `no-explicit-any` errors; no SEO-file errors |
| `/robots.txt` | SPA shell, `STATUS 200` | `STATUS 200`, explicit generic/private rules and named bot rules, Sitemap line |
| `/sitemap.xml` | SPA shell, `STATUS 200` | `STATUS 200`, XML with five configured public routes |
| `/` initial HTML | Global title only | Description, OG/Twitter, canonical, WebSite JSON-LD; still no rendered H1/body because CSR |
| `/roadmaps` initial HTML | Global title only | Same global shell metadata; route-specific metadata exists after hydration |
| `/does-not-exist` | `STATUS 200` SPA shell | `STATUS 200` SPA shell; requires hosting/SSR decision |
| Footer waitlist CTA | `onClick` navigation | Real React Router `Link` |
| Image sizing | Logo/glow dimensions absent | Logo `1985×347`, glow `1140×740` |

## Needs human decision

- Deploy the audited branch; the confirmed production origin is `https://designersroom.anviklabs.site` and the repository fallback/static URLs now use it.
- Choose an SSR/SSG/prerendering strategy for public pages. This is required to satisfy initial-HTML SEO for API-backed route content and JSON-LD.
- Choose a server/edge 404 strategy compatible with the Vercel SPA rewrite.
- Confirm whether GPTBot, ClaudeBot, PerplexityBot, and Google-Extended should be allowed; the current explicit `Allow: /` rules are provisional.
- Consider route-level code splitting and Lighthouse/RUM measurement for the `815.09 kB` JS bundle.
- Fix the 16 pre-existing lint errors in challenge code in a separate change.
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
- Fix the existing lint baseline separately.

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
npm run lint                           failed: 16 pre-existing no-explicit-any errors
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
