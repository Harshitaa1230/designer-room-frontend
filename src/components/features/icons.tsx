interface IconProps {
  className?: string
}

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

/** Set-square / triangle ruler. */
export const TriangleRulerIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M3 20.5h17.5L3 3z" />
    <path d="M7.5 16.5h7L7.5 9.5z" strokeDasharray="1.6 1.6" />
    <path d="M6 20.5v-1.6M9.5 20.5v-1.6M13 20.5v-1.6M16.5 20.5v-1.6" />
    <path d="M3 9.5h1.6M3 13h1.6M3 16.5h1.6" />
  </svg>
)

/** Fountain pen nib. */
export const PenNibIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 3l4.5 7.2-2.6 6.3h-3.8L7.5 10.2z" />
    <circle cx="12" cy="11.2" r="1.4" />
    <path d="M12 3v6.5" />
    <path d="M10.1 16.5L9 20.5M13.9 16.5l1.1 4" />
  </svg>
)

/** Stacked isometric cubes. */
export const CubesIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M14.5 3.5l6 3.4v6.8l-6 3.4-6-3.4V6.9z" />
    <path d="M8.5 6.9l6 3.4 6-3.4M14.5 10.3v6.8" />
    <path d="M3.5 13.5l4.5 2.6v5.1l-4.5-2.6z" />
  </svg>
)
