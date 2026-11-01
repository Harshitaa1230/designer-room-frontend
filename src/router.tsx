import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/App'
import { RequireAdmin, RequireAuth } from '@/components/RequireAuth'

const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })))
const RoadmapsPage = lazy(() => import('@/pages/RoadmapsPage').then((module) => ({ default: module.RoadmapsPage })))
const RoadmapDetailPage = lazy(() => import('@/pages/RoadmapDetailPage').then((module) => ({ default: module.RoadmapDetailPage })))
const GuidebookPage = lazy(() => import('@/pages/GuidebookPage').then((module) => ({ default: module.GuidebookPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const AdminPage = lazy(() => import('@/pages/AdminPage').then((module) => ({ default: module.AdminPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage').then((module) => ({ default: module.AuthCallbackPage })))
const MfaPage = lazy(() => import('@/pages/MfaPage').then((module) => ({ default: module.MfaPage })))
const ComingSoonPage = lazy(() => import('@/pages/ComingSoonPage').then((module) => ({ default: module.ComingSoonPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const WeeksPage = lazy(() => import('@/pages/challenges/WeeksPage').then((module) => ({ default: module.WeeksPage })))
const WeekDetailPage = lazy(() => import('@/pages/challenges/WeekDetailPage').then((module) => ({ default: module.WeekDetailPage })))
const ChallengeDetailPage = lazy(() => import('@/pages/challenges/ChallengeDetailPage').then((module) => ({ default: module.ChallengeDetailPage })))
const AttemptPage = lazy(() => import('@/pages/challenges/AttemptPage').then((module) => ({ default: module.AttemptPage })))
const LeaderboardPage = lazy(() => import('@/pages/challenges/LeaderboardPage').then((module) => ({ default: module.LeaderboardPage })))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'guidebook', element: <RoadmapsPage /> },
      { path: 'challenge', element: <WeeksPage /> },
      { path: 'challenge/week/:id', element: <WeekDetailPage /> },
      { path: 'challenge/:id', element: <RequireAuth><ChallengeDetailPage /></RequireAuth> },
      { path: 'attempts/:id', element: <RequireAuth><AttemptPage /></RequireAuth> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'community', element: <ComingSoonPage kind="community" /> },
      {
        path: 'guidebook/:id',
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
  { path: '*', element: <NotFoundPage /> },
])
