import { apiClient } from '@/lib/api'
import type { UserProfile } from '@/store/auth'

// ── Types ────────────────────────────────────────────────────────────────────

export interface RoadmapSummary {
  id: string
  title: string
  description: string | null
  createdAt: string
  userId: string | null
}

export interface Topic {
  id: string
  title: string
  description: string | null
  position: number
}

export interface RoadmapDetail extends RoadmapSummary {
  topics: Topic[]
}

export interface RoadmapPage {
  items: RoadmapSummary[]
  nextCursor: string | null
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

// ── Admin ────────────────────────────────────────────────────────────────────

export async function createRoadmap(payload: { title: string; description?: string }): Promise<RoadmapSummary> {
  const { data } = await apiClient.post<RoadmapSummary>('/admin/roadmaps', payload)
  return data
}

export async function updateRoadmap(
  id: string,
  payload: { title?: string; description?: string },
): Promise<RoadmapSummary> {
  const { data } = await apiClient.patch<RoadmapSummary>(`/admin/roadmaps/${id}`, payload)
  return data
}

export async function deleteRoadmap(id: string): Promise<void> {
  await apiClient.delete(`/admin/roadmaps/${id}`)
}

export async function createTopic(
  roadmapId: string,
  payload: { title: string; description?: string; position?: number },
): Promise<Topic> {
  const { data } = await apiClient.post<Topic>(`/admin/roadmaps/${roadmapId}/topics`, payload)
  return data
}

export async function updateTopic(
  id: string,
  payload: { title?: string; description?: string; position?: number },
): Promise<Topic> {
  const { data } = await apiClient.patch<Topic>(`/admin/topics/${id}`, payload)
  return data
}

export async function deleteTopic(id: string): Promise<void> {
  await apiClient.delete(`/admin/topics/${id}`)
}
