const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface ApiResponse<T> {
  data: T
  status: number
}

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    super(extractMessage(status, body))
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Extract a human-readable error message from the API response body.
 * Handles Zod flatten format: { error: { formErrors: [...], fieldErrors: {...} } }
 */
function extractMessage(status: number, body: unknown): string {
  if (typeof body !== 'object' || body === null || !('error' in body)) {
    return `API error: ${status}`
  }

  const error = (body as Record<string, unknown>).error

  // String error message
  if (typeof error === 'string') return error

  // Zod flatten format
  if (typeof error === 'object' && error !== null) {
    const flat = error as { formErrors?: string[]; fieldErrors?: Record<string, string[]> }

    if (flat.formErrors?.length) return flat.formErrors[0]

    const fieldErrors = flat.fieldErrors
    if (fieldErrors) {
      const firstField = Object.keys(fieldErrors)[0]
      if (firstField && fieldErrors[firstField]?.length) {
        return fieldErrors[firstField][0]
      }
    }
  }

  return `API error: ${status}`
}

/**
 * Generic fetch wrapper for the backend API.
 *
 * - Prepends VITE_API_URL to the path
 * - Sets JSON headers
 * - Accepts custom `validStatuses` to treat non-2xx codes as valid (e.g. 403)
 * - Throws `ApiError` with status and parsed body on unexpected responses
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { validStatuses?: number[] },
): Promise<ApiResponse<T>> {
  const { validStatuses, ...fetchOptions } = options ?? {}
  const allowed = validStatuses ?? []

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...fetchOptions,
  })

  const body = await response.json().catch(() => null)

  if (response.ok || allowed.includes(response.status)) {
    return { data: body as T, status: response.status }
  }

  throw new ApiError(response.status, body)
}
