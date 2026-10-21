import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { computeProgress, getDifficultyLabel, getTopicActionLabel, formatTime } from './roadmapUtils'
import type { StageData, TopicData, Difficulty, TopicStatus } from './roadmapData'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeTopic(overrides: Partial<TopicData> = {}): TopicData {
  return {
    id: 1,
    title: 'Test topic',
    status: 'not-started',
    difficulty: 'beginner',
    timeMinutes: 10,
    ...overrides,
  }
}

function makeStage(topics: TopicData[]): StageData {
  return {
    id: 1,
    number: '01',
    name: 'Stage',
    subtitle: '',
    byTheEnd: '',
    weekLabel: 'Week 1',
    status: 'upcoming',
    completedTopics: 0,
    totalTopics: topics.length,
    topics,
    checkpoints: [],
  }
}

// ─── getDifficultyLabel ───────────────────────────────────────────────────────

describe('getDifficultyLabel', () => {
  it('returns "● Beginner" for beginner', () => {
    expect(getDifficultyLabel('beginner')).toBe('● Beginner')
  })

  it('returns "●● Intermediate" for intermediate', () => {
    expect(getDifficultyLabel('intermediate')).toBe('●● Intermediate')
  })

  it('returns "●●● Advanced" for advanced', () => {
    expect(getDifficultyLabel('advanced')).toBe('●●● Advanced')
  })

  // Property: dot count matches difficulty level
  // **Validates: Requirements 5.5**
  it('always returns a string with the correct number of ● dots', () => {
    const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced']
    const expectedDots: Record<Difficulty, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    }
    fc.assert(
      fc.property(fc.constantFrom(...difficulties), (difficulty) => {
        const label = getDifficultyLabel(difficulty)
        const dotCount = (label.match(/●/g) ?? []).length
        expect(dotCount).toBe(expectedDots[difficulty])
      }),
    )
  })

  // Property: determinism — same input always yields same output
  // **Validates: Requirements 5.5**
  it('is deterministic for all valid difficulty values', () => {
    const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced']
    fc.assert(
      fc.property(fc.constantFrom(...difficulties), (difficulty) => {
        expect(getDifficultyLabel(difficulty)).toBe(getDifficultyLabel(difficulty))
      }),
    )
  })
})

// ─── getTopicActionLabel ──────────────────────────────────────────────────────

describe('getTopicActionLabel', () => {
  it('returns "review" for done topics', () => {
    expect(getTopicActionLabel(makeTopic({ status: 'done' }))).toBe('review')
  })

  it('returns "start" for not-started topics', () => {
    expect(getTopicActionLabel(makeTopic({ status: 'not-started' }))).toBe('start')
  })

  it('returns "start" for in-progress topics', () => {
    expect(getTopicActionLabel(makeTopic({ status: 'in-progress' }))).toBe('start')
  })

  it('returns null for locked topics', () => {
    expect(getTopicActionLabel(makeTopic({ status: 'locked' }))).toBeNull()
  })

  // Property: covers all four statuses exhaustively
  // **Validates: Requirements 5.7, 5.8, 5.9**
  it('maps every TopicStatus to the correct action label', () => {
    const statuses: TopicStatus[] = ['done', 'not-started', 'in-progress', 'locked']
    fc.assert(
      fc.property(fc.constantFrom(...statuses), (status) => {
        const result = getTopicActionLabel(makeTopic({ status }))
        if (status === 'done') expect(result).toBe('review')
        else if (status === 'locked') expect(result).toBeNull()
        else expect(result).toBe('start')
      }),
    )
  })
})

// ─── formatTime ──────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('formats 1 minute', () => {
    expect(formatTime(1)).toBe('1 min')
  })

  it('formats 60 minutes', () => {
    expect(formatTime(60)).toBe('60 min')
  })

  it('formats 999 minutes', () => {
    expect(formatTime(999)).toBe('999 min')
  })

  // Property: output always contains the input number and "min"
  // **Validates: Requirements 5.6**
  it('always contains the input number and "min" substring', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10000 }), (minutes) => {
        const result = formatTime(minutes)
        expect(result).toContain(String(minutes))
        expect(result).toContain('min')
        expect(result.length).toBeGreaterThan(0)
      }),
    )
  })
})

// ─── computeProgress ─────────────────────────────────────────────────────────

