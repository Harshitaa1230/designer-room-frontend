import { NeatGradient } from '@firecms/neat'
import { useEffect, useRef } from 'react'

import { gradientConfig } from '@/lib/gradientConfig'

export const GradientBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gradient = new NeatGradient({
      ref: canvas,
      ...gradientConfig,
    })

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
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
