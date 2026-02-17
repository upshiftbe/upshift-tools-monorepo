import { useCallback, useState } from 'react'
import type { RefObject } from 'react'
import { Button, Card, CardContent, CardFooter } from '@upshift-tools/shared-ui'
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
    <Card className="bg-card text-card-foreground lg:sticky lg:top-10">
      <CardContent className="space-y-5 px-6 pt-1 pb-6">
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-destructive" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-yellow-500" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
          <span className="ml-auto text-[10px] uppercase tracking-wider">Preview</span>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-muted">
          <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Email preview</span>
              <span className="font-semibold">New message</span>
            </div>
          </div>
          <div className="space-y-1 border-b border-border bg-background px-4 py-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-14 text-right text-[11px] font-semibold">From</span>
              <div className="flex w-full items-center rounded-md border border-input bg-muted px-3 py-2">
                <span>hello@upshift.be</span>
                <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Your info</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 text-right text-[11px] font-semibold">To</span>
              <div className="flex w-full items-center rounded-md border border-input bg-background px-3 py-2">
                <span>recipient@example.com</span>
                <span className="ml-auto text-[11px]">Cc</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 text-right text-[11px] font-semibold">Subject</span>
              <div className="flex w-full items-center rounded-md border border-input bg-background px-3 py-2">
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
        <Button type="button" variant="secondary" className="w-full" onClick={handleShare}>
          Share signature
        </Button>
        {shareStatus === 'copied' && <p className="px-1 text-xs text-primary">{shareMessage}</p>}
        {shareStatus === 'error' && <p className="px-1 text-xs text-destructive">{shareMessage}</p>}
        <Button type="button" className="w-full" onClick={handleCopy}>
          Copy signature
        </Button>
        {copyStatus === 'success' && (
          <div className="flex items-center justify-between gap-2 px-1">
            <p className="text-xs text-primary">Signature copied successfully!</p>
            <button type="button" onClick={handleReset} className="text-xs text-muted-foreground underline hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring">
              Reset form
            </button>
          </div>
        )}
        {copyStatus === 'error' && <p className="px-1 text-xs text-destructive">{errorMessage}</p>}
      </CardFooter>
    </Card>
  )
}
