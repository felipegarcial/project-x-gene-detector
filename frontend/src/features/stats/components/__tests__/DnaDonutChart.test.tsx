import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DnaDonutChart } from '../DnaDonutChart'

describe('DnaDonutChart', () => {
  it('shows "No data" when both values are 0', () => {
    render(<DnaDonutChart mutant={0} human={0} />)

    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('shows percentage and labels when data is present', () => {
    render(<DnaDonutChart mutant={50} human={50} />)

    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('mutant')).toBeInTheDocument()
  })

  it('shows 100% when all DNA is mutant', () => {
    render(<DnaDonutChart mutant={10} human={0} />)

    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('shows 0% when no DNA is mutant', () => {
    render(<DnaDonutChart mutant={0} human={10} />)

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders legend with counts', () => {
    render(<DnaDonutChart mutant={3} human={7} />)

    expect(screen.getByText('Mutant DNA (3)')).toBeInTheDocument()
    expect(screen.getByText('Human DNA (7)')).toBeInTheDocument()
  })
})
