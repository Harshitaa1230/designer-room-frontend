import { apiClient } from '@/lib/api'
import type { UserProfile } from '@/store/auth'

// ── Types ────────────────────────────────────────────────────────────────────

export type TopicStatus = 'not-started' | 'in-progress' | 'done'

export type TopicViewStatus = TopicStatus | 'locked'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface DisciplineTab {
  label: string
  active: boolean
}

export interface BeforeYouStartCard {
  colorLabel: string
  title: string
  bullets: string[]
}

export interface RoadmapMetadata {
  number?: string
  label?: string
  subtitle?: string
  metaPills?: string[]
  disciplines?: DisciplineTab[]
  beforeYouStart?: BeforeYouStartCard[]
  timelinePace?: string
  quotes?: string[]
}

export interface RoadmapSummary {
  id: string
  title: string
  description: string | null
  slug: string
  position: number
  createdAt: string
  userId: string | null
  topicCount: number
  stageCount: number
  metadata: RoadmapMetadata | null
}

export interface Checkpoint {
  id: string
  stageId: string
  position: number
  task: string
  timeEstimate: string | null
}

export interface Stage {
  id: string
  position: number
  title: string
  subtitle: string | null
  byTheEnd: string | null
  weekLabel: string | null
  prerequisiteStage: number | null
  checkpoints: Checkpoint[]
}

export interface TopicQuizQuestion {
  question: string
  options: string[]
  answerIndex: number
  why: string
}

export interface TopicMetadata {
  level?: string
  timeMinutes?: number
  needs?: string[]
  upNext?: string | null
  upNextLabel?: string
  related?: string[]
  youllNeed?: string | null
  practise?: string | null
  seoTitle?: string
  seoDescription?: string
  quiz?: TopicQuizQuestion[]
  [key: string]: unknown
}

export interface Topic {
  id: string
  title: string
  slug?: string | null
  description: string | null
  position: number
  stage: number | null
  difficulty: string | null
  estimatedMinutes: number | null
  metadata?: TopicMetadata | null
  hasContent: boolean
}

export interface RoadmapDetail extends RoadmapSummary {
  metadata: RoadmapMetadata | null
  stages: Stage[]
  topics: Topic[]
}

export interface RoadmapPage {
  items: RoadmapSummary[]
  nextCursor: string | null
}

export interface ProgressEntry {
  topicId: string
  status: TopicStatus
}

// ── Users ────────────────────────────────────────────────────────────────────

export async function getMe(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>('/users/me')
  return data
}

export async function updateMe(payload: { name: string }): Promise<UserProfile> {
  const { data } = await apiClient.patch<UserProfile>('/users/me', payload)
  return data
}

// ── Waitlist ─────────────────────────────────────────────────────────────────

export async function joinWaitlist(email: string): Promise<{ ok: boolean }> {
  const { data } = await apiClient.post<{ ok: boolean }>('/waitlist', { email })
  return data
}

// ── Roadmaps ─────────────────────────────────────────────────────────────────

export async function listRoadmaps(params: { cursor?: string; limit?: number } = {}): Promise<RoadmapPage> {
  const { data } = await apiClient.get<RoadmapPage>('/roadmaps', { params })
  return data
}

export async function getRoadmap(id: string): Promise<RoadmapDetail> {
  const { data } = await apiClient.get<RoadmapDetail>(`/roadmaps/${id}`)
  return data
}

export async function getTopicContent(roadmapId: string, topicId: string): Promise<string> {
  const { data } = await apiClient.get<string>(`/roadmaps/${roadmapId}/topics/${topicId}/content`, {
    responseType: 'text',
    transformResponse: [(body: string) => body],
  })
  return data
}

export async function getRoadmapProgress(roadmapId: string): Promise<ProgressEntry[]> {
  const { data } = await apiClient.get<{ items: ProgressEntry[] }>(`/roadmaps/${roadmapId}/progress`)
  return data.items
}

