import { mkdir, writeFile } from 'node:fs/promises'

const configuredUrl = process.env.VITE_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
const siteUrl = (configuredUrl ? (configuredUrl.startsWith('http') ? configuredUrl : `https://${configuredUrl}`) : 'https://designersroom.in').replace(/\/$/, '')
const routes = ['/', '/roadmaps', '/challenge', '/weeks', '/community']
const urls = routes.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`).join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

await mkdir('public', { recursive: true })
await writeFile('public/sitemap.xml', sitemap)
