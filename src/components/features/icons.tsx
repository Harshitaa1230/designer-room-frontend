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

/** Route / winding path icon for Roadmaps. */
export const RouteIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="6" cy="19" r="2.5" />
    <path d="M8.5 19h7a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="17.5" cy="5" r="2.5" />
  </svg>
)

/** Layers icon for Theory (stacked lessons/knowledge). */
export const LayersIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="m12 2 9 4.9-9 4.9-9-4.9Z" />
    <path d="m21 11.5-9 4.9-9-4.9" />
    <path d="m21 16.5-9 4.9-9-4.9" />
  </svg>
)

/** Target icon for Weekly Challenge. */
export const TargetIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
)

/** Flame icon for Progress & Streaks. */
export const FlameIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
  </svg>
)

/** Two overlapping circles (people / union) for Community. */
export const CommunityIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="9" cy="12" r="5.5" />
    <circle cx="15" cy="12" r="5.5" />
  </svg>
)

/** Fountain pen nib for Learn From Me. */
export const PenNibIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 3l4.5 7.2-2.6 6.3h-3.8L7.5 10.2z" />
    <circle cx="12" cy="11.2" r="1.4" />
    <path d="M12 3v6.5" />
    <path d="M10.1 16.5L9 20.5M13.9 16.5l1.1 4" />
  </svg>
)

/** Keep legacy names as aliases if needed for compatibility. */
export const TriangleRulerIcon = RouteIcon
export const CubesIcon = FlameIcon
