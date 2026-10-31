import { useEffect, useState } from 'react'

import { isAnalyticsAvailable } from '@/lib/analytics'

const NOTICE_DISMISSED_KEY = 'designers-room:analytics-notice-dismissed'
const NOTICE_DURATION_MS = 8000

function shouldShowNotice(): boolean {
  if (!isAnalyticsAvailable()) return false
  try {
    return localStorage.getItem(NOTICE_DISMISSED_KEY) !== 'true'
  } catch {
    return true
  }
}

export function AnalyticsNotice() {
  const [visible, setVisible] = useState(shouldShowNotice)

  useEffect(() => {
    if (!visible) return

    const timer = setTimeout(() => {
      setVisible(false)
      try {
        localStorage.setItem(NOTICE_DISMISSED_KEY, 'true')
      } catch {
        // Non-fatal: the notice may show again on the next visit.
      }
    }, NOTICE_DURATION_MS)

    return () => clearTimeout(timer)
  }, [visible])

  if (!visible) return null

  return (
    <aside
      aria-label="Analytics notice"
      role="status"
      className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[360px]"
    >
      <div className="light:bg-white/95 light:shadow-black/10 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 shadow-2xl">
        <p className="text-[13px] leading-relaxed text-[var(--text-body)]">
          We use analytics cookies from PostHog, Google Analytics, and Cloudflare to understand how
          Designers Room is used and make it better. You can block them in your browser settings.
        </p>
      </div>
    </aside>
  )
}
