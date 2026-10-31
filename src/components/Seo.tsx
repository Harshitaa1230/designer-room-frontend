import { useEffect } from 'react'

const DEFAULT_DESCRIPTION = 'Structured design roadmaps, practical theory, portfolio-building challenges, and a community to grow with.'

interface SeoProps {
  title: string
  description?: string
  noindex?: boolean
  type?: 'website' | 'article'
  jsonLd?: Record<string, unknown>
}

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.content = content
}

export function Seo({ title, description = DEFAULT_DESCRIPTION, noindex = false, type = 'website', jsonLd }: SeoProps) {
  useEffect(() => {
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`
    document.title = title
    setMeta('description', description)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', type, 'property')
    setMeta('og:url', canonicalUrl, 'property')
    setMeta('twitter:card', 'summary')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-json-ld]')
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.dataset.seoJsonLd = 'true'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    } else if (script) {
      script.remove()
    }

    return () => script?.remove()
  }, [description, jsonLd, noindex, title, type])

  return null
}

