import type { StageData, TopicData, Difficulty, ProgressState } from './roadmapData'

/**
 * Counts completed topics, total topics, and finds the first in-progress topic title.
 * Requirements: 3.1, 3.2, 3.4, 3.5
 */
export function computeProgress(stages: StageData[]): ProgressState {
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
 * Returns dot label for difficulty.
 * 'beginner'     → "● Beginner"
 * 'intermediate' → "●● Intermediate"
 * 'advanced'     → "●●● Advanced"
 * Requirements: 5.5
 */
export function getDifficultyLabel(difficulty: Difficulty): string {
  switch (difficulty) {
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
 * Requirements: 5.7, 5.8, 5.9
 */
export function getTopicActionLabel(topic: TopicData): 'review' | 'start' | null {
  switch (topic.status) {
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
 * Requirements: 5.6
 */
export function formatTime(minutes: number): string {
  return `${minutes} min`
}
