/**
 * seed-uiux-roadmap.mjs
 *
 * Seeds the UI/UX Designer roadmap with all 38 topics via the admin API.
 *
 * Prerequisites:
 *   1. Run the Prisma migration first:
 *        cd /home/yash/Code/Designer's-Room/backend
 *        npx prisma migrate dev --name add-topic-fields
 *
 *   2. Start the backend server
 *
 *   3. Set your admin credentials in the environment:
 *        ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=... node scripts/seed-uiux-roadmap.mjs
 *
 *      OR set a pre-obtained Bearer token directly:
 *        ADMIN_TOKEN=<your_token> node scripts/seed-uiux-roadmap.mjs
 *
 * Usage:
 *   node scripts/seed-uiux-roadmap.mjs
 */

const BASE_URL = process.env.API_URL ?? 'http://localhost:3000'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN

if (!ADMIN_TOKEN) {
  console.error('❌  Set ADMIN_TOKEN environment variable to a valid admin Bearer token.')
  console.error('   Example: ADMIN_TOKEN=eyJ... node scripts/seed-uiux-roadmap.mjs')
  process.exit(1)
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${ADMIN_TOKEN}`,
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST ${path} → ${res.status}: ${text}`)
  }
  return res.json()
}

// ── Roadmap definition ────────────────────────────────────────────────────────

