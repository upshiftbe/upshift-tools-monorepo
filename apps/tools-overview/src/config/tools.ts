import { APP_URLS } from '@upshift-tools/shared-ui';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Port for dev mode (overview on 3000, tools on 3001+) */
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
      'Create and customize QR codes instantly. From-scratch encoder, no external libraries. Export as SVG or PNG.',
    icon: 'QrCode',
    devPort: 3011,
    prodUrl: APP_URLS.QR_CODE_CREATOR,
    color: 'teal',
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
    color: 'teal',
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
    color: 'teal',
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
    color: 'teal',
    pastel: 'amber',
  },
  {
    id: 'mockup-generator',
    name: 'Mockup Generator',
    description:
      'Turn screenshots into polished social mockups. Upload up to three images, frame them in devices, then copy or download a PNG.',
    icon: 'MonitorSmartphone',
    devPort: 3005,
    prodUrl: APP_URLS.MOCKUP_GENERATOR,
    color: 'teal',
    pastel: 'violet',
  },
];

/** Resolve tool href: dev → localhost:devPort, prod → prodUrl */
export function getToolHref(tool: Tool): string {
  if (import.meta.env.DEV) return `http://localhost:${tool.devPort}`;
  return tool.prodUrl;
}
