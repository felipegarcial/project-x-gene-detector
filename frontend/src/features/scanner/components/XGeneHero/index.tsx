import { useXGeneAnimation } from './hooks/useXGeneAnimation'

const CX = 200
const CY = 200
const TICK_COUNT = 72
const TICK_RING_R = 155
const ORIGIN = `${CX}px ${CY}px`

const OUTER_R = 185
const OUTER_WIDTH = 8

function arcProps(r: number, startDeg: number, lengthDeg: number) {
  const circ = 2 * Math.PI * r
  const dashLen = (lengthDeg / 360) * circ
  const gapLen = circ - dashLen
  const offset = -(startDeg / 360) * circ
  return {
    strokeDasharray: `${dashLen} ${gapLen}`,
    strokeDashoffset: offset,
  }
}

interface XGeneHeroProps {
  className?: string
}

export function XGeneHero({ className = 'w-64 h-64 sm:w-80 sm:h-80' }: XGeneHeroProps) {
  const { svgRef, colors, segments } = useXGeneAnimation()

  return (
    <div className="flex items-center justify-center">
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="grad-mid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="grad-inner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.secondary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="grad-center">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          className="center-glow"
          cx={CX} cy={CY} r={60}
          fill="url(#grad-center)"
          opacity={0}
          style={{ transformOrigin: ORIGIN }}
        />

        <g className="ring-outer" style={{ transformOrigin: ORIGIN }} filter="url(#glow)">
          {segments.map((seg, i) => {
            const { strokeDasharray, strokeDashoffset } = arcProps(OUTER_R, seg.start, seg.length)
            return (
              <circle
                key={i}
                className="seg"
                cx={CX} cy={CY} r={OUTER_R}
                fill="none"
                stroke={seg.color}
                strokeWidth={OUTER_WIDTH}
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                opacity={0}
              />
            )
          })}
        </g>

        <g className="ring-middle" style={{ transformOrigin: ORIGIN }} filter="url(#glow)">
          <circle
            className="ring-circle"
            cx={CX} cy={CY} r={150}
            fill="none"
            stroke="url(#grad-mid)"
            strokeWidth={1.5}
            strokeDasharray={2 * Math.PI * 150}
            strokeDashoffset={2 * Math.PI * 150}
            opacity={0}
          />
          {Array.from({ length: TICK_COUNT }).map((_, i) => {
            const angle = (i / TICK_COUNT) * Math.PI * 2 - Math.PI / 2
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            const x1 = CX + cos * (TICK_RING_R - 5)
            const y1 = CY + sin * (TICK_RING_R - 5)
            const x2 = CX + cos * (TICK_RING_R + 5)
            const y2 = CY + sin * (TICK_RING_R + 5)
            const mx = (x1 + x2) / 2
            const my = (y1 + y2) / 2
            return (
              <line
                key={i}
                className="tick"
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={colors.primary}
                strokeWidth={1}
                opacity={0}
                style={{ transformOrigin: `${mx}px ${my}px` }}
              />
            )
          })}
        </g>

        <g className="ring-inner" style={{ transformOrigin: ORIGIN }} filter="url(#glow)">
          <circle
            className="ring-circle"
            cx={CX} cy={CY} r={120}
            fill="none"
            stroke="url(#grad-inner)"
            strokeWidth={1}
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120}
            opacity={0}
          />
        </g>

        <circle cx={CX} cy={CY} r={3} fill={colors.primary} opacity={0.8} filter="url(#glow)" />
      </svg>
    </div>
  )
}
