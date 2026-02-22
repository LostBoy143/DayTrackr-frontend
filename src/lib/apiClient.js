const baseUrl = (import.meta.env.VITE_BASE_URL || '').replace(/\/+$/, '')

function getErrorMessage(payload, fallback) {
  if (payload && typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }
  return fallback
}

export async function apiRequest(path, options = {}) {
  if (!baseUrl) {
    throw new Error('Missing VITE_BASE_URL. Please configure it in your environment.')
  }

  const { method = 'GET', body, token, signal } = options

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch {
    throw new Error('Network error. Please check your connection and API URL.')
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Request failed. Please try again.'))
  }

  if (payload && payload.success === false) {
    throw new Error(getErrorMessage(payload, 'Operation failed. Please try again.'))
  }

  return payload
}
