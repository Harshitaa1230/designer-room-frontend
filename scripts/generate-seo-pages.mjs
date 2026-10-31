import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const siteUrl = (process.env.VITE_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'https://designersroom.anviklabs.site')
  .replace(/\/$/, '')
  .replace(/^((?!https?:\/\/).+)$/, 'https://$1')

const routes = [
  {
    path: '/roadmaps',
    title: 'Design roadmaps · Designers Room',
    description: 'Follow practical, step-by-step design roadmaps you can actually finish.',
    heading: 'Pick your path.',
    body: 'Step-by-step plans you can actually finish. Explore structured design roadmaps and build skills through practice.',
    links: [{ href: '/weeks', label: 'Explore challenges' }],
  },
  {
    path: '/weeks',
    title: 'Design challenges · Designers Room',
    description: 'Build your design portfolio through focused weekly challenges.',
    heading: 'Challenges',
    body: 'Build your design portfolio through focused weekly design challenges.',
    links: [{ href: '/roadmaps', label: 'Browse design roadmaps' }],
  },
  {
    path: '/community',
    title: 'Community coming soon · Designers Room',
    description: 'A community for designers learning, building, and sharing in the open.',
    heading: 'The community is almost here.',
    body: 'Blogs, showcases, and honest critique from people learning the same things and building in the open.',
    links: [{ href: '/', label: 'Back to Designers Room' }],
  },
  {
    path: '/leaderboard',
    title: 'Designers Room leaderboard',
    description: 'See the Designers Room challenge leaderboard.',
    heading: 'Leaderboard',
    body: 'Track progress across Designers Room challenges.',
    robots: 'noindex, nofollow',
    links: [{ href: '/weeks', label: 'Explore challenges' }],
  },
  {
    path: '/waitlist',
    title: 'Join the Designers Room waitlist',
    description: 'Save your spot for the Designers Room beta.',
    heading: 'Join Designers Room',
    body: 'Save your spot for the Designers Room beta.',
    robots: 'noindex, nofollow',
    links: [{ href: '/', label: 'Back to Designers Room' }],
  },
  {
    path: '/login',
    title: 'Sign in · Designers Room',
    description: 'Sign in to continue your Designers Room practice.',
    heading: 'Sign in',
    body: 'Sign in to continue to Designers Room.',
    robots: 'noindex, nofollow',
    links: [{ href: '/', label: 'Back to Designers Room' }],
  },
]

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

const template = await readFile('dist/index.html', 'utf8')

for (const route of routes) {
  const canonical = `${siteUrl}${route.path}`
  const fallbackLinks = route.links.map((link) => `<a href="${link.href}">${escapeHtml(link.label)}</a>`).join(' · ')
  const fallback = `<main><h1>${escapeHtml(route.heading)}</h1><p>${escapeHtml(route.body)}</p><nav>${fallbackLinks}</nav></main>`
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: route.title,
    description: route.description,
    url: canonical,
  })
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeHtml(route.description)}" />`)
    .replace(/<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${escapeHtml(route.title)}" />`)
    .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escapeHtml(route.description)}" />`)
    .replace(/<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`)
    .replace(/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`)
    .replace('</head>', `    <meta name="robots" content="${route.robots ?? 'index, follow'}" />\n  </head>`)
    .replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${jsonLd}</script>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${fallback}</div>`)

  const outputPath = join('dist', route.path, 'index.html')
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
}
