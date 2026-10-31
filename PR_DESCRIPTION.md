# Technical SEO audit and safe fixes

## Summary

This change audits the Vite/React Router CSR app and applies low-risk technical SEO improvements without changing visual design, business logic, auth, APIs, or dependencies.

## Changes by area

- **Crawler controls:** add `public/robots.txt`; generate `public/sitemap.xml` during `prebuild` from `VITE_SITE_URL`, Vercel deployment variables, or the documented fallback.
- **Metadata:** add description, canonical, Open Graph, Twitter, and initial WebSite JSON-LD to `index.html`; add client route titles/descriptions/robots/canonicals/social metadata through `src/components/Seo.tsx`.
- **Structured data:** add Organization and WebSite data for the home route after hydration.
- **Crawlable navigation:** replace the footer waitlist `onClick` navigation with a real React Router `Link`.
- **Layout stability:** add intrinsic dimensions to the brand logo and decorative roadmap glow.

## Before/after

- Before: no crawler files; after: both endpoints return `200` locally with crawler content.
- Before: global title only in initial HTML; after: description, social metadata, canonical, and WebSite JSON-LD are present in the app shell.
- Before: footer waitlist CTA used imperative navigation; after: it is a real link.
- Before: logo/glow had no intrinsic dimensions; after: both have width/height attributes.
- Unchanged: public initial HTML is still CSR-only and unknown paths still soft-404. The confirmed production hostname is `https://designersroom.anviklabs.site`, but the live deployment has not picked up this branch.

## Risk notes

- `VITE_SITE_URL` may still be set explicitly in deployment configuration; repository fallback and static URLs now use `https://designersroom.anviklabs.site`.
- The live deployment currently serves the old 846-byte shell; deploy commit `b0c5974` or later.
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

Expected: build, typecheck, and 35 tests pass. `npm run lint` remains blocked by 16 pre-existing `no-explicit-any` errors in challenge code. Full evidence and the decision list are in `SEO_AUDIT.md`.
