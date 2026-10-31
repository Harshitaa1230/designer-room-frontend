import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { AnalyticsNotice } from '@/components/AnalyticsNotice'
import { SessionLoader } from '@/components/SessionLoader'
import { initAnalytics, trackPageView } from '@/lib/analytics'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/router'

import './index.css'

initAnalytics()
trackPageView(router.state.location)
router.subscribe((state) => trackPageView(state.location))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionLoader />
    <AnalyticsNotice />
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-page)]" aria-hidden="true" />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>,
)
