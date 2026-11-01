import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  buildStageViews,
  computeProgress,
  findContinueTopicId,
  getDifficultyLabel,
  getTopicActionLabel,
  formatTime,
  type StageView,
} from './roadmapUtils'
import type {
  Checkpoint,
  Difficulty,
  ProgressEntry,
  Stage,
  Topic,
  TopicStatus,
  TopicViewStatus,
} from '@/lib/endpoints'

// ─── Helpers ─────────────────────────────────────────────────────────────────

let topicCounter = 0

function makeTopic(overrides: Partial<Topic> = {}): Topic {
  topicCounter += 1
  return {
    id: `topic-${topicCounter}`,
    title: 'Test topic',
    description: null,
    position: topicCounter,
    stage: 1,
    difficulty: 'beginner',
    estimatedMinutes: 10,
    hasContent: false,
    ...overrides,
  }
}

function makeCheckpoint(overrides: Partial<Checkpoint> = {}): Checkpoint {
  return {
    id: `checkpoint-${Math.random().toString(36).slice(2, 8)}`,
    stageId: 'stage-1',
    position: 1,
    task: 'Ship something',
    timeEstimate: '2–3 hrs',
    ...overrides,
  }
}

function makeStage(overrides: Partial<Stage> = {}): Stage {
  return {
    id: 'stage-1',
    position: 1,
    title: 'Stage',
    subtitle: null,
    byTheEnd: null,
    weekLabel: null,
    prerequisiteStage: null,
    checkpoints: [],
    ...overrides,
  }
}

function makeProgress(topicId: string, status: TopicStatus): ProgressEntry {
  return { topicId, status }
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

  it('falls back to beginner for unknown values', () => {
    expect(getDifficultyLabel(null)).toBe('● Beginner')
    expect(getDifficultyLabel('expert')).toBe('● Beginner')
  })

  // Property: dot count matches difficulty level
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
})

// ─── getTopicActionLabel ──────────────────────────────────────────────────────

