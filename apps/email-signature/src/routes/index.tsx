import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { useFormState } from '~/hooks/useFormState'
import { useClipboard } from '~/hooks/useClipboard'
import { AppHeader } from '~/components/AppHeader'
import { AppFooter } from '~/components/AppFooter'
import { SignatureForm } from '~/components/SignatureForm'
import { SignaturePreview } from '~/components/SignaturePreview'
import type { ChangeEvent } from 'react'

const CONSENT_COOKIE_NAME = 'emailSignatureConsent'

function getConsentCookie(): 'accepted' | 'rejected' | null {
  if (typeof document === 'undefined') return null
  const cookie = document.cookie
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${CONSENT_COOKIE_NAME}=`))
  if (!cookie) return null
  const [, value] = cookie.split('=')
  return value === 'accepted' || value === 'rejected' ? value : null
}

function setConsentCookie(value: 'accepted' | 'rejected') {
  if (typeof document === 'undefined') return
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 365};`
}

export const Route = createFileRoute('/')({ component: EmailSignaturePage })

function EmailSignaturePage() {
  const { formState, trimmedValues, updateField, setFieldTouched, resetForm, hydrated, errors } = useFormState()
  const { previewRef, copySignature } = useClipboard()
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(() => getConsentCookie())

  const handleFieldChange = useCallback(
    (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
      updateField(id, event.target.value)
    },
    [updateField]
  )

  const handleFieldBlur = useCallback(
    (id: string) => () => {
      setFieldTouched(id)
    },
    [setFieldTouched]
  )

  useEffect(() => {
    if (consent === null) setConsent(getConsentCookie())
  }, [consent])

  const handleConsentDecision = useCallback((value: 'accepted' | 'rejected') => {
    setConsentCookie(value)
    setConsent(value)
    if (value === 'accepted' && typeof window !== 'undefined') {
      const dl = (window as Window & { dataLayer?: unknown[] }).dataLayer
      if (Array.isArray(dl)) dl.push({ event: 'consent_granted' })
    }
  }, [])

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 px-4 py-10 text-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <AppHeader />
        <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <SignatureForm
              formState={formState}
              errors={errors}
              onFieldChange={handleFieldChange}
              onFieldBlur={handleFieldBlur}
              onReset={resetForm}
            />
          </section>
          <aside className="space-y-6">
            <SignaturePreview values={trimmedValues} previewRef={previewRef} onReset={resetForm} onCopy={copySignature} />
          </aside>
        </div>
        <AppFooter />
      </div>
      {consent === null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-3xl rounded-3xl bg-white/95 p-8 text-slate-900 shadow-2xl backdrop-blur">
            <p className="text-base leading-relaxed">We use cookies to improve our free email signature builder.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="cursor-pointer rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-emerald-500"
                onClick={() => handleConsentDecision('accepted')}
              >
                Allow cookies
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
                onClick={() => handleConsentDecision('rejected')}
              >
                Reject cookies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
