import { useCallback, useRef } from 'react'

type CopyResult = { success: boolean; error?: string }

export function useClipboard() {
  const previewRef = useRef<HTMLDivElement | null>(null)

  const copySignature = useCallback(async (): Promise<CopyResult> => {
    const preview = previewRef.current
    if (!preview) return { success: false, error: 'Preview not available' }
    const htmlPayload = preview.outerHTML
    const plainPayload = preview.innerText || ''
    if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([htmlPayload], { type: 'text/html' }),
            'text/plain': new Blob([plainPayload], { type: 'text/plain' }),
          }),
        ])
        return { success: true }
      } catch {
        // fall through
      }
    }
    if (typeof document === 'undefined') return { success: false, error: 'Document not available' }
    const temp = document.createElement('div')
    temp.style.position = 'fixed'
    temp.style.left = '-9999px'
    temp.innerHTML = htmlPayload
    document.body.appendChild(temp)
    const range = document.createRange()
    range.selectNodeContents(temp)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    try {
      const ok = document.execCommand('copy')
      sel?.removeAllRanges()
      document.body.removeChild(temp)
      return ok ? { success: true } : { success: false, error: 'Copy command failed' }
    } catch {
      sel?.removeAllRanges()
      document.body.removeChild(temp)
      return { success: false, error: 'Copy command failed' }
    }
  }, [])

  return { previewRef, copySignature }
}
