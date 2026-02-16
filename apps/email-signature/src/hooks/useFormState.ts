import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormState, TrimmedValues } from '~/types'
import { FORM_FIELDS, PREFILL_VALUES } from '~/config/formConfig'
import { readStoredState, persistState, clearStoredState } from '~/lib/storage'
import { getStateFromUrl, updateUrlFromState, clearUrlState } from '~/lib/urlState'
import { validateField, validateForm } from '~/lib/validation'

function createDefaultState(): FormState {
  return FORM_FIELDS.reduce<FormState>((state, field) => ({ ...state, [field.id]: PREFILL_VALUES[field.id] ?? '' }), {})
}

function initializeState(): FormState {
  if (typeof window === 'undefined') return createDefaultState()
  const params = getStateFromUrl()
  const stored = readStoredState()
  return FORM_FIELDS.reduce<FormState>((acc, field) => {
    if (params[field.id]) return { ...acc, [field.id]: params[field.id] }
    if (stored[field.id]) return { ...acc, [field.id]: stored[field.id] }
    if (PREFILL_VALUES[field.id]) return { ...acc, [field.id]: PREFILL_VALUES[field.id] }
    return { ...acc, [field.id]: '' }
  }, {})
}

export function useFormState() {
  const [formState, setFormState] = useState<FormState>(initializeState)
  const [hydrated, setHydrated] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (typeof window === 'undefined') return
    setFormState(initializeState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    updateUrlFromState(formState)
    persistState(formState)
  }, [formState, hydrated])

  const updateField = useCallback(
    (id: string, value: string) => {
      setFormState((prev) => ({ ...prev, [id]: value }))
      if (touched[id]) {
        const error = validateField(id, value)
        setErrors((prev) => {
          if (error) return { ...prev, [id]: error }
          const next = { ...prev }
          delete next[id]
          return next
        })
      }
    },
    [touched]
  )

  const setFieldTouched = useCallback(
    (id: string) => {
      setTouched((prev) => ({ ...prev, [id]: true }))
      setErrors((prev) => {
        const error = validateField(id, formState[id] || '')
        if (error) return { ...prev, [id]: error }
        const next = { ...prev }
        delete next[id]
        return next
      })
    },
    [formState]
  )

  const resetForm = useCallback(() => {
    setFormState(createDefaultState())
    setErrors({})
    setTouched({})
    clearStoredState()
    clearUrlState()
  }, [])

  const trimmedValues = useMemo((): TrimmedValues => {
    const get = (key: string) => (formState[key] || '').trim()
    const websiteUrl = get('input-website')
    return {
      name: get('input-naam'),
      role: get('input-functie'),
      phone: get('input-gsm'),
      email: get('input-email'),
      location1: get('input-locatie-1'),
      location2: get('input-locatie-2'),
      websiteUrl,
      websiteLabel: websiteUrl ? websiteUrl.replace(/^https?:\/\//, '') : '',
      facebook: get('input-facebook'),
      linkedin: get('input-linkedin'),
      instagram: get('input-instagram'),
      logoUrl: get('input-logo-url'),
    }
  }, [formState])

  const isValid = useMemo(() => validateForm(formState).isValid, [formState])

  return { formState, trimmedValues, updateField, setFieldTouched, resetForm, hydrated, errors, isValid }
}
