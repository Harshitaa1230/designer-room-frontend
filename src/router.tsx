import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/App'
import { HomePage } from '@/pages/HomePage'
import { RoadmapsPage } from '@/pages/RoadmapsPage'
import { RoadmapDetailPage } from '@/pages/RoadmapDetailPage'
import { GuidebookPage } from '@/pages/GuidebookPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AdminPage } from '@/pages/AdminPage'
import { LoginPage } from '@/pages/LoginPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { MfaPage } from '@/pages/MfaPage'
import { WaitlistPage } from '@/pages/WaitlistPage'
import { ComingSoonPage } from '@/pages/ComingSoonPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RequireAdmin, RequireAuth } from '@/components/RequireAuth'
import { WeeksPage } from '@/pages/challenges/WeeksPage'
import { WeekDetailPage } from '@/pages/challenges/WeekDetailPage'
import { ChallengeDetailPage } from '@/pages/challenges/ChallengeDetailPage'
import { AttemptPage } from '@/pages/challenges/AttemptPage'
import { LeaderboardPage } from '@/pages/challenges/LeaderboardPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'roadmaps', element: <RoadmapsPage /> },
      { path: 'challenge', element: <WeeksPage /> },
      { path: 'challenges', element: <WeeksPage /> },
      { path: 'weeks', element: <WeeksPage /> },
      { path: 'weeks/:id', element: <WeekDetailPage /> },
      { path: 'challenges/:id', element: <RequireAuth><ChallengeDetailPage /></RequireAuth> },
      { path: 'attempts/:id', element: <RequireAuth><AttemptPage /></RequireAuth> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'community', element: <ComingSoonPage kind="community" /> },
      {
        path: 'roadmaps/:id',
        element: (
          <RequireAuth>
            <RoadmapDetailPage />
          </RequireAuth>
        ),
      },
      {
        path: 'guidebook/:roadmapId/:topicId',
        element: (
          <RequireAuth>
            <GuidebookPage />
          </RequireAuth>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: 'admin',
        element: (
          <RequireAdmin>
            <AdminPage />
          </RequireAdmin>
        ),
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  { path: '/auth/mfa', element: <MfaPage /> },
  { path: '/waitlist', element: <WaitlistPage /> },
  { path: '*', element: <NotFoundPage /> },
])