describe('getTopicActionLabel', () => {
  it('returns "review" for done topics', () => {
    expect(getTopicActionLabel('done')).toBe('review')
  })

  it('returns "start" for not-started topics', () => {
    expect(getTopicActionLabel('not-started')).toBe('start')
  })

  it('returns "start" for in-progress topics', () => {
    expect(getTopicActionLabel('in-progress')).toBe('start')
  })

  it('returns null for locked topics', () => {
    expect(getTopicActionLabel('locked')).toBeNull()
  })

  // Property: covers all four statuses exhaustively
  it('maps every TopicViewStatus to the correct action label', () => {
    const statuses: TopicViewStatus[] = ['done', 'not-started', 'in-progress', 'locked']
    fc.assert(
      fc.property(fc.constantFrom(...statuses), (status) => {
        const result = getTopicActionLabel(status)
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

  it('returns an em dash for missing durations', () => {
    expect(formatTime(null)).toBe('—')
    expect(formatTime(0)).toBe('—')
  })

  // Property: output always contains the input number and "min"
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

// ─── buildStageViews ─────────────────────────────────────────────────────────

describe('buildStageViews', () => {
  it('groups topics under the stage they belong to', () => {
    const stages = [makeStage({ id: 's1', position: 1 }), makeStage({ id: 's2', position: 2 })]
    const topics = [
      makeTopic({ id: 't1', stage: 1 }),
      makeTopic({ id: 't2', stage: 2 }),
      makeTopic({ id: 't3', stage: 1 }),
    ]

    const views = buildStageViews(stages, topics)

    expect(views).toHaveLength(2)
    expect(views[0].topics.map((topic) => topic.id)).toEqual(['t1', 't3'])
    expect(views[1].topics.map((topic) => topic.id)).toEqual(['t2'])
  })

  it('ignores topics that are not attached to a stage', () => {
    const stages = [makeStage({ id: 's1', position: 1 })]
    const topics = [makeTopic({ id: 't1', stage: 1 }), makeTopic({ id: 't2', stage: null })]

    const views = buildStageViews(stages, topics)

    expect(views[0].totalTopics).toBe(1)
  })

  it('marks completed topics as done', () => {
    const stages = [makeStage({ id: 's1', position: 1 })]
    const topics = [makeTopic({ id: 't1', stage: 1 }), makeTopic({ id: 't2', stage: 1 })]

    const views = buildStageViews(stages, topics, [makeProgress('t1', 'done')])

    expect(views[0].topics[0].status).toBe('done')
    expect(views[0].topics[1].status).toBe('not-started')
    expect(views[0].completedTopics).toBe(1)
    expect(views[0].status).toBe('in-progress')
  })

  it('marks a stage as done once every topic is done', () => {
    const stages = [makeStage({ id: 's1', position: 1 })]
    const topics = [makeTopic({ id: 't1', stage: 1 }), makeTopic({ id: 't2', stage: 1 })]

    const views = buildStageViews(stages, topics, [
      makeProgress('t1', 'done'),
      makeProgress('t2', 'done'),
    ])

    expect(views[0].status).toBe('done')
    expect(views[0].completedTopics).toBe(2)
  })

  it('locks the topics of a stage whose prerequisite stage is not finished', () => {
    const stages = [
      makeStage({ id: 's1', position: 1 }),
      makeStage({ id: 's2', position: 2, prerequisiteStage: 1 }),
    ]
    const topics = [makeTopic({ id: 't1', stage: 1 }), makeTopic({ id: 't2', stage: 2 })]

    const views = buildStageViews(stages, topics)

    expect(views[1].topics[0].status).toBe('locked')
    expect(views[1].topics[0].needsStage).toBe(1)
    expect(views[1].topics[0].action).toBeUndefined()
  })

  it('unlocks a stage once the prerequisite stage is complete', () => {
    const stages = [
      makeStage({ id: 's1', position: 1 }),
      makeStage({ id: 's2', position: 2, prerequisiteStage: 1 }),
    ]
    const topics = [makeTopic({ id: 't1', stage: 1 }), makeTopic({ id: 't2', stage: 2 })]

    const views = buildStageViews(stages, topics, [makeProgress('t1', 'done')])

    expect(views[0].status).toBe('done')
    expect(views[1].topics[0].status).toBe('not-started')
    expect(views[1].topics[0].needsStage).toBeUndefined()
  })

  it('marks the checkpoints of a finished stage as done', () => {
    const stages = [
      makeStage({
        id: 's1',
        position: 1,
        checkpoints: [makeCheckpoint({ id: 'c1', stageId: 's1' })],
      }),
    ]
    const topics = [makeTopic({ id: 't1', stage: 1 })]

    const views = buildStageViews(stages, topics, [makeProgress('t1', 'done')])

    expect(views[0].checkpoints[0].status).toBe('done')
  })

  it('exposes the stage position and a padded number label', () => {
    const stages = [makeStage({ id: 's1', position: 7 })]
    const views = buildStageViews(stages, [])

    expect(views[0].position).toBe(7)
    expect(views[0].number).toBe('07')
  })

  // Property: a stage is only done when every one of its topics is done
  it('never reports a stage as done while a topic is unfinished', () => {
    const statuses: TopicStatus[] = ['done', 'in-progress', 'not-started']
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...statuses), { minLength: 1, maxLength: 6 }),
        fc.array(fc.constantFrom(...statuses), { minLength: 1, maxLength: 6 }),
        (stageOneStatuses, stageTwoStatuses) => {
          const topics: Topic[] = []
          const progress: ProgressEntry[] = []
          stageOneStatuses.forEach((status, index) => {
            const id = `t1-${index}`
            topics.push(makeTopic({ id, stage: 1 }))
            progress.push(makeProgress(id, status))
          })
          stageTwoStatuses.forEach((status, index) => {
            const id = `t2-${index}`
            topics.push(makeTopic({ id, stage: 2 }))
            progress.push(makeProgress(id, status))
          })
          const stages = [
            makeStage({ id: 's1', position: 1 }),
            makeStage({ id: 's2', position: 2, prerequisiteStage: 1 }),
          ]

          const views = buildStageViews(stages, topics, progress)

          for (const view of views) {
            if (view.status === 'done') {
              expect(view.topics.every((topic) => topic.status === 'done')).toBe(true)
            }
          }
        },
      ),
    )
  })
})

describe('findContinueTopicId', () => {
  it('prefers an in-progress topic', () => {
    const stages = buildStageViews(
      [makeStage()],
      [makeTopic({ id: 'first' }), makeTopic({ id: 'current' })],
      [makeProgress('first', 'done'), makeProgress('current', 'in-progress')],
    )

    expect(findContinueTopicId(stages)).toBe('current')
  })

  it('opens the first available topic for a new roadmap', () => {
    const stages = buildStageViews(
      [makeStage()],
      [makeTopic({ id: 'first' }), makeTopic({ id: 'second' })],
    )

    expect(findContinueTopicId(stages)).toBe('first')
  })

  it('falls back to a completed topic when the roadmap is complete', () => {
    const stages = buildStageViews(
      [makeStage()],
      [makeTopic({ id: 'first' })],
      [makeProgress('first', 'done')],
    )

    expect(findContinueTopicId(stages)).toBe('first')
  })
})

// ─── computeProgress ─────────────────────────────────────────────────────────

describe('computeProgress', () => {
  function stageWithTopics(topics: StageView['topics']): StageView {
    return {
      id: 's1',
      position: 1,
      number: '01',
      name: 'Stage',
      subtitle: '',
      byTheEnd: '',
      weekLabel: '',
      prerequisiteStage: null,
      status: 'upcoming',
      completedTopics: 0,
      totalTopics: topics.length,
      topics,
      checkpoints: [],
    }
  }

  function topicView(id: string, status: TopicViewStatus, title = 'Topic'): StageView['topics'][number] {
    return { id, title, status, difficulty: 'beginner', timeMinutes: 10 }
  }

  it('returns zero counts for an empty stages array', () => {
    expect(computeProgress([])).toEqual({
      completedTopics: 0,
      totalTopics: 0,
      continueTopicTitle: '',
    })
  })

  it('counts only done topics as completed', () => {
    const result = computeProgress([
      stageWithTopics([
        topicView('t1', 'done'),
        topicView('t2', 'in-progress'),
        topicView('t3', 'not-started'),
        topicView('t4', 'locked'),
      ]),
    ])
    expect(result.completedTopics).toBe(1)
    expect(result.totalTopics).toBe(4)
  })

  it('finds the first in-progress topic as continueTopicTitle', () => {
    const result = computeProgress([
      stageWithTopics([
        topicView('t1', 'done', 'Done topic'),
        topicView('t2', 'in-progress', 'In progress topic'),
        topicView('t3', 'in-progress', 'Another in progress'),
      ]),
    ])
    expect(result.continueTopicTitle).toBe('In progress topic')
  })

  it('returns empty continueTopicTitle when no in-progress topic exists', () => {
    const result = computeProgress([
      stageWithTopics([topicView('t1', 'done'), topicView('t2', 'not-started')]),
    ])
    expect(result.continueTopicTitle).toBe('')
  })

  it('aggregates topics across multiple stages', () => {
    const result = computeProgress([
      stageWithTopics([topicView('t1', 'done'), topicView('t2', 'done')]),
      stageWithTopics([
        topicView('t3', 'in-progress', 'Stage 2 topic'),
        topicView('t4', 'not-started'),
      ]),
    ])
    expect(result.completedTopics).toBe(2)
    expect(result.totalTopics).toBe(4)
    expect(result.continueTopicTitle).toBe('Stage 2 topic')
  })

  // Property: completedTopics ≤ totalTopics always holds
  it('always satisfies completedTopics ≤ totalTopics', () => {
    const statuses: TopicViewStatus[] = ['done', 'in-progress', 'not-started', 'locked']
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...statuses), { minLength: 0, maxLength: 10 }),
        (statusesInStage) => {
          const result = computeProgress([
            stageWithTopics(
              statusesInStage.map((status, index) => topicView(`t${index}`, status)),
            ),
          ])
          expect(result.completedTopics).toBeLessThanOrEqual(result.totalTopics)
        },
      ),
    )
  })

  // Property: completedTopics equals exact count of 'done' topics
  it('completedTopics equals the exact count of done topics across all stages', () => {
    const statuses: TopicViewStatus[] = ['done', 'in-progress', 'not-started', 'locked']
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...statuses), { minLength: 0, maxLength: 10 }),
        fc.array(fc.constantFrom(...statuses), { minLength: 0, maxLength: 10 }),
        (first, second) => {
          const allTopics = [
            ...first.map((status, index) => topicView(`t1-${index}`, status)),
            ...second.map((status, index) => topicView(`t2-${index}`, status)),
          ]
          const expectedDone = allTopics.filter((topic) => topic.status === 'done').length
          const result = computeProgress([
            stageWithTopics(allTopics.slice(0, first.length)),
            stageWithTopics(allTopics.slice(first.length)),
          ])
          expect(result.completedTopics).toBe(expectedDone)
          expect(result.totalTopics).toBe(allTopics.length)
        },
      ),
    )
  })
})
