import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiFetch, ApiError } from '../api'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
  mockFetch.mockReset()
})

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('apiFetch', () => {
  it('returns data and status for a successful response', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ is_mutant: true }, 200))

    const result = await apiFetch('/mutant', {
      method: 'POST',
      body: JSON.stringify({ dna: ['ATGCGA'] }),
    })

    expect(result.data).toEqual({ is_mutant: true })
    expect(result.status).toBe(200)
  })

  it('treats 403 as valid when included in validStatuses', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ is_mutant: false }, 403))

    const result = await apiFetch('/mutant', {
      method: 'POST',
      body: JSON.stringify({ dna: ['ATGCGA'] }),
      validStatuses: [403],
    })

    expect(result.data).toEqual({ is_mutant: false })
    expect(result.status).toBe(403)
  })

  it('throws ApiError for non-ok status without validStatuses', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ error: 'Not found' }, 404))
    await expect(apiFetch('/missing')).rejects.toThrow(ApiError)

    mockFetch.mockResolvedValueOnce(jsonResponse({ error: 'Not found' }, 404))
    await expect(apiFetch('/missing')).rejects.toThrow('Not found')
  })

  it('extracts string error message from response body', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ error: 'Bad DNA' }, 400))

    try {
      await apiFetch('/mutant')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).message).toBe('Bad DNA')
      expect((err as ApiError).status).toBe(400)
    }
  })

  it('extracts Zod flattened error messages', async () => {
    const zodError = {
      error: {
        formErrors: ['Invalid input'],
        fieldErrors: {},
      },
    }
    mockFetch.mockResolvedValue(jsonResponse(zodError, 400))

    try {
      await apiFetch('/mutant')
    } catch (err) {
      expect((err as ApiError).message).toBe('Invalid input')
    }
  })

  it('extracts field-level Zod errors', async () => {
    const zodError = {
      error: {
        formErrors: [],
        fieldErrors: { dna: ['Expected array'] },
      },
    }
    mockFetch.mockResolvedValue(jsonResponse(zodError, 400))

    try {
      await apiFetch('/mutant')
    } catch (err) {
      expect((err as ApiError).message).toBe('Expected array')
    }
  })

  it('falls back to generic message when error body has no message', async () => {
    mockFetch.mockResolvedValue(jsonResponse({}, 500))

    try {
      await apiFetch('/mutant')
    } catch (err) {
      expect((err as ApiError).message).toBe('API error: 500')
    }
  })

  it('sends Content-Type: application/json header', async () => {
    mockFetch.mockResolvedValue(jsonResponse({}))

    await apiFetch('/test')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    )
  })
})
