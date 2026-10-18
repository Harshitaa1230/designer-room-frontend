import { useEffect, useRef, useState } from 'react'

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

/**
 * Counts from 0 to `target` over `duration` ms using easeOutCubic,
 * starting when `active` becomes true.
 * Returns the current display value as a string.
 * Honours prefers-reduced-motion: if motion is reduced, returns the target immediately.
 */
export function useCountUp(target: number, duration: number, active: boolean): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!active) return

    // Reduced-motion: jump to final value immediately
    if (prefersReduced) {
      setValue(target)
      return
    }

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.round(easeOutCubic(progress) * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      startRef.current = null
    }
  }, [active, target, duration, prefersReduced])

  return value
}
