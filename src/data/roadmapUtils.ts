import type {
  Checkpoint,
  Difficulty,
  ProgressEntry,
  Stage,
  Topic,
  TopicStatus,
  TopicViewStatus,
} from '@/lib/endpoints'

// ── View models ──────────────────────────────────────────────────────────────

export interface TopicView {
  id: string
  title: string
  status: TopicViewStatus
  difficulty: Difficulty
  timeMinutes: number
  needsStage?: number
  action?: 'review' | 'start'
}

export interface CheckpointView {
  id: string
  task: string
  timeEstimate: string
  status: 'done' | 'pending'
}

export interface StageView {
  id: string
  position: number
  number: string
  name: string
  subtitle: string
  byTheEnd: string
  weekLabel: string
  prerequisiteStage: number | null
  status: 'done' | 'in-progress' | 'upcoming'
  completedTopics: number
  totalTopics: number
  topics: TopicView[]
  checkpoints: CheckpointView[]
}

export interface ProgressState {
  completedTopics: number
  totalTopics: number
  continueTopicTitle: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDifficulty(value: string | null): Difficulty {
  if (value === 'beginner' || value === 'intermediate' || value === 'advanced') {
    return value
  }
  return 'beginner'
}

function padPosition(position: number): string {
  return String(position).padStart(2, '0')
}

/**
 * Groups the flat topic list into stages, resolves the status of every topic
 * against the signed-in user's progress and locks the topics of a stage whose
 * prerequisite stage is not finished yet.
 */
export function buildStageViews(
  stages: Stage[],
  topics: Topic[],
  progress: ProgressEntry[] = [],
): StageView[] {
  const statusByTopic = new Map(progress.map((entry) => [entry.topicId, entry.status]))
  const topicsByStage = new Map<number, Topic[]>()
  for (const topic of topics) {
    if (topic.stage === null) {
      continue
    }
    const bucket = topicsByStage.get(topic.stage)
    if (bucket) {
      bucket.push(topic)
    } else {
      topicsByStage.set(topic.stage, [topic])
    }
  }

  const views: StageView[] = stages.map((stage) => {
    const stageTopics: TopicView[] = (topicsByStage.get(stage.position) ?? []).map((topic) => ({
      id: topic.id,
      title: topic.title,
      status: 'not-started',
      difficulty: toDifficulty(topic.difficulty),
      timeMinutes: topic.estimatedMinutes ?? 0,
    }))
    const checkpoints: CheckpointView[] = stage.checkpoints.map((checkpoint) => ({
      id: checkpoint.id,
      task: checkpoint.task,
      timeEstimate: checkpoint.timeEstimate ?? '',
      status: 'pending',
    }))
    return {
      id: stage.id,
      position: stage.position,
      number: padPosition(stage.position),
      name: stage.title,
      subtitle: stage.subtitle ?? '',
      byTheEnd: stage.byTheEnd ?? '',
      weekLabel: stage.weekLabel ?? '',
      prerequisiteStage: stage.prerequisiteStage,
      status: 'upcoming',
      completedTopics: 0,
      totalTopics: stageTopics.length,
      topics: stageTopics,
      checkpoints,
    }
  })

  const doneStagePositions = new Set<number>()
  for (const view of views) {
    const completed = view.topics.filter((topic) => statusByTopic.get(topic.id) === 'done').length
    if (view.totalTopics > 0 && completed === view.totalTopics) {
      doneStagePositions.add(view.position)
    }
  }

  for (const view of views) {
    const prerequisiteMet =
      view.prerequisiteStage === null || doneStagePositions.has(view.prerequisiteStage)
    for (const topic of view.topics) {
      const status = statusByTopic.get(topic.id)
      if (status === 'done') {
        topic.status = 'done'
      } else if (!prerequisiteMet) {
        topic.status = 'locked'
      } else if (status === 'in-progress') {
        topic.status = 'in-progress'
      } else {
        topic.status = 'not-started'
      }
      topic.needsStage = prerequisiteMet ? undefined : (view.prerequisiteStage ?? undefined)
      topic.action = getTopicActionLabel(topic.status) ?? undefined
    }
    view.completedTopics = view.topics.filter((topic) => topic.status === 'done').length
    if (view.totalTopics > 0 && view.completedTopics === view.totalTopics) {
      view.status = 'done'
    } else if (view.completedTopics > 0 || view.topics.some((topic) => topic.status === 'in-progress')) {
      view.status = 'in-progress'
    }
    for (const checkpoint of view.checkpoints) {
      checkpoint.status = view.status === 'done' ? 'done' : 'pending'
    }
  }

  return views
}

/**
 * Counts completed topics, total topics, and finds the first in-progress topic title.
 */
export function computeProgress(stages: StageView[]): ProgressState {
  let completedTopics = 0
  let totalTopics = 0
  let continueTopicTitle = ''

  for (const stage of stages) {
    for (const topic of stage.topics) {
      totalTopics++
      if (topic.status === 'done') {
        completedTopics++
      }
      if (continueTopicTitle === '' && topic.status === 'in-progress') {
        continueTopicTitle = topic.title
      }
    }
  }

  if (totalTopics === 0) {
    return { completedTopics: 0, totalTopics: 0, continueTopicTitle: '' }
  }

  return { completedTopics, totalTopics, continueTopicTitle }
}

/**
 * Finds the topic the roadmap CTA should open. Prefer an active topic, then
 * the first available topic, so the CTA never points back to the roadmap page.
 */
export function findContinueTopicId(stages: StageView[]): string | undefined {
  const topics = stages.flatMap((stage) => stage.topics)
  return (
    topics.find((topic) => topic.status === 'in-progress')?.id ??
    topics.find((topic) => topic.status === 'not-started')?.id ??
    topics.find((topic) => topic.status === 'done')?.id
  )
}

/**
 * Returns dot label for difficulty.
 * 'beginner'     → "● Beginner"
 * 'intermediate' → "●● Intermediate"
 * 'advanced'     → "●●● Advanced"
 */
export function getDifficultyLabel(difficulty: string | null): string {
  switch (toDifficulty(difficulty)) {
    case 'beginner':
      return '● Beginner'
    case 'intermediate':
      return '●● Intermediate'
    case 'advanced':
      return '●●● Advanced'
  }
}

/**
 * Returns action label for a topic.
 * 'done'                        → 'review'
 * 'not-started' | 'in-progress' → 'start'
 * 'locked'                      → null
 */
export function getTopicActionLabel(status: TopicViewStatus): 'review' | 'start' | null {
  switch (status) {
    case 'done':
      return 'review'
    case 'not-started':
    case 'in-progress':
      return 'start'
    case 'locked':
      return null
  }
}

/**
 * Formats minutes as "[N] min" string.
 */
export function formatTime(minutes: number | null): string {
  if (!minutes) {
    return '—'
  }
  return `${minutes} min`
}

export function statusLabel(status: TopicStatus): string {
  switch (status) {
    case 'done':
      return 'Done'
    case 'in-progress':
      return 'In progress'
    case 'not-started':
      return 'Not started'
  }
}

export type { Checkpoint }
