/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_WHATSAPP_LINK?: string
  readonly VITE_ANALYTICS_ENABLED?: string
  readonly VITE_POSTHOG_KEY?: string
  readonly VITE_POSTHOG_HOST?: string
  readonly VITE_GA4_ID?: string
  readonly VITE_CLOUDFLARE_ANALYTICS_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
