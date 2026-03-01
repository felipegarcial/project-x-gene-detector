import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCountUp } from '../useCountUp'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useCountUp', () => {
  it('returns target immediately when prefers-reduced-motion is set', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
    } as MediaQueryList)

    const { result } = renderHook(() => useCountUp(100))
    expect(result.current).toBe(100)
  })

  it('starts at 0 and animates to target integer', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
    } as MediaQueryList)

    const { result } = renderHook(() => useCountUp(50, 600))
    expect(result.current).toBe(0)

    await act(async () => {
      vi.advanceTimersByTime(700)
    })

    expect(result.current).toBe(50)
  })

  it('handles decimal targets correctly (ratio like 0.4)', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
    } as MediaQueryList)

    const { result } = renderHook(() => useCountUp(0.4, 600))
    expect(result.current).toBe(0)

    await act(async () => {
      vi.advanceTimersByTime(700)
    })

    expect(result.current).toBe(0.4)
  })

  it('returns 0 for target 0', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
    } as MediaQueryList)

    const { result } = renderHook(() => useCountUp(0))
    expect(result.current).toBe(0)
  })
})
