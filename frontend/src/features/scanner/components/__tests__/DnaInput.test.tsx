import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DnaInput } from '../DnaInput'

describe('DnaInput', () => {
  it('renders label and textarea', () => {
    render(<DnaInput value="" onChange={vi.fn()} />)

    expect(screen.getByLabelText('DNA Sequence')).toBeInTheDocument()
  })

  it('shows placeholder with example prefix', () => {
    render(<DnaInput value="" onChange={vi.fn()} />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('placeholder', expect.stringContaining('e.g.'))
  })

  it('calls onChange with mutant example when Try Mutant is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DnaInput value="" onChange={onChange} />)

    await user.click(screen.getByText('Try Mutant'))
    expect(onChange).toHaveBeenCalledWith(expect.stringContaining('ATGCGA'))
  })

  it('calls onChange with human example when Try Human is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DnaInput value="" onChange={onChange} />)

    await user.click(screen.getByText('Try Human'))
    expect(onChange).toHaveBeenCalledWith(expect.stringContaining('TTATTT'))
  })

  it('highlights Try Mutant when value matches mutant example', () => {
    const mutantValue = 'ATGCGA\nCAGTGC\nTTATGT\nAGAAGG\nCCCCTA\nTCACTG'
    render(<DnaInput value={mutantValue} onChange={vi.fn()} />)

    const tryMutant = screen.getByText('Try Mutant')
    expect(tryMutant.className).toContain('text-primary')
  })

  it('highlights Try Human when value matches human example', () => {
    const humanValue = 'ATGCGA\nCAGTGC\nTTATTT\nAGACGG\nGCGTCA\nTCACTG'
    render(<DnaInput value={humanValue} onChange={vi.fn()} />)

    const tryHuman = screen.getByText('Try Human')
    expect(tryHuman.className).toContain('text-primary')
  })

  it('does not highlight either button when value is custom', () => {
    render(<DnaInput value="AAAA\nAAAA\nAAAA\nAAAA" onChange={vi.fn()} />)

    const tryMutant = screen.getByText('Try Mutant')
    const tryHuman = screen.getByText('Try Human')
    expect(tryMutant.className).toContain('text-muted-foreground')
    expect(tryHuman.className).toContain('text-muted-foreground')
  })

  it('disables buttons and textarea when disabled', () => {
    render(<DnaInput value="" onChange={vi.fn()} disabled />)

    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByText('Try Mutant')).toBeDisabled()
    expect(screen.getByText('Try Human')).toBeDisabled()
  })
})
