import type { FormState } from '~/types'

export function getStateFromUrl(): FormState {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const state: FormState = {}
  params.forEach((value, key) => {
    state[key] = value
  })
  return state
}

export function updateUrlFromState(state: FormState): void {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams()
  Object.entries(state).forEach(([key, value]) => {
    if (value.trim()) params.set(key, value.trim())
  })
  window.history.replaceState(null, '', window.location.pathname + (params.toString() ? `?${params.toString()}` : ''))
}

export function clearUrlState(): void {
  if (typeof window === 'undefined') return
  window.history.replaceState(null, '', window.location.pathname)
}
