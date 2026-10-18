import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
}

/**
 * Returns [ref, inView] where inView latches to true once the element
 * crosses the threshold and never resets (plays once).
 * Defaults to final-state (true) when IntersectionObserver is unavailable.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {},
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.25, rootMargin = '0px 0px -40px 0px' } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, inView]
}
