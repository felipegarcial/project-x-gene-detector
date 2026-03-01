import { useRef, useMemo, useEffect } from 'react'
import { animate, createTimeline, stagger } from 'animejs'

const SEGMENT_COUNT = 5
const GAP_DEG = 8
const SEG_LENGTH = (360 - SEGMENT_COUNT * GAP_DEG) / SEGMENT_COUNT

interface HeroColors {
  primary: string
  secondary: string
}

interface Segment {
  start: number
  length: number
  color: string
}

function getHeroColors(): HeroColors {
  const style = getComputedStyle(document.documentElement)
  return {
    primary: style.getPropertyValue('--color-hero').trim() || '#d946ef',
    secondary: style.getPropertyValue('--color-hero-secondary').trim() || '#a855f7',
  }
}

export function useXGeneAnimation() {
  const svgRef = useRef<SVGSVGElement>(null)
  const colors = useMemo(() => getHeroColors(), [])

  const segments: Segment[] = useMemo(
    () =>
      Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
        start: i * (SEG_LENGTH + GAP_DEG),
        length: SEG_LENGTH,
        color: colors.primary,
      })),
    [colors.primary],
  )

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const $ = (sel: string) => svg.querySelectorAll(sel)

    const tl = createTimeline({ defaults: { ease: 'outExpo' } })

    tl.add(
      $('.seg'),
      {
        opacity: [0, 1],
        duration: 1500,
        delay: stagger(100),
      },
      0,
    )

    tl.add(
      $('.ring-circle'),
      {
        strokeDashoffset: [2 * Math.PI * 150, 0],
        opacity: [0, 1],
        duration: 2000,
        delay: stagger(200),
      },
      200,
    )

    tl.add(
      $('.tick'),
      {
        opacity: [0, 0.7],
        scaleY: [0, 1],
        duration: 600,
        delay: stagger(15, { from: 'center' }),
      },
      500,
    )

    tl.add(
      $('.center-glow'),
      {
        opacity: [0, 0.6],
        scale: [0.5, 1],
        duration: 1200,
      },
      800,
    )

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

    return () => {
      tl.pause()
      loops.forEach((a) => a.pause())
    }
  }, [colors])

  return { svgRef, colors, segments }
}
