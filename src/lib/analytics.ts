import type { PostHog } from 'posthog-js'

import { useAuthStore, type UserProfile } from '@/store/auth'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY?.trim() ?? ''
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com'
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_ID?.trim() ?? ''
const CLOUDFLARE_ANALYTICS_TOKEN = import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN?.trim() ?? ''

const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED === 'true'
const IDENTIFIED_USER_KEY = 'designers-room:analytics-user'

const hasProvider = Boolean(POSTHOG_KEY || GA4_MEASUREMENT_ID || CLOUDFLARE_ANALYTICS_TOKEN)

export interface PageLocation {
  pathname: string
  search?: string
}

interface PageView {
  path: string
  url: string
}

let initialized = false
let posthog: PostHog | null = null
let posthogReady: Promise<void> = Promise.resolve()
let pendingPageView: PageView | null = null
let lastTrackedUrl: string | null = null

export function isAnalyticsAvailable(): boolean {
  return ANALYTICS_ENABLED && hasProvider
}

export function initAnalytics(): void {
  if (initialized || !isAnalyticsAvailable()) return
  initialized = true

  initGA4()
  initCloudflare()

  if (POSTHOG_KEY) posthogReady = loadPostHog()

  void posthogReady.then(() => {
    syncUser(useAuthStore.getState().user)
    useAuthStore.subscribe((state, previous) => {
      if (state.user !== previous.user) syncUser(state.user)
    })
  })

  if (pendingPageView) {
    const view = pendingPageView
    pendingPageView = null
    sendPageView(view)
  }
}

export function trackPageView(location: PageLocation): void {
  const view = toPageView(location)
  if (!initialized) {
    pendingPageView = view
    return
  }
  sendPageView(view)
}

export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (!initialized) return

  if (GA4_MEASUREMENT_ID) {
    window.gtag?.('event', name, properties)
  }

  if (POSTHOG_KEY) {
    void posthogReady.then(() => posthog?.capture(name, properties))
  }
}

function toPageView({ pathname, search = '' }: PageLocation): PageView {
  const path = `${pathname}${search}`
  return { path, url: `${window.location.origin}${path}` }
}

function sendPageView({ path, url }: PageView): void {
  if (lastTrackedUrl === url) return
  lastTrackedUrl = url

  if (GA4_MEASUREMENT_ID) {
    window.gtag?.('event', 'page_view', {
      page_path: path,
      page_location: url,
    })
  }

  if (POSTHOG_KEY) {
    void posthogReady.then(() => {
      posthog?.capture('$pageview', {
        $current_url: url,
        path,
      })
    })
  }
}

function initGA4(): void {
  if (!GA4_MEASUREMENT_ID) return

  window.dataLayer = window.dataLayer ?? []
  window.gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args)
    })

  window.gtag('js', new Date())
  window.gtag('config', GA4_MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`
  document.head.appendChild(script)
}

function initCloudflare(): void {
  if (!CLOUDFLARE_ANALYTICS_TOKEN) return
  if (document.querySelector('script[data-cf-beacon]')) return

  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  script.setAttribute(
    'data-cf-beacon',
    JSON.stringify({ token: CLOUDFLARE_ANALYTICS_TOKEN, spa: true }),
  )
  document.head.appendChild(script)
}

async function loadPostHog(): Promise<void> {
  try {
    const { default: client } = await import('posthog-js')
    client.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      person_profiles: 'identified_only',
      persistence: 'localStorage+cookie',
    })
    posthog = client
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[analytics] PostHog failed to load', error)
    }
  }
}

function syncUser(user: UserProfile | null): void {
  if (posthog) {
    if (user) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
      })
      rememberIdentifiedUser(user.id)
    } else if (readIdentifiedUser() !== null) {
      // Only reset when a real user signed out; resetting on every anonymous
      // page load would create a new PostHog person each visit.
      posthog.reset()
      rememberIdentifiedUser(null)
    }
  }

  if (GA4_MEASUREMENT_ID) {
    window.gtag?.('set', { user_id: user?.id ?? null })
  }
}

function readIdentifiedUser(): string | null {
  try {
    return localStorage.getItem(IDENTIFIED_USER_KEY)
  } catch {
    return null
  }
}

function rememberIdentifiedUser(userId: string | null): void {
  try {
    if (userId) localStorage.setItem(IDENTIFIED_USER_KEY, userId)
    else localStorage.removeItem(IDENTIFIED_USER_KEY)
  } catch {
    // Non-fatal: analytics identity is best-effort.
  }
}
