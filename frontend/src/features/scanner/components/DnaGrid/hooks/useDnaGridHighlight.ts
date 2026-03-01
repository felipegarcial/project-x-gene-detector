import { useMemo } from 'react'
import type { SequenceCoords, GridState } from '../../../scanner.types'

export function useDnaGridHighlight(state: GridState, sequences: SequenceCoords[]) {
  return useMemo(() => {
    if (state !== 'result') return new Set<string>()
    const set = new Set<string>()
    for (const seq of sequences) {
      for (const [r, c] of seq) {
        set.add(`${r},${c}`)
      }
    }
    return set
  }, [state, sequences])
}
