interface RoadmapNode {
  x: number
  y: number
  label: string
  state: 'done' | 'current' | 'upcoming'
  anchor: 'start' | 'middle' | 'end'
}

const NODES: RoadmapNode[] = [
  { x: 60, y: 270, label: 'Design basics', state: 'done', anchor: 'start' },
  { x: 150, y: 215, label: 'Typography', state: 'done', anchor: 'middle' },
  { x: 240, y: 165, label: 'Color', state: 'current', anchor: 'middle' },
  { x: 330, y: 110, label: 'Layout', state: 'upcoming', anchor: 'middle' },
  { x: 410, y: 60, label: 'UI patterns', state: 'upcoming', anchor: 'end' },
]

const COMPLETED_PATH = 'M 60 270 C 92 270 118 215 150 215 C 182 215 208 165 240 165'
const UPCOMING_PATH = 'M 240 165 C 272 165 298 110 330 110 C 358 110 382 60 410 60'

export const RoadmapPreview = () => (
  <svg
    viewBox="0 0 460 340"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    overflow="visible"
    className="block h-full min-h-[380px] w-full min-w-0"
    role="img"
    aria-labelledby="roadmap-title roadmap-description"
  >
    <title id="roadmap-title">Design learning roadmap</title>
    <desc id="roadmap-description">
      Five steps from Design basics and Typography completed, Color in progress, then Layout and UI
      patterns upcoming.
    </desc>

    <path
      d={UPCOMING_PATH}
      fill="none"
      stroke="#8a8a8a"
      strokeOpacity="0.65"
      strokeWidth="3"
      strokeDasharray="7 8"
      strokeLinecap="round"
    />
    <path
      d={COMPLETED_PATH}
      fill="none"
      stroke="#f97316"
      strokeWidth="3.5"
      strokeLinecap="round"
    />

    {NODES.map((node) => {
      const isDone = node.state === 'done'
      const isCurrent = node.state === 'current'
      const isUpcoming = node.state === 'upcoming'

      return (
        <g key={node.label}>
          {isCurrent && (
            <>
              <circle cx={node.x} cy={node.y} r="15" fill="#f97316" opacity="0.15" />
              <circle cx={node.x} cy={node.y} r="10" fill="none" stroke="#f97316" strokeWidth="2" />
            </>
          )}
          <circle
            cx={node.x}
            cy={node.y}
            r={isCurrent ? 5 : 6}
            fill={isDone ? '#f97316' : isCurrent ? '#171717' : 'none'}
            stroke={isUpcoming ? '#8a8a8a' : '#f97316'}
            strokeOpacity={isUpcoming ? 0.75 : 1}
            strokeWidth={isUpcoming ? 2 : 1.5}
          />
          <text
            x={node.x}
            y={node.y + 22}
            dx={node.anchor === 'start' ? 14 : node.anchor === 'end' ? -14 : 0}
            textAnchor={node.anchor === 'middle' ? 'middle' : node.anchor}
            fontSize="25"
            fontWeight={isCurrent ? 600 : 500}
            fill={isUpcoming ? '#8a8a8a' : '#ffffff'}
            stroke="#171717"
            strokeWidth="4"
            strokeLinejoin="round"
            paintOrder="stroke"
          >
            {node.label}
          </text>
          {isCurrent && (
            <g aria-hidden="true">
              <path d={`M ${node.x - 5} ${node.y - 20} L ${node.x} ${node.y - 10} L ${node.x + 5} ${node.y - 20}`} fill="#f97316" />
              <rect x={node.x - 73} y={node.y - 50} width="146" height="28" rx="14" fill="#f97316" />
              <text
                x={node.x}
                y={node.y - 32}
                textAnchor="middle"
                fontSize="23"
                fontWeight="600"
                fill="#171717"
              >
                You are here
              </text>
            </g>
          )}
        </g>
      )
    })}
  </svg>
)
