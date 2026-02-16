export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  /** Port for dev mode (overview on 3000, tools on 3001–3003) */
  devPort: number
  path: string
  color: string
}

export const TOOLS: Tool[] = [
  {
    id: 'qr-code-creator',
    name: 'QR Code Creator',
    description: 'Create and customize QR codes instantly. From-scratch encoder, no external libraries — export as SVG or PNG.',
    icon: 'QrCode',
    devPort: 3001,
    path: '/qr-code-creator',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'email-signature',
    name: 'Email Signature',
    description: 'Build professional email signatures with live preview. Sync to URL for sharing, copy HTML to clipboard.',
    icon: 'Mail',
    devPort: 3002,
    path: '/email-signature',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'schema-markup-generator',
    name: 'Schema Markup Generator',
    description: 'Generate JSON-LD structured data for SEO. Organization, Article, Product, LocalBusiness, Event, Person, and more.',
    icon: 'Code2',
    devPort: 3003,
    path: '/schema-markup-generator',
    color: 'from-violet-500 to-purple-600',
  },
]

/** Resolve tool href: dev → localhost:devPort, prod → VITE_TOOLS_BASE_URL + path or same-origin path */
export function getToolHref(tool: Tool): string {
  const base = import.meta.env?.VITE_TOOLS_BASE_URL as string | undefined
  if (base) return `${base.replace(/\/$/, '')}${tool.path}`
  if (import.meta.env.DEV) return `http://localhost:${tool.devPort}`
  if (typeof window !== 'undefined') return `${window.location.origin}${tool.path}`
  return tool.path
}
