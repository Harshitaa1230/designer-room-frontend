import { apiClient } from '@/lib/api'

export interface Week {
  id: string
  number: number
  theme: string
  startsAt: string
  endsAt: string
  status: string
}

export interface ChallengeSummary {
  id: string
  weekId: string
  dayNumber: number
  type: string
  title: string
  brief?: string
  imageUrls?: string[]
  payload?: any
  maxXp?: number
  difficulty?: string
  status?: string
  version?: number
  locked?: boolean
  userStatus?: string | null
  attemptId?: string | null
}

export interface ChallengeDetail {
  id: string
  weekId: string
  dayNumber: number
  type: string
  title: string
  brief: string
  imageUrls: string[]
  payload: any
  maxXp: number
  difficulty?: string
  status: string
  version: number
}

export interface Attempt {
  id: string
  userId: string
  challengeId: string
  challengeVersion: number
  status: string
  answer: any
  startedAt: string
  submittedAt?: string
  gradedAt?: string
  grade?: any
  challenge?: any
}

export async function getCurrentWeek() {
  const { data } = await apiClient.get<Week | null>('/weeks/current')
  return data
}

export async function getWeeks() {
  const { data } = await apiClient.get<Week[]>('/weeks')
  return data
}

export async function getWeekChallenges(weekId: string) {
  const { data } = await apiClient.get<ChallengeSummary[]>(`/weeks/${weekId}/challenges`)
  return data
}

export async function getChallenge(id: string) {
  const { data } = await apiClient.get<ChallengeDetail>(`/challenges/${id}`)
  return data
}

export async function startChallenge(challengeId: string) {
  const { data } = await apiClient.post<Attempt>(`/challenges/${challengeId}/start`)
  return data
}

export async function saveAnswer(attemptId: string, answer: any) {
  const { data } = await apiClient.put<Attempt>(`/attempts/${attemptId}/answer`, { answer })
  return data
}

export async function submitAttempt(attemptId: string) {
  const { data } = await apiClient.post<Attempt>(`/attempts/${attemptId}/submit`)
  return data
}

export async function getAttempt(attemptId: string) {
  const { data } = await apiClient.get<Attempt>(`/attempts/${attemptId}`)
  return data
}

export async function getProgress() {
  const { data } = await apiClient.get<any>('/me/progress')
  return data
}

export async function getStreak() {
  const { data } = await apiClient.get<any>('/me/streak')
  return data
}

export async function getBadges() {
  const { data } = await apiClient.get<any>('/me/badges')
  return data
}

export async function getWeekSummary(weekId: string) {
  const { data } = await apiClient.get<any>(`/weeks/${weekId}/summary`)
  return data
}

export async function getLeaderboardWeekly(weekId: string, top = 50) {
  const { data } = await apiClient.get<any[]>(`/leaderboard/weekly?weekId=${weekId}&top=${top}`)
  return data
}

export async function getLeaderboardAllTime(top = 50) {
  const { data } = await apiClient.get<any[]>(`/leaderboard/all-time?top=${top}`)
  return data
}
