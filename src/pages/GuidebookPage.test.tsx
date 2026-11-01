import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GuidebookPage } from '@/pages/GuidebookPage'
import {
  getRoadmap,
  getRoadmapProgress,
  getTopicContent,
  setTopicProgress,
  type ProgressEntry,
  type RoadmapDetail,
} from '@/lib/endpoints'
import { readPendingProgress, rememberPendingProgress } from '@/lib/progressIntent'
import { useAuthStore } from '@/store/auth'

vi.mock('@/lib/endpoints')

const roadmap: RoadmapDetail = {
  id: 'roadmap-1',
  title: 'Test roadmap',
  description: null,
  slug: 'test-roadmap',
  position: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  userId: null,
  topicCount: 2,
  stageCount: 1,
  metadata: null,
  stages: [
    {
      id: 'stage-1',
      position: 1,
      title: 'Stage one',
      subtitle: null,
      byTheEnd: null,
      weekLabel: null,
      prerequisiteStage: null,
      checkpoints: [],
    },
  ],
  topics: [
    {
      id: 'topic-1',
      title: 'First chapter',
      slug: 'first-chapter',
      description: null,
      position: 1,
      stage: 1,
      difficulty: 'beginner',
      estimatedMinutes: 10,
      metadata: null,
      hasContent: true,
    },
    {
      id: 'topic-2',
      title: 'Second chapter',
      slug: 'second-chapter',
      description: null,
      position: 2,
      stage: 1,
      difficulty: 'beginner',
      estimatedMinutes: 10,
      metadata: null,
      hasContent: true,
    },
  ],
}

let progressEntries: ProgressEntry[] = []

function renderPage(path = '/guidebook/roadmap-1/topic-1') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/guidebook/:roadmapId/:topicId" element={<GuidebookPage />} />
          <Route path="/login" element={<p>Login screen</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('GuidebookPage access', () => {
  beforeEach(() => {
    sessionStorage.clear()
    progressEntries = []
    vi.mocked(getRoadmap).mockResolvedValue(roadmap)
    vi.mocked(getTopicContent).mockResolvedValue('# First chapter\n\nRead me.')
    vi.mocked(getRoadmapProgress).mockImplementation(async () => progressEntries)
    vi.mocked(setTopicProgress).mockImplementation(async (_roadmapId, topicId, status) => {
      const entry = { topicId, status }
      progressEntries = [entry]
      return entry
    })
  })

  it('lets a guest read the first chapter of the first stage', async () => {
    useAuthStore.setState({ status: 'guest', accessToken: null, user: null })

    renderPage()

    expect(await screen.findByRole('heading', { name: 'First chapter' })).toBeInTheDocument()
    expect(await screen.findByText('Read me.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark as done' })).toBeInTheDocument()
    expect(getRoadmapProgress).not.toHaveBeenCalled()
  })

  it('asks a guest to sign in from mark as done and remembers the intent', async () => {
    useAuthStore.setState({ status: 'guest', accessToken: null, user: null })

    renderPage()
    await userEvent.click(await screen.findByRole('button', { name: 'Mark as done' }))

    expect(await screen.findByText('Login screen')).toBeInTheDocument()
    expect(readPendingProgress()).toEqual({
      roadmapId: 'roadmap-1',
      topicId: 'topic-1',
      status: 'done',
    })
  })

  it('redirects a guest away from chapters after the first one', async () => {
    useAuthStore.setState({ status: 'guest', accessToken: null, user: null })

    renderPage('/guidebook/roadmap-1/topic-2')

    expect(await screen.findByText('Login screen')).toBeInTheDocument()
    expect(getTopicContent).not.toHaveBeenCalledWith('roadmap-1', 'topic-2')
  })

  it('completes the pending action after sign-in and shows Done', async () => {
    useAuthStore.setState({
      status: 'authed',
      accessToken: 'token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
        name: 'User',
        role: 'USER',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    })
    rememberPendingProgress({ roadmapId: 'roadmap-1', topicId: 'topic-1', status: 'done' })

    renderPage()

    expect(await screen.findByRole('button', { name: 'Done ✓' })).toBeInTheDocument()
    expect(setTopicProgress).toHaveBeenCalledWith('roadmap-1', 'topic-1', 'done')
  })
})
