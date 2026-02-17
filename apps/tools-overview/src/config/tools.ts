export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Port for dev mode (overview on 3000, tools on 3001–3003) */
  devPort: number;
  path: string;
  color: string;
  /** Soft pastel background: CSS var name --pastel-{key} */
  pastel: 'violet' | 'amber' | 'rose';
}

export const TOOLS: Tool[] = [
  {
    id: 'qr-code-creator',
    name: 'QR Code Creator',
    description:
      'Create and customize QR codes instantly. From-scratch encoder, no external libraries — export as SVG or PNG.',
    icon: 'QrCode',
    devPort: 3011,
    path: '/qr-code-creator',
    color: 'from-cyan-500 to-blue-600',
    pastel: 'violet',
  },
  {
    id: 'email-signature',
    name: 'Email Signature',
    description:
      'Build professional email signatures with live preview. Sync to URL for sharing, copy HTML to clipboard.',
    icon: 'Mail',
    devPort: 3002,
    path: '/email-signature',
    color: 'from-emerald-500 to-teal-600',
    pastel: 'amber',
  },
  {
    id: 'schema-markup-generator',
    name: 'Schema Markup Generator',
    description:
      'Generate JSON-LD structured data for SEO. Organization, Article, Product, LocalBusiness, Event, Person, and more.',
    icon: 'Code2',
    devPort: 3003,
    path: '/schema-markup-generator',
    color: 'from-violet-500 to-purple-600',
    pastel: 'rose',
  },
];

/** Env keys for per-tool URLs (when each app has its own Netlify site) */
const TOOL_URL_KEYS: Record<string, string> = {
  'qr-code-creator': 'VITE_TOOL_URL_QR_CODE_CREATOR',
  'email-signature': 'VITE_TOOL_URL_EMAIL_SIGNATURE',
  'schema-markup-generator': 'VITE_TOOL_URL_SCHEMA_MARKUP_GENERATOR',
};

/** Resolve tool href: dev → localhost:devPort, prod → env URL or VITE_TOOLS_BASE_URL + path or same-origin */
export function getToolHref(tool: Tool): string {
  if (import.meta.env.DEV) return `http://localhost:${tool.devPort}`;

  const env = import.meta.env;
  const perToolUrl = TOOL_URL_KEYS[tool.id] && (env[TOOL_URL_KEYS[tool.id]] as string | undefined);
  if (perToolUrl) return perToolUrl.replace(/\/$/, '');

  const base = env?.VITE_TOOLS_BASE_URL as string | undefined;
  if (base) return `${base.replace(/\/$/, '')}${tool.path}`;

  if (typeof window !== 'undefined') return `${window.location.origin}${tool.path}`;
  return tool.path;
}
