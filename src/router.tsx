import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/App'
import { HomePage } from '@/pages/HomePage'
import { RoadmapsPage } from '@/pages/RoadmapsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'roadmaps', element: <RoadmapsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
