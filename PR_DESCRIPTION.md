# Technical SEO audit and safe fixes

## Summary

This change audits the Vite/React Router CSR app and applies low-risk technical SEO improvements without changing visual design, business logic, auth, APIs, or dependencies.

## Changes by area

- **Crawler controls:** add `public/robots.txt`; generate `public/sitemap.xml` during `prebuild` from `VITE_SITE_URL`, Vercel deployment variables, or the documented fallback.
- **Metadata:** add description, canonical, Open Graph, Twitter, and initial WebSite JSON-LD to `index.html`; add client route titles/descriptions/robots/canonicals/social metadata through `src/components/Seo.tsx`.
- **Structured data:** add Organization and WebSite data for the home route after hydration.
- **Crawlable navigation:** replace the footer waitlist `onClick` navigation with a real React Router `Link`.
- **Layout stability:** add intrinsic dimensions to the brand logo and decorative roadmap glow.
- **Initial HTML:** generate route-specific SEO shells after Vite build, including H1, body text, links, metadata, canonical, and WebPage JSON-LD.
- **Routing/index control:** restrict Vercel rewrites to known routes, add a static 404, redirect duplicate challenge aliases, add private-route `X-Robots-Tag`, and cache hashed assets immutably.
- **Performance:** lazy-load route modules; the initial JS chunk is now `430.00 kB` instead of a monolithic `812.85 kB` bundle.

## Before/after

- Before: no crawler files; after: both endpoints return `200` locally with crawler content.
- Before: global title only in initial HTML; after: description, social metadata, canonical, and WebSite JSON-LD are present in the app shell.
- Before: footer waitlist CTA used imperative navigation; after: it is a real link.
- Before: logo/glow had no intrinsic dimensions; after: both have width/height attributes.
- Before: every path rewrote to the SPA shell; after: known routes are rewritten explicitly and unknown paths can reach a real 404.
- Before: `/challenge` and `/challenges` duplicated `/weeks`; after: both permanently redirect to `/weeks`.
- Unchanged: public initial HTML is still CSR-only and unknown paths still soft-404. The confirmed production hostname is `https://designersroom.anviklabs.site`, but the live deployment has not picked up this branch.

## Risk notes

- `VITE_SITE_URL` may still be set explicitly in deployment configuration; repository fallback and static URLs now use `https://designersroom.anviklabs.site`.
- The live deployment currently serves the old 846-byte shell; deploy commit `d78ab64` or later.
- Dynamic API-backed detail routes are intentionally noindex until they have data-aware prerendering.
- Lint has 0 errors; it reports 17 Fast Refresh warnings for lazy route declarations.
- SSR/SSG and Vercel 404 changes are intentionally not included because they require architectural/hosting decisions.
- Named AI bot rules currently allow crawling; confirm that policy before production launch.
- No new dependencies were added.

## How to test

```text
npm run build
npm run typecheck
npm run test:run
npm run lint
npm run preview -- --host 127.0.0.1 --port 4174
curl -sA "Googlebot" http://127.0.0.1:4174/
curl -sS http://127.0.0.1:4174/robots.txt
curl -sS http://127.0.0.1:4174/sitemap.xml
```

Expected: build, typecheck, 35 tests, and lint pass. Full evidence and the decision list are in `SEO_AUDIT.md`.
