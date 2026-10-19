import { useEffect, useRef } from 'react'

import { NeatGradient } from '@firecms/neat'

import { gradientConfig } from '@/lib/gradientConfig'

// TODO: license NEAT or swap to custom gradient — without a licenseKey the
// unlicensed build draws a watermark on the canvas (not bypassed on purpose).
export const GradientBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Render a single static frame when the user prefers reduced motion.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const gradient = new NeatGradient({
      ref: canvas,
      ...gradientConfig,
      speed: reducedMotion ? 0 : gradientConfig.speed,
      // Cap the drawing buffer at 2× CSS size (devicePixelRatio clamp).
      renderScale: Math.min(window.devicePixelRatio || 1, 2),
    })

    // NOTE: the library already pauses its rAF loop via an internal
    // IntersectionObserver when the canvas is offscreen or the tab is hidden.

    const handleScroll = () => {
      gradient.yOffset = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      gradient.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="gradient"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
