import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from '../StatCard'

describe('StatCard', () => {
  it('renders label and display value', () => {
    render(<StatCard label="Mutant DNA" displayValue={42} />)

    expect(screen.getByText('Mutant DNA')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('applies primary accent class to the value', () => {
    render(<StatCard label="Mutant DNA" displayValue={10} accent="primary" />)

    const value = screen.getByText('10')
    expect(value.className).toContain('text-primary')
  })

  it('applies secondary accent class to the value', () => {
    render(<StatCard label="Human DNA" displayValue={20} accent="secondary" />)

    const value = screen.getByText('20')
    expect(value.className).toContain('text-accent')
  })

  it('applies default foreground class when no accent', () => {
    render(<StatCard label="Ratio" displayValue={5} />)

    const value = screen.getByText('5')
    expect(value.className).toContain('text-foreground')
  })
})
