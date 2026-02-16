import { useCallback, useState } from 'react'
import type { RefObject } from 'react'
import { Button, Card, CardContent, CardFooter } from './ui'
import { EmailSignature } from './EmailSignature'
import type { TrimmedValues } from '~/types'

type SignaturePreviewProps = {
  values: TrimmedValues
  previewRef: RefObject<HTMLDivElement | null>
  onReset: () => void
  onCopy: () => Promise<{ success: boolean; error?: string }>
}

export function SignaturePreview({ values, previewRef, onReset, onCopy }: SignaturePreviewProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [shareMessage, setShareMessage] = useState('')

  const handleCopy = async () => {
    const result = await onCopy()
    if (result.success) {
      setCopyStatus('success')
      setErrorMessage('')
    } else {
      setCopyStatus('error')
      setErrorMessage(result.error || 'Failed to copy signature')
    }
  }

  const handleReset = () => {
    setCopyStatus('idle')
    setErrorMessage('')
    onReset()
  }

  const copyTextToClipboard = useCallback(async (text: string) => {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    try {
      return document.execCommand('copy')
    } finally {
      document.body.removeChild(ta)
    }
  }, [])

  const handleShare = useCallback(async () => {
    setShareStatus('idle')
    setShareMessage('')
    if (typeof window === 'undefined') {
      setShareStatus('error')
      setShareMessage('Clipboard not available')
      return
    }
    const ok = await copyTextToClipboard(window.location.href)
    if (ok) {
      setShareStatus('copied')
      setShareMessage('Link copied to clipboard')
    } else {
      setShareStatus('error')
      setShareMessage('Unable to copy link')
    }
  }, [copyTextToClipboard])

  return (
    <Card className="bg-slate-900 text-white shadow-2xl shadow-slate-900/40 lg:sticky lg:top-10">
      <CardContent className="space-y-5 px-6 pt-1 pb-6">
        <div className="flex items-center gap-2 rounded-3xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-amber-300/90" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-emerald-400/90" aria-hidden />
          <span className="ml-auto text-[10px] tracking-[0.4em] text-slate-400 uppercase">Preview</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-linear-to-br from-white via-slate-50 to-white px-4 py-3 text-sm text-slate-700">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-[0.28em] text-emerald-600 uppercase">Email preview</span>
              <span className="font-semibold text-slate-900">New message</span>
            </div>
          </div>
          <div className="space-y-1 border-b border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-14 text-right text-[11px] font-semibold text-slate-500">From</span>
              <div className="flex w-full items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                <span>hello@upshift.be</span>
                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Your info</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 text-right text-[11px] font-semibold text-slate-500">To</span>
              <div className="flex w-full items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700">
                <span>recipient@example.com</span>
                <span className="ml-auto text-[11px] text-slate-400">Cc</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 text-right text-[11px] font-semibold text-slate-500">Subject</span>
              <div className="flex w-full items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700">
                <span>Sharing my updated signature</span>
              </div>
            </div>
          </div>
          <div>
            <div style={{ backgroundColor: '#ffffff', padding: 24, fontFamily: 'Segoe UI, sans-serif', fontSize: 12, lineHeight: 1.4, color: '#181127', marginBottom: 12 }}>
              <p style={{ margin: 0 }}>Hi there,</p>
              <p style={{ margin: 0 }}>Here&apos;s the latest signature block. It updates live as you tweak the fields on the left.</p>
              <p style={{ margin: 0 }}>Thanks!</p>
            </div>
            <div ref={previewRef}>
              <EmailSignature values={values} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-0">
        <Button type="button" className="w-full cursor-pointer bg-slate-800/80 text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/70" onClick={handleShare}>
          Share signature
        </Button>
        {shareStatus === 'copied' && <p className="px-1 text-xs text-emerald-400">{shareMessage}</p>}
        {shareStatus === 'error' && <p className="px-1 text-xs text-rose-400">{shareMessage}</p>}
        <Button type="button" className="w-full cursor-pointer bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/70" onClick={handleCopy}>
          Copy signature
        </Button>
        {copyStatus === 'success' && (
          <div className="flex items-center justify-between gap-2 px-1">
            <p className="text-xs text-emerald-400">Signature copied successfully!</p>
            <button type="button" onClick={handleReset} className="text-xs text-slate-400 underline hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/70">
              Reset form
            </button>
          </div>
        )}
        {copyStatus === 'error' && <p className="px-1 text-xs text-rose-400">{errorMessage}</p>}
      </CardFooter>
    </Card>
  )
}
