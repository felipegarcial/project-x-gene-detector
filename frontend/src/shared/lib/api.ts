const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const DEFAULT_TIMEOUT_MS = 15_000

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

function extractMessage(status: number, body: unknown): string {
  if (typeof body !== 'object' || body === null || !('error' in body)) {
    return `API error: ${status}`
  }

  const error = (body as Record<string, unknown>).error

  if (typeof error === 'string') return error

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

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { validStatuses?: number[] },
): Promise<ApiResponse<T>> {
  const { validStatuses, headers: callerHeaders, ...fetchOptions } = options ?? {}
  const allowed = validStatuses ?? []

  const signal = fetchOptions.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS)

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(callerHeaders instanceof Headers
        ? Object.fromEntries(callerHeaders.entries())
        : Array.isArray(callerHeaders)
          ? Object.fromEntries(callerHeaders)
          : callerHeaders),
    },
  })

  const text = await response.text()
  let body: unknown = null

  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      if (response.ok) {
        throw new ApiError(response.status, { error: 'Invalid JSON response from server' })
      }
    }
  }

  if (response.ok || allowed.includes(response.status)) {
    return { data: body as T, status: response.status }
  }

  throw new ApiError(response.status, body)
}
