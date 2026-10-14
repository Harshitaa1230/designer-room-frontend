interface RoadmapNode {
  x: number
  y: number
  label: string
  labelY: number
  state: 'done' | 'current' | 'next' | 'todo'
}

const NODES: RoadmapNode[] = [
  { x: 50, y: 115, label: 'Design basics', labelY: 148, state: 'done' },
  { x: 145, y: 55, label: 'Typography', labelY: 30, state: 'done' },
  { x: 240, y: 125, label: 'Color', labelY: 158, state: 'current' },
  { x: 335, y: 55, label: 'Layout', labelY: 30, state: 'next' },
  { x: 430, y: 115, label: 'UI patterns', labelY: 148, state: 'todo' },
]

const FULL_PATH =
  'M 50 115 C 80 115, 115 55, 145 55 C 175 55, 210 125, 240 125 C 270 125, 305 55, 335 55 C 365 55, 400 115, 430 115'
const DONE_PATH =
  'M 50 115 C 80 115, 115 55, 145 55 C 175 55, 210 125, 240 125'
const NEXT_PATH = 'M 240 125 C 270 125, 305 55, 335 55'

export const RoadmapPreview = () => (
  <svg
    viewBox="0 0 480 180"
    preserveAspectRatio="xMidYMid meet"
    className="h-full w-full"
    role="img"
    aria-label="Roadmap path with Design basics and Typography complete, Color in progress, Layout up next"
  >
    <defs>
      <linearGradient id="roadmap-done" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
    </defs>

    {/* base track */}
    <path d={FULL_PATH} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />

    {/* completed segment */}
    <path
      d={DONE_PATH}
      fill="none"
      stroke="url(#roadmap-done)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* segment drawn on hover */}
    <path
      d={NEXT_PATH}
      fill="none"
      stroke="#f97316"
      strokeWidth="2.5"
      strokeLinecap="round"
      pathLength={1}
      className="roadmap-progress"
    />

    {NODES.map((node) => {
      const isDone = node.state === 'done'
      const isCurrent = node.state === 'current'
      const isNext = node.state === 'next'

      return (
        <g key={node.label}>
          {isCurrent && (
            <circle cx={node.x} cy={node.y} r="8" fill="#f97316" className="roadmap-pulse" />
          )}

          <circle
            cx={node.x}
            cy={node.y}
            r={isCurrent ? 6.5 : 5.5}
            className={isNext ? 'roadmap-next-fill' : undefined}
            fill={isDone || isCurrent ? '#f97316' : 'transparent'}
            stroke={isDone || isCurrent ? '#f97316' : 'rgba(251,146,60,0.55)'}
            strokeWidth="1.5"
          />

          {(isDone || isCurrent) && <circle cx={node.x} cy={node.y} r="2" fill="#171717" />}

          <text
            x={node.x}
            y={node.labelY}
            textAnchor="middle"
            fontSize="11.5"
            fontWeight={isCurrent ? 600 : 500}
            fill={isDone || isCurrent ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)'}
            stroke="#171717"
            strokeWidth="3.5"
            paintOrder="stroke"
          >
            {node.label}
          </text>
        </g>
      )
    })}
  </svg>
)