describe('computeProgress', () => {
  it('returns zero counts for an empty stages array', () => {
    expect(computeProgress([])).toEqual({
      completedTopics: 0,
      totalTopics: 0,
      continueTopicTitle: '',
    })
  })

  it('counts only done topics as completed', () => {
    const topics = [
      makeTopic({ id: 1, status: 'done' }),
      makeTopic({ id: 2, status: 'in-progress' }),
      makeTopic({ id: 3, status: 'not-started' }),
      makeTopic({ id: 4, status: 'locked' }),
    ]
    const result = computeProgress([makeStage(topics)])
    expect(result.completedTopics).toBe(1)
    expect(result.totalTopics).toBe(4)
  })

  it('finds the first in-progress topic as continueTopicTitle', () => {
    const topics = [
      makeTopic({ id: 1, title: 'Done topic', status: 'done' }),
      makeTopic({ id: 2, title: 'In progress topic', status: 'in-progress' }),
      makeTopic({ id: 3, title: 'Another in progress', status: 'in-progress' }),
    ]
    const result = computeProgress([makeStage(topics)])
    expect(result.continueTopicTitle).toBe('In progress topic')
  })

  it('returns empty continueTopicTitle when no in-progress topic exists', () => {
    const topics = [
      makeTopic({ id: 1, status: 'done' }),
      makeTopic({ id: 2, status: 'not-started' }),
    ]
    const result = computeProgress([makeStage(topics)])
    expect(result.continueTopicTitle).toBe('')
  })

  it('aggregates topics across multiple stages', () => {
    const stage1 = makeStage([
      makeTopic({ id: 1, status: 'done' }),
      makeTopic({ id: 2, status: 'done' }),
    ])
    const stage2 = makeStage([
      makeTopic({ id: 3, status: 'in-progress', title: 'Stage 2 topic' }),
      makeTopic({ id: 4, status: 'not-started' }),
    ])
    const result = computeProgress([stage1, stage2])
    expect(result.completedTopics).toBe(2)
    expect(result.totalTopics).toBe(4)
    expect(result.continueTopicTitle).toBe('Stage 2 topic')
  })

  it('returns all topics as completed when all are done', () => {
    const topics = [
      makeTopic({ id: 1, status: 'done' }),
      makeTopic({ id: 2, status: 'done' }),
      makeTopic({ id: 3, status: 'done' }),
    ]
    const result = computeProgress([makeStage(topics)])
    expect(result.completedTopics).toBe(3)
    expect(result.totalTopics).toBe(3)
    expect(result.continueTopicTitle).toBe('')
  })

  // Property: completedTopics ≤ totalTopics always holds
  // **Validates: Requirements 3.1, 3.2, 3.3**
  it('always satisfies completedTopics ≤ totalTopics', () => {
    const statuses: TopicStatus[] = ['done', 'in-progress', 'not-started', 'locked']
    const topicArb = fc
      .record({
        id: fc.integer({ min: 1, max: 1000 }),
        title: fc.string({ minLength: 1, maxLength: 30 }),
        status: fc.constantFrom(...statuses),
        difficulty: fc.constantFrom<Difficulty>('beginner', 'intermediate', 'advanced'),
        timeMinutes: fc.integer({ min: 1, max: 120 }),
      })
      .map((t) => t as TopicData)

    const stageArb = fc
      .array(topicArb, { minLength: 0, maxLength: 10 })
      .map((topics) => makeStage(topics))

    fc.assert(
      fc.property(fc.array(stageArb, { minLength: 0, maxLength: 6 }), (stages) => {
        const result = computeProgress(stages)
        expect(result.completedTopics).toBeLessThanOrEqual(result.totalTopics)
      }),
    )
  })

  // Property: completedTopics equals exact count of 'done' topics
  // **Validates: Requirements 3.1, 3.2**
  it('completedTopics equals the exact count of done topics across all stages', () => {
    const statuses: TopicStatus[] = ['done', 'in-progress', 'not-started', 'locked']
    const topicArb = fc
      .record({
        id: fc.integer({ min: 1, max: 1000 }),
        title: fc.string({ minLength: 1, maxLength: 30 }),
        status: fc.constantFrom(...statuses),
        difficulty: fc.constantFrom<Difficulty>('beginner', 'intermediate', 'advanced'),
        timeMinutes: fc.integer({ min: 1, max: 120 }),
      })
      .map((t) => t as TopicData)

    const stageArb = fc
      .array(topicArb, { minLength: 0, maxLength: 10 })
      .map((topics) => makeStage(topics))

    fc.assert(
      fc.property(fc.array(stageArb, { minLength: 1, maxLength: 6 }), (stages) => {
        const allTopics = stages.flatMap((s) => s.topics)
        const expectedDone = allTopics.filter((t) => t.status === 'done').length
        const result = computeProgress(stages)
        expect(result.completedTopics).toBe(expectedDone)
        expect(result.totalTopics).toBe(allTopics.length)
      }),
    )
  })
})
