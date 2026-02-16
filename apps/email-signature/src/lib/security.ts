const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'] as const
type AllowedProtocol = (typeof ALLOWED_PROTOCOLS)[number]

export function sanitizeUrl(url: string | undefined | null): string {
  if (!url?.trim()) return ''
  const trimmed = url.trim()
  try {
    const urlObj = new URL(trimmed)
    if (ALLOWED_PROTOCOLS.includes(urlObj.protocol.toLowerCase() as AllowedProtocol)) return urlObj.toString()
    return ''
  } catch {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        return new URL(trimmed).toString()
      } catch {
        return ''
      }
    }
    try {
      return new URL(`https://${trimmed}`).toString()
    } catch {
      return ''
    }
  }
}

export function sanitizePhone(phone: string | undefined | null): string {
  if (!phone?.trim()) return ''
  const sanitized = phone.trim().replace(/[^\d+\s\-().]/g, '')
  return sanitized.length > 50 ? sanitized.substring(0, 50) : sanitized
}

export function sanitizeEmail(email: string | undefined | null): string {
  if (!email?.trim()) return ''
  const trimmed = email.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return ''
  return trimmed.length > 254 ? trimmed.substring(0, 254) : trimmed
}

export function escapeHtml(text: string | undefined | null): string {
  if (!text) return ''
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}

export function isSafeUrl(url: string | undefined | null): boolean {
  if (!url?.trim()) return false
  try {
    return ALLOWED_PROTOCOLS.includes(new URL(url.trim()).protocol.toLowerCase() as AllowedProtocol)
  } catch {
    const t = url.trim()
    if (t.startsWith('http://') || t.startsWith('https://')) {
      try {
        return ALLOWED_PROTOCOLS.includes(new URL(t).protocol.toLowerCase() as AllowedProtocol)
      } catch {
        return false
      }
    }
    return false
  }
}

export function sanitizeText(text: string | undefined | null): string {
  return text ? text.replace(/<[^>]*>/g, '').trim() : ''
}
