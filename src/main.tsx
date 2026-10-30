import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { SessionLoader } from '@/components/SessionLoader'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/router'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionLoader />
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
