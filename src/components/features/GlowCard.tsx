import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import './bento.css'

interface GlowCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Reveal state driven by the section's IntersectionObserver. */
  revealed?: boolean
  /** Stagger delay in ms for the entrance. */
  delay?: number
  /** Set false for the Community tile: keeps the tile but drops the cursor glow. */
  glow?: boolean
}

/**
 * Bento tile wrapper. Tracks the cursor and writes --mx/--my straight to the
 * DOM node so mousemove never triggers a React re-render.
 */
export const GlowCard = ({
  children,
  className,
  style,
  revealed = true,
  delay = 0,
  glow = true,
}: GlowCardProps) => {
  const ref = useRef<HTMLElement>(null)

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!glow) return
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    node.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <article
      ref={ref}
      onPointerMove={handlePointerMove}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
      className={cn(
        'bento-tile group',
        glow && 'bento-tile--glow',
        revealed ? 'bento-enter' : 'is-hidden',
        className,
      )}
    >
      {glow && (
        <>
          <div className="bento-glow" aria-hidden="true" />
          <div className="bento-border" aria-hidden="true" />
        </>
      )}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </article>
  )
}
