import type { FormState } from '~/types'
import { STORAGE_KEY } from '~/config/formConfig'

const MAX_STORAGE_SIZE = 1024 * 1024

function estimateSize(str: string): number {
  return new Blob([str]).size
}

export function readStoredState(): FormState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    if (estimateSize(raw) > MAX_STORAGE_SIZE) {
      clearStoredState()
      return {}
    }
    return JSON.parse(raw) as FormState
  } catch {
    clearStoredState()
    return {}
  }
}

export function persistState(state: FormState): void {
  if (typeof window === 'undefined') return
  try {
    const s = JSON.stringify(state)
    if (estimateSize(s) > MAX_STORAGE_SIZE) return
    localStorage.setItem(STORAGE_KEY, s)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      clearStoredState()
      const serialized = JSON.stringify(state)
      if (estimateSize(serialized) <= MAX_STORAGE_SIZE) localStorage.setItem(STORAGE_KEY, serialized)
    }
  }
}

export function clearStoredState(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
