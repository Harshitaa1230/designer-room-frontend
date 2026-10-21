import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/App'
import { HomePage } from '@/pages/HomePage'
import { RoadmapsPage } from '@/pages/RoadmapsPage'
import { RoadmapDetailPage } from '@/pages/RoadmapDetailPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AdminPage } from '@/pages/AdminPage'
import { LoginPage } from '@/pages/LoginPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { MfaPage } from '@/pages/MfaPage'
import { WaitlistPage } from '@/pages/WaitlistPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RequireAdmin, RequireAuth } from '@/components/RequireAuth'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'roadmaps', element: <RoadmapsPage /> },
      {
        path: 'roadmaps/:id',
        element: (
          <RequireAuth>
            <RoadmapDetailPage />
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
