// ─── Type Definitions ────────────────────────────────────────────────────────

export type TopicStatus = 'done' | 'in-progress' | 'not-started' | 'locked'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface TopicData {
  id: number
  title: string
  status: TopicStatus
  difficulty: Difficulty
  timeMinutes: number
  needsStage?: number
  action?: 'review' | 'start'
}

export interface CheckpointData {
  id: number
  task: string
  timeEstimate: string
  status: 'done' | 'pending'
}

export interface StageData {
  id: number
  number: string
  name: string
  subtitle: string
  byTheEnd: string
  topics: TopicData[]
  checkpoints: CheckpointData[]
  prerequisiteStage?: number
  status: 'done' | 'in-progress' | 'upcoming'
  completedTopics: number
  totalTopics: number
  weekLabel: string
}

export interface DisciplineTab {
  label: string
  active: boolean
}

export interface BeforeYouStartCard {
  colorLabel: string
  title: string
  bullets: string[]
}

export interface TimelineSegmentData {
  stageNumber: number
  weekLabel: string
  stageName: string
  topicsCount: number
  status: 'done' | 'in-progress' | 'upcoming'
}

export interface ProgressState {
  completedTopics: number
  totalTopics: number
  continueTopicTitle: string
}

export interface RoadmapData {
  id: string
  number: string
  title: string
  label: string
  subtitle: string
  metaPills: string[]
  disciplines: DisciplineTab[]
  stages: StageData[]
  beforeYouStart: BeforeYouStartCard[]
  timelinePace: string
  quotes: string[]
}

// ─── Static Data ─────────────────────────────────────────────────────────────

