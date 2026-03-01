import { useRef, useEffect } from 'react'
import { animate, createTimeline, stagger } from 'animejs'

const CX = 200
const CY = 200
const TICK_COUNT = 72
const TICK_RING_R = 165
const ORIGIN = `${CX}px ${CY}px`

const RINGS = [
  { r: 180, color: 'url(#grad-outer)', width: 3, group: 'ring-outer' },
  { r: 150, color: 'url(#grad-middle)', width: 2, group: 'ring-middle' },
  { r: 120, color: 'url(#grad-inner)', width: 2, group: 'ring-inner' },
]

/**
 * Cerebro Hero — animated SVG inspired by X-Men's Cerebro machine.
 *
 * On mount: rings draw in, tick marks stagger from center, center pulses.
 * Continuously: rings rotate at different speeds, center glows.
 */
export function CerebroHero() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // --- Intro sequence ---
    const tl = createTimeline({ defaults: { ease: 'outExpo' } })

    // Draw rings (stroke-dashoffset → 0)
    tl.add('.ring-circle', {
      strokeDashoffset: [2 * Math.PI * 180, 0],
      opacity: [0, 1],
      duration: 2000,
      delay: stagger(200),
    }, 0)

    // Stagger ticks from center
    tl.add('.tick', {
      opacity: [0, 0.8],
      scaleY: [0, 1],
      duration: 600,
      delay: stagger(15, { from: 'center' }),
    }, 500)

    // Center glow fade in
    tl.add('.center-glow', {
      opacity: [0, 0.6],
      scale: [0.5, 1],
      duration: 1200,
    }, 800)

    // --- Continuous rotations ---
    animate('.ring-outer', {
      rotate: [0, 360],
      duration: 30000,
      loop: true,
      ease: 'linear',
    })

    animate('.ring-inner', {
      rotate: [0, -360],
      duration: 45000,
      loop: true,
      ease: 'linear',
    })

    animate('.ring-middle', {
      rotate: [0, 360],
      duration: 60000,
      loop: true,
      ease: 'linear',
    })

    // Center pulse
    animate('.center-glow', {
      opacity: [0.4, 0.7],
      scale: [0.95, 1.05],
      duration: 2000,
      loop: true,
      alternate: true,
      ease: 'inOutSine',
    })
  }, [])

  return (
    <div className="flex items-center justify-center py-6">
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="w-64 h-64 sm:w-80 sm:h-80"
      >
        <defs>
          <linearGradient id="grad-outer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="25%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="grad-middle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="grad-inner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="grad-center">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center glow */}
        <circle
          className="center-glow"
          cx={CX} cy={CY} r={60}
          fill="url(#grad-center)"
          opacity={0}
          style={{ transformOrigin: ORIGIN }}
        />

        {/* Rings */}
        {RINGS.map(({ r, color, width, group }) => {
          const circ = 2 * Math.PI * r
          return (
            <g key={r} className={group} style={{ transformOrigin: ORIGIN }}>
              <circle
                className="ring-circle"
                cx={CX} cy={CY} r={r}
                fill="none"
                stroke={color}
                strokeWidth={width}
                strokeDasharray={circ}
                strokeDashoffset={circ}
                opacity={0}
              />
            </g>
          )
        })}

        {/* Tick marks */}
        <g className="ring-middle" style={{ transformOrigin: ORIGIN }}>
          {Array.from({ length: TICK_COUNT }).map((_, i) => {
            const angle = (i / TICK_COUNT) * Math.PI * 2 - Math.PI / 2
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            const x1 = CX + cos * (TICK_RING_R - 6)
            const y1 = CY + sin * (TICK_RING_R - 6)
            const x2 = CX + cos * (TICK_RING_R + 6)
            const y2 = CY + sin * (TICK_RING_R + 6)
            const mx = (x1 + x2) / 2
            const my = (y1 + y2) / 2
            return (
              <line
                key={i}
                className="tick"
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#14b8a6"
                strokeWidth={1.5}
                opacity={0}
                style={{ transformOrigin: `${mx}px ${my}px` }}
              />
            )
          })}
        </g>

        {/* Center dot */}
        <circle cx={CX} cy={CY} r={3} fill="#14b8a6" opacity={0.8} />
      </svg>
    </div>
  )
}
