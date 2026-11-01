import { afterEach, describe, expect, it } from 'vitest'
import {
  clearPendingProgress,
  readPendingProgress,
  rememberPendingProgress,
} from './progressIntent'

describe('progressIntent', () => {
  afterEach(() => {
    sessionStorage.clear()
  })

  it('remembers a pending done action', () => {
    rememberPendingProgress({ roadmapId: 'roadmap-1', topicId: 'topic-1', status: 'done' })

    expect(readPendingProgress()).toEqual({
      roadmapId: 'roadmap-1',
      topicId: 'topic-1',
      status: 'done',
    })
  })

  it('returns null when nothing is pending', () => {
    expect(readPendingProgress()).toBeNull()
  })

  it('ignores malformed pending data', () => {
    sessionStorage.setItem('designers-room-pending-progress', '{"status":"done"}')

    expect(readPendingProgress()).toBeNull()
  })

  it('clears the pending action', () => {
    rememberPendingProgress({ roadmapId: 'roadmap-1', topicId: 'topic-1', status: 'done' })
    clearPendingProgress()

    expect(readPendingProgress()).toBeNull()
  })
})