export const ROADMAP_DATA: RoadmapData = {
  id: 'ui-ux',
  number: '01',
  title: 'UI/UX\nDesigner',
  label: '(Roadmap 01)',
  subtitle:
    'From "what even is hierarchy?" to a case study that gets replies. One step at a time, tick things off as you go.',
  metaPills: ['6 stages', '38 topics', '~14 hours', 'Beginner → job-ready'],
  timelinePace: '6 weeks at 30 minutes a day',
  disciplines: [
    { label: 'UI/UX', active: true },
    { label: 'Graphic design', active: false },
    { label: 'Product design', active: false },
    { label: 'Design engineering', active: false },
  ],
  beforeYouStart: [
    {
      colorLabel: 'WHO THIS IS FOR',
      title: 'Total beginners, students and career switchers',
      bullets: [
        'No design background needed',
        'Zero Figma knowledge needed',
        'Curious about how apps feel good to use',
      ],
    },
    {
      colorLabel: 'WHAT YOU NEED',
      title: 'Not much, honestly',
      bullets: ['A laptop and decent internet', 'A free Figma account', '30 minutes a day'],
    },
    {
      colorLabel: 'HOW IT WORKS',
      title: 'Read, do, tick',
      bullets: [
        'Read the theory page (6 min)',
        'Do the checkpoint at the end of each stage',
        'Tick it off and watch the bar move',
      ],
    },
  ],
  quotes: [
    "Everyone's first Figma file looks like a fever dream. That's normal. Keep going.",
    'Hierarchy is just kindness for the eye.',
    "Talking to users is terrifying until it isn't. After the third interview, you'll wonder why you ever designed without it.",
    'Your first wireframe will be terrible. Do it anyway. The second one will be better.',
    "Auto layout will betray you exactly once. After that, it'll be your best friend.",
  ],
  stages: [
    // ── Stage 01 — Foundations ──────────────────────────────────────────────
    {
      id: 1,
      number: '01',
      name: 'Foundations',
      subtitle: 'What design is, and how designers actually think',
      byTheEnd: 'explain what designers do and set up your tools.',
      weekLabel: 'Week 1',
      prerequisiteStage: undefined,
      status: 'done',
      completedTopics: 6,
      totalTopics: 6,
      topics: [
        {
          id: 1,
          title: 'What design actually is',
          status: 'done',
          difficulty: 'beginner',
          timeMinutes: 10,
          action: 'review',
        },
        {
          id: 2,
          title: 'UX vs UI vs Product',
          status: 'done',
          difficulty: 'beginner',
          timeMinutes: 10,
          action: 'review',
        },
        {
          id: 3,
          title: 'The design process, start to finish',
          status: 'done',
          difficulty: 'beginner',
          timeMinutes: 15,
          action: 'review',
        },
        {
          id: 4,
          title: 'Setting up Figma',
          status: 'done',
          difficulty: 'beginner',
          timeMinutes: 15,
          action: 'review',
        },
        {
          id: 5,
          title: 'Seeing like a designer',
          status: 'done',
          difficulty: 'beginner',
          timeMinutes: 15,
          action: 'review',
        },
        {
          id: 6,
          title: 'Giving and taking critique',
          status: 'done',
          difficulty: 'beginner',
          timeMinutes: 15,
          action: 'review',
        },
      ],
      checkpoints: [
        {
          id: 1,
          task: 'Teardown one app you use daily',
          timeEstimate: '~1 hr',
          status: 'done',
        },
      ],
    },

    // ── Stage 02 — Layout & Hierarchy ───────────────────────────────────────
    {
      id: 2,
      number: '02',
      name: 'Layout & Hierarchy',
      subtitle: 'Make things look like they belong together',
      byTheEnd: 'make any screen look organised and easy to read.',
      weekLabel: 'Week 2',
      prerequisiteStage: 1,
      status: 'in-progress',
      completedTopics: 3,
      totalTopics: 6,
      topics: [
        {
          id: 7,
          title: 'Grids & spacing',
          status: 'done',
          difficulty: 'beginner',
          timeMinutes: 20,
          action: 'review',
        },
        {
          id: 8,
          title: 'Typography basics',
          status: 'done',
          difficulty: 'beginner',
          timeMinutes: 20,
          action: 'review',
        },
        {
          id: 9,
          title: 'Alignment & proximity',
          status: 'done',
          difficulty: 'beginner',
          timeMinutes: 15,
          action: 'review',
        },
        {
          id: 10,
          title: 'Visual hierarchy',
          status: 'in-progress',
          difficulty: 'intermediate',
          timeMinutes: 25,
          action: 'start',
        },
        {
          id: 11,
          title: 'Color & contrast',
          status: 'not-started',
          difficulty: 'intermediate',
          timeMinutes: 25,
          action: 'start',
        },
        {
          id: 12,
          title: 'Responsive layout',
          status: 'not-started',
          difficulty: 'intermediate',
          timeMinutes: 30,
          action: 'start',
        },
      ],
      checkpoints: [
        {
          id: 2,
          task: 'Fix a messy screen with 3 techniques',
          timeEstimate: '~2 hrs',
          status: 'pending',
        },
      ],
    },

    // ── Stage 03 — User research ─────────────────────────────────────────────
    {
      id: 3,
      number: '03',
      name: 'User research',
      subtitle: 'Find out what people need before you build',
      byTheEnd: 'run a small research round and synthesise the findings.',
      weekLabel: 'Week 3',
      prerequisiteStage: 2,
      status: 'upcoming',
      completedTopics: 0,
      totalTopics: 7,
      topics: [
        {
          id: 13,
          title: 'Who are you designing for?',
          status: 'not-started',
          difficulty: 'beginner',
          timeMinutes: 15,
          action: 'start',
        },
        {
          id: 14,
          title: 'User interviews',
          status: 'not-started',
          difficulty: 'intermediate',
          timeMinutes: 25,
          action: 'start',
        },
        {
          id: 15,
          title: "Surveys that don't lie",
          status: 'not-started',
          difficulty: 'intermediate',
          timeMinutes: 20,
          action: 'start',
        },
        {
          id: 16,
          title: 'Personas (without the cringe)',
          status: 'not-started',
          difficulty: 'intermediate',
          timeMinutes: 20,
          action: 'start',
        },
        {
          id: 17,
          title: 'Empathy maps',
          status: 'not-started',
          difficulty: 'beginner',
          timeMinutes: 15,
          action: 'start',
        },
        {
          id: 18,
          title: 'Competitor analysis',
          status: 'not-started',
          difficulty: 'intermediate',
          timeMinutes: 25,
          action: 'start',
        },
        {
          id: 19,
          title: 'Problem statements & HMW',
          status: 'not-started',
          difficulty: 'intermediate',
          timeMinutes: 20,
          action: 'start',
        },
      ],
      checkpoints: [
        {
          id: 3,
          task: 'Interview 3 real humans',
          timeEstimate: '~3 hrs',
          status: 'pending',
        },
      ],
    },

    // ── Stage 04 — Wireframes & flows ────────────────────────────────────────
    {
      id: 4,
      number: '04',
      name: 'Wireframes & flows',
      subtitle: 'Turn an idea into something you can click',
      byTheEnd: 'map a flow and test a wireframe with a real person.',
      weekLabel: 'Week 4',
      prerequisiteStage: 3,
      status: 'upcoming',
      completedTopics: 0,
      totalTopics: 6,
      topics: [
        {
          id: 20,
          title: 'User flows',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 25,
          needsStage: 3,
        },
        {
          id: 21,
          title: 'Information architecture',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 25,
          needsStage: 3,
        },
        {
          id: 22,
          title: 'Sketching ideas fast',
          status: 'locked',
          difficulty: 'beginner',
          timeMinutes: 15,
          needsStage: 3,
        },
        {
          id: 23,
          title: 'Low-fi wireframes',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 30,
          needsStage: 3,
        },
        {
          id: 24,
          title: 'Mobile vs desktop patterns',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 25,
          needsStage: 3,
        },
        {
          id: 25,
          title: 'Testing early',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 25,
          needsStage: 3,
        },
      ],
      checkpoints: [
        {
          id: 4,
          task: 'Wireframe a 5-screen flow',
          timeEstimate: '~3 hrs',
          status: 'pending',
        },
      ],
    },

    // ── Stage 05 — Figma, properly ───────────────────────────────────────────
    {
      id: 5,
      number: '05',
      name: 'Figma, properly',
      subtitle: 'Clean, reusable, developer-friendly files',
      byTheEnd: 'build files your future self will thank you for.',
      weekLabel: 'Week 5',
      prerequisiteStage: 4,
      status: 'upcoming',
      completedTopics: 0,
      totalTopics: 8,
      topics: [
        {
          id: 26,
          title: 'Frames & auto layout',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 30,
          needsStage: 4,
        },
        {
          id: 27,
          title: 'Components & variants',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 30,
          needsStage: 4,
        },
        {
          id: 28,
          title: 'Styles & variables',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 25,
          needsStage: 4,
        },
        {
          id: 29,
          title: 'Constraints & responsive',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 25,
          needsStage: 4,
        },
        {
          id: 30,
          title: 'Prototyping basics',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 25,
          needsStage: 4,
        },
        {
          id: 31,
          title: 'Design systems 101',
          status: 'locked',
          difficulty: 'advanced',
          timeMinutes: 35,
          needsStage: 4,
        },
        {
          id: 32,
          title: 'Accessibility basics',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 25,
          needsStage: 4,
        },
        {
          id: 33,
          title: 'Handoff to developers',
          status: 'locked',
          difficulty: 'advanced',
          timeMinutes: 25,
          needsStage: 4,
        },
      ],
      checkpoints: [
        {
          id: 5,
          task: 'Build a mini component library',
          timeEstimate: '~4 hrs',
          status: 'pending',
        },
      ],
    },

    // ── Stage 06 — Build your portfolio ─────────────────────────────────────
    {
      id: 6,
      number: '06',
      name: 'Build your portfolio',
      subtitle: 'Package your work so people actually read it',
      byTheEnd: "publish a case study you're proud to share.",
      weekLabel: 'Week 6',
      prerequisiteStage: 5,
      status: 'upcoming',
      completedTopics: 0,
      totalTopics: 5,
      topics: [
        {
          id: 34,
          title: 'Pick a project worth showing',
          status: 'locked',
          difficulty: 'beginner',
          timeMinutes: 15,
          needsStage: 5,
        },
        {
          id: 35,
          title: 'Structure a case study',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 25,
          needsStage: 5,
        },
        {
          id: 36,
          title: 'Write the story',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 30,
          needsStage: 5,
        },
        {
          id: 37,
          title: 'Polish your visuals',
          status: 'locked',
          difficulty: 'intermediate',
          timeMinutes: 30,
          needsStage: 5,
        },
        {
          id: 38,
          title: 'Publish & share it',
          status: 'locked',
          difficulty: 'beginner',
          timeMinutes: 20,
          needsStage: 5,
        },
      ],
      checkpoints: [
        {
          id: 6,
          task: 'Publish your first case study',
          timeEstimate: '~6 hrs',
          status: 'pending',
        },
      ],
    },
  ],
}