export async function setTopicProgress(
  roadmapId: string,
  topicId: string,
  status: TopicStatus,
): Promise<ProgressEntry> {
  const { data } = await apiClient.patch<ProgressEntry>(
    `/roadmaps/${roadmapId}/topics/${topicId}/progress`,
    { status },
  )
  return data
}

// ── Admin ────────────────────────────────────────────────────────────────────

export async function createRoadmap(payload: {
  title: string
  description?: string
  slug?: string
  position?: number
  metadata?: Record<string, unknown>
}): Promise<RoadmapSummary> {
  const { data } = await apiClient.post<RoadmapSummary>('/admin/roadmaps', payload)
  return data
}

export async function updateRoadmap(
  id: string,
  payload: {
    title?: string
    description?: string
    slug?: string
    position?: number
    metadata?: Record<string, unknown>
  },
): Promise<RoadmapSummary> {
  const { data } = await apiClient.patch<RoadmapSummary>(`/admin/roadmaps/${id}`, payload)
  return data
}

export async function deleteRoadmap(id: string): Promise<void> {
  await apiClient.delete(`/admin/roadmaps/${id}`)
}

export async function createStage(
  roadmapId: string,
  payload: {
    title: string
    subtitle?: string
    byTheEnd?: string
    weekLabel?: string
    position?: number
    prerequisiteStage?: number
  },
): Promise<Stage> {
  const { data } = await apiClient.post<Stage>(`/admin/roadmaps/${roadmapId}/stages`, payload)
  return data
}

export async function updateStage(
  id: string,
  payload: {
    title?: string
    subtitle?: string
    byTheEnd?: string
    weekLabel?: string
    position?: number
    prerequisiteStage?: number | null
  },
): Promise<Stage> {
  const { data } = await apiClient.patch<Stage>(`/admin/stages/${id}`, payload)
  return data
}

export async function deleteStage(id: string): Promise<void> {
  await apiClient.delete(`/admin/stages/${id}`)
}

export async function createCheckpoint(
  stageId: string,
  payload: { task: string; timeEstimate?: string; position?: number },
): Promise<Checkpoint> {
  const { data } = await apiClient.post<Checkpoint>(`/admin/stages/${stageId}/checkpoints`, payload)
  return data
}

export async function updateCheckpoint(
  id: string,
  payload: { task?: string; timeEstimate?: string; position?: number },
): Promise<Checkpoint> {
  const { data } = await apiClient.patch<Checkpoint>(`/admin/checkpoints/${id}`, payload)
  return data
}

export async function deleteCheckpoint(id: string): Promise<void> {
  await apiClient.delete(`/admin/checkpoints/${id}`)
}

export async function createTopic(
  roadmapId: string,
  payload: {
    title: string
    description?: string
    position?: number
    stage?: number
    difficulty?: Difficulty
    estimatedMinutes?: number
  },
): Promise<Topic> {
  const { data } = await apiClient.post<Topic>(`/admin/roadmaps/${roadmapId}/topics`, payload)
  return data
}

export async function updateTopic(
  id: string,
  payload: {
    title?: string
    description?: string
    position?: number
    stage?: number | null
    difficulty?: Difficulty
    estimatedMinutes?: number
  },
): Promise<Topic> {
  const { data } = await apiClient.patch<Topic>(`/admin/topics/${id}`, payload)
  return data
}

export async function deleteTopic(id: string): Promise<void> {
  await apiClient.delete(`/admin/topics/${id}`)
}

export async function uploadTopicContent(
  roadmapId: string,
  topicId: string,
  file: File,
): Promise<{ objectKey: string; sizeBytes: number }> {
  const body = new FormData()
  body.append('file', file)
  const { data } = await apiClient.post<{ objectKey: string; sizeBytes: number }>(
    `/admin/roadmaps/${roadmapId}/topics/${topicId}/content`,
    body,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

export async function deleteTopicContent(roadmapId: string, topicId: string): Promise<void> {
  await apiClient.delete(`/admin/roadmaps/${roadmapId}/topics/${topicId}/content`)
}
