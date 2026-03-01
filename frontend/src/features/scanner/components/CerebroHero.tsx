import { useRef, useEffect, useMemo } from 'react'
import { animate, createTimeline, stagger } from 'animejs'

const CX = 200
const CY = 200
const TICK_COUNT = 72
const TICK_RING_R = 155
const ORIGIN = `${CX}px ${CY}px`

/**
 * Outer ring segments — arcs with gaps, like the reference image.
 * Colors read from CSS --color-hero variable at render time.
 */
const OUTER_R = 185
const OUTER_WIDTH = 8
const SEGMENT_COUNT = 5
const GAP_DEG = 8
const SEG_LENGTH = (360 - SEGMENT_COUNT * GAP_DEG) / SEGMENT_COUNT // ~64 deg each

/** Read hero palette from CSS custom properties */
function getHeroColors() {
  const style = getComputedStyle(document.documentElement)
  return {
    primary: style.getPropertyValue('--color-hero').trim() || '#d946ef',
    secondary: style.getPropertyValue('--color-hero-secondary').trim() || '#a855f7',
  }
}

/** Convert degrees + arc length to strokeDasharray/offset for a circle arc. */
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

/**
 * Cerebro Hero — animated SVG inspired by X-Men's Cerebro machine.
 *
 * Outer ring: segmented red arcs (Magneto crimson) with gaps — thick.
 * Middle ring: thin continuous ring with tick marks.
 * Inner ring: thin continuous ring.
 * Center: radial glow pulse.
 */
interface CerebroHeroProps {
  className?: string
}

export function CerebroHero({ className = 'w-64 h-64 sm:w-80 sm:h-80' }: CerebroHeroProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const colors = useMemo(() => getHeroColors(), [])

  const segments = useMemo(() =>
    Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
      start: i * (SEG_LENGTH + GAP_DEG),
      length: SEG_LENGTH,
      color: colors.primary,
    })), [colors.primary])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // Scope selectors to this SVG instance to avoid cross-component collision
    const $  = (sel: string) => svg.querySelectorAll(sel)

    // --- Intro sequence ---
    const tl = createTimeline({ defaults: { ease: 'outExpo' } })

    tl.add($('.seg'), {
      opacity: [0, 1],
      duration: 1500,
      delay: stagger(100),
    }, 0)

    tl.add($('.ring-circle'), {
      strokeDashoffset: [2 * Math.PI * 150, 0],
      opacity: [0, 1],
      duration: 2000,
      delay: stagger(200),
    }, 200)

    tl.add($('.tick'), {
      opacity: [0, 0.7],
      scaleY: [0, 1],
      duration: 600,
      delay: stagger(15, { from: 'center' }),
    }, 500)

    tl.add($('.center-glow'), {
      opacity: [0, 0.6],
      scale: [0.5, 1],
      duration: 1200,
    }, 800)

    // --- Continuous rotations ---
    const loops = [
      animate($('.ring-outer'), {
        rotate: [0, 360],
        duration: 30000,
        loop: true,
        ease: 'linear',
      }),
      animate($('.ring-middle'), {
        rotate: [0, -360],
        duration: 50000,
        loop: true,
        ease: 'linear',
      }),
      animate($('.ring-inner'), {
        rotate: [0, 360],
        duration: 70000,
        loop: true,
        ease: 'linear',
      }),
      animate($('.center-glow'), {
        opacity: [0.4, 0.7],
        scale: [0.95, 1.05],
        duration: 2000,
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      }),
    ]

    // Cleanup: pause all animations when unmounting
    return () => {
      tl.pause()
      loops.forEach((a) => a.pause())
    }
  }, [colors, segments])

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

        {/* Center glow */}
        <circle
          className="center-glow"
          cx={CX} cy={CY} r={60}
          fill="url(#grad-center)"
          opacity={0}
          style={{ transformOrigin: ORIGIN }}
        />

        {/* Outer ring — segmented arcs */}
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

        {/* Middle ring — continuous thin + tick marks */}
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
          {/* Tick marks */}
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

        {/* Inner ring — continuous thin */}
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

        {/* Center dot */}
        <circle cx={CX} cy={CY} r={3} fill={colors.primary} opacity={0.8} filter="url(#glow)" />
      </svg>
    </div>
  )
}
