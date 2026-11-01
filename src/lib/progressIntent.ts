const PENDING_PROGRESS_KEY = 'designers-room-pending-progress'

export interface PendingProgress {
  roadmapId: string
  topicId: string
  status: 'done'
}

export function rememberPendingProgress(value: PendingProgress): void {
  try {
    sessionStorage.setItem(PENDING_PROGRESS_KEY, JSON.stringify(value))
  } catch {
    return
  }
}

export function readPendingProgress(): PendingProgress | null {
  try {
    const raw = sessionStorage.getItem(PENDING_PROGRESS_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as Partial<PendingProgress> | null
    if (
      parsed &&
      typeof parsed.roadmapId === 'string' &&
      typeof parsed.topicId === 'string' &&
      parsed.status === 'done'
    ) {
      return {
        roadmapId: parsed.roadmapId,
        topicId: parsed.topicId,
        status: 'done',
      }
    }
    return null
  } catch {
    return null
  }
}

export function clearPendingProgress(): void {
  try {
    sessionStorage.removeItem(PENDING_PROGRESS_KEY)
  } catch {
    return
  }
}
