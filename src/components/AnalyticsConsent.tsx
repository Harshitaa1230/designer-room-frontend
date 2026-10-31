import { useState } from 'react'

import { acceptAnalyticsConsent, hasAnalyticsConsent, isAnalyticsAvailable } from '@/lib/analytics'

export function AnalyticsConsent() {
  const [visible, setVisible] = useState(() => isAnalyticsAvailable() && !hasAnalyticsConsent())

  if (!visible) return null

  return (
    <aside
      aria-label="Analytics consent"
      className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[360px]"
    >
      <div className="light:bg-white/95 light:shadow-black/10 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 shadow-2xl">
        <p className="text-[13px] leading-relaxed text-[var(--text-body)]">
          We use analytics cookies from PostHog, Google Analytics, and Cloudflare to understand how
          Designers Room is used and make it better.
        </p>
        <button
          type="button"
          onClick={() => {
            if (acceptAnalyticsConsent()) setVisible(false)
          }}
          className="btn-3d mt-3 w-full px-4 py-2.5 text-sm"
        >
          Accept analytics
        </button>
      </div>
    </aside>
  )
}
