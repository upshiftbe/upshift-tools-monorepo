import { APP_URLS } from '@upshift-tools/shared-ui';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Port for dev mode (overview on 3000, tools on 3001–3003) */
  devPort: number;
  /** Production URL for this tool */
  prodUrl: string;
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
    prodUrl: APP_URLS.QR_CODE_CREATOR,
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
    prodUrl: APP_URLS.EMAIL_SIGNATURE,
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
    prodUrl: APP_URLS.SCHEMA_MARKUP_GENERATOR,
    color: 'from-violet-500 to-purple-600',
    pastel: 'rose',
  },
  {
    id: 'image-optimizer',
    name: 'Image Optimizer',
    description:
      'Compress and convert images to WebP or AVIF entirely in your browser. Drag & drop, adjust quality, download individually or as a ZIP.',
    icon: 'ImageDown',
    devPort: 3004,
    prodUrl: APP_URLS.IMAGE_OPTIMIZER,
    color: 'from-orange-500 to-rose-500',
    pastel: 'amber',
  },
];

/** Resolve tool href: dev → localhost:devPort, prod → prodUrl */
export function getToolHref(tool: Tool): string {
  if (import.meta.env.DEV) return `http://localhost:${tool.devPort}`;
  return tool.prodUrl;
}