const TOPICS = [
  // ── Stage 01 — Foundations ─────────────────────────────────────────────────
  { position: 0,  stage: 1, title: 'What design actually is',          description: 'Understand what designers actually do day-to-day and how "design" differs from art or decoration.',                                              difficulty: 'beginner',     estimatedMinutes: 10 },
  { position: 1,  stage: 1, title: 'UX vs UI vs Product',              description: 'Unpack the three most misunderstood job titles in tech and learn where they overlap.',                                                           difficulty: 'beginner',     estimatedMinutes: 10 },
  { position: 2,  stage: 1, title: 'The design process, start to finish', description: 'Walk through a full design cycle — from discovery to handoff — so you always know where you are.',                                          difficulty: 'beginner',     estimatedMinutes: 15 },
  { position: 3,  stage: 1, title: 'Setting up Figma',                 description: 'Create your free account, navigate the interface, and set up your first file ready for the next topic.',                                         difficulty: 'beginner',     estimatedMinutes: 15 },
  { position: 4,  stage: 1, title: 'Seeing like a designer',           description: 'Train your eye to notice layout, spacing, and hierarchy in the apps and websites you already use.',                                               difficulty: 'beginner',     estimatedMinutes: 15 },
  { position: 5,  stage: 1, title: 'Giving and taking critique',       description: 'Learn the feedback patterns that pros use so you can improve your work fast without feeling crushed.',                                             difficulty: 'beginner',     estimatedMinutes: 15 },

  // ── Stage 02 — Layout & Hierarchy ──────────────────────────────────────────
  { position: 6,  stage: 2, title: 'Grids & spacing',                  description: 'Use an 8-point grid and auto-layout in Figma to build screens that feel tight and intentional.',                                                 difficulty: 'beginner',     estimatedMinutes: 20 },
  { position: 7,  stage: 2, title: 'Typography basics',                description: 'Pick typefaces, set a type scale, and make body text that\'s actually readable.',                                                                  difficulty: 'beginner',     estimatedMinutes: 20 },
  { position: 8,  stage: 2, title: 'Alignment & proximity',            description: 'Apply Gestalt principles to group related elements and separate unrelated ones — without guessing.',                                              difficulty: 'beginner',     estimatedMinutes: 15 },
  { position: 9,  stage: 2, title: 'Visual hierarchy',                 description: 'Control where the eye goes first, second, and third using size, weight, and contrast.',                                                           difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 10, stage: 2, title: 'Color & contrast',                 description: 'Build a functional color palette and check every combination against WCAG contrast ratios.',                                                      difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 11, stage: 2, title: 'Responsive layout',                description: 'Design screens that work at mobile, tablet, and desktop using Figma constraints and auto-layout.',                                                difficulty: 'intermediate', estimatedMinutes: 30 },

  // ── Stage 03 — User research ────────────────────────────────────────────────
  { position: 12, stage: 3, title: 'Who are you designing for?',       description: 'Define your target user, avoid the trap of designing for yourself, and frame the right problem.',                                                 difficulty: 'beginner',     estimatedMinutes: 15 },
  { position: 13, stage: 3, title: 'User interviews',                  description: 'Plan, recruit, and run five user interviews that give you real signal instead of confirmation bias.',                                              difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 14, stage: 3, title: "Surveys that don't lie",           description: 'Write survey questions that avoid leading language and produce data you can actually act on.',                                                     difficulty: 'intermediate', estimatedMinutes: 20 },
  { position: 15, stage: 3, title: 'Personas (without the cringe)',    description: 'Build lean, research-grounded personas that your team will actually reference — not dusty wall posters.',                                         difficulty: 'intermediate', estimatedMinutes: 20 },
  { position: 16, stage: 3, title: 'Empathy maps',                     description: 'Synthesise interview notes into a visual map of what users think, feel, say, and do.',                                                            difficulty: 'beginner',     estimatedMinutes: 15 },
  { position: 17, stage: 3, title: 'Competitor analysis',              description: 'Audit three competing products to find patterns, gaps, and opportunities before you draw a single frame.',                                        difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 18, stage: 3, title: 'Problem statements & HMW',         description: 'Turn messy research findings into crisp "How Might We" statements that point directly at solutions.',                                             difficulty: 'intermediate', estimatedMinutes: 20 },

  // ── Stage 04 — Wireframes & flows ──────────────────────────────────────────
  { position: 19, stage: 4, title: 'User flows',                       description: 'Map every step a user takes to complete a task — before you open Figma.',                                                                         difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 20, stage: 4, title: 'Information architecture',         description: 'Organise content and navigation so users always know where they are and how to get where they want to go.',                                        difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 21, stage: 4, title: 'Sketching ideas fast',             description: 'Use pen and paper to generate ten layout ideas in twenty minutes before committing to any one direction.',                                         difficulty: 'beginner',     estimatedMinutes: 15 },
  { position: 22, stage: 4, title: 'Low-fi wireframes',                description: 'Translate your best sketches into lo-fi Figma wireframes that communicate structure without distracting with colour.',                            difficulty: 'intermediate', estimatedMinutes: 30 },
  { position: 23, stage: 4, title: 'Mobile vs desktop patterns',       description: 'Learn which navigation and layout patterns belong on mobile and which belong on desktop — and why.',                                               difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 24, stage: 4, title: 'Testing early',                    description: 'Run a quick hallway test on your lo-fi wireframes to find the biggest usability problems before you build hi-fi.',                                difficulty: 'intermediate', estimatedMinutes: 25 },

  // ── Stage 05 — Figma, properly ─────────────────────────────────────────────
  { position: 25, stage: 5, title: 'Frames & auto layout',             description: 'Master Figma\'s auto-layout system so your designs resize and reflow without manual nudging.',                                                    difficulty: 'intermediate', estimatedMinutes: 30 },
  { position: 26, stage: 5, title: 'Components & variants',            description: 'Build a small component library with variants so you stop copy-pasting and start maintaining.',                                                   difficulty: 'intermediate', estimatedMinutes: 30 },
  { position: 27, stage: 5, title: 'Styles & variables',               description: 'Centralise your colour, type, and spacing tokens so a rebrand takes minutes instead of days.',                                                   difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 28, stage: 5, title: 'Constraints & responsive',         description: 'Set constraints on every layer so your designs scale cleanly between breakpoints.',                                                               difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 29, stage: 5, title: 'Prototyping basics',               description: 'Add interactions and transitions to your designs so stakeholders can click through a realistic flow.',                                             difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 30, stage: 5, title: 'Design systems 101',               description: 'Understand what a design system is, when you need one, and how to build the foundations without over-engineering.',                               difficulty: 'advanced',     estimatedMinutes: 35 },
  { position: 31, stage: 5, title: 'Accessibility basics',             description: 'Design for keyboard navigation, screen readers, and colour-blind users — from the start, not as an afterthought.',                               difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 32, stage: 5, title: 'Handoff to developers',            description: 'Set up Figma Dev Mode, write useful annotations, and run a handoff meeting that engineers actually appreciate.',                                  difficulty: 'advanced',     estimatedMinutes: 25 },

  // ── Stage 06 — Build your portfolio ────────────────────────────────────────
  { position: 33, stage: 6, title: 'Pick a project worth showing',     description: 'Choose one project from your work so far that demonstrates your thinking process — not just your visual output.',                                difficulty: 'beginner',     estimatedMinutes: 15 },
  { position: 34, stage: 6, title: 'Structure a case study',           description: 'Use the Problem → Process → Outcome framework to structure a story that hiring managers read to the end.',                                        difficulty: 'intermediate', estimatedMinutes: 25 },
  { position: 35, stage: 6, title: 'Write the story',                  description: 'Write clear, jargon-free copy that explains your design decisions without padding or self-congratulation.',                                        difficulty: 'intermediate', estimatedMinutes: 30 },
  { position: 36, stage: 6, title: 'Polish your visuals',              description: 'Apply the visual hierarchy and typography skills from Stage 02 to make your case study look as good as it reads.',                                difficulty: 'intermediate', estimatedMinutes: 30 },
  { position: 37, stage: 6, title: 'Publish & share it',               description: 'Deploy your portfolio to a free hosting platform and share it in the right places to get eyes on your work.',                                    difficulty: 'beginner',     estimatedMinutes: 20 },
]

// ── Run ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🌱  Seeding UI/UX roadmap at ${BASE_URL} …\n`)

  // 1. Create the roadmap
  console.log('  Creating roadmap …')
  const roadmap = await post('/admin/roadmaps', {
    title: 'UI/UX Designer',
    description:
      'From "what even is hierarchy?" to a case study that gets replies. One step at a time, tick things off as you go.',
  })
  console.log(`  ✓ Roadmap created — id: ${roadmap.id}\n`)

  // 2. Create topics one at a time (preserves position uniqueness constraint)
  console.log(`  Creating ${TOPICS.length} topics …`)
  for (const topic of TOPICS) {
    await post(`/admin/roadmaps/${roadmap.id}/topics`, topic)
    process.stdout.write('.')
  }
  console.log(`\n  ✓ All ${TOPICS.length} topics created.\n`)

  console.log('✅  Done!')
  console.log(`\n   Roadmap ID (save this): ${roadmap.id}`)
  console.log(`   Use this ID when navigating to /roadmaps/${roadmap.id}\n`)
}

main().catch((err) => {
  console.error('\n❌  Seed failed:', err.message)
  process.exit(1)
})
