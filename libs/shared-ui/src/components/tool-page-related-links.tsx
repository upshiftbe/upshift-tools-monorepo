import { cn } from '../lib/utils';
import { APP_URLS } from '../config/urls';

export type ToolRelatedLink = { href: string; label: string };

export interface ToolPageRelatedLinksProps {
  /** Sibling tools for cross-linking (SEO + discovery). */
  relatedTools?: ToolRelatedLink[];
  className?: string;
}

export const ToolPageRelatedLinks = ({ relatedTools = [], className }: ToolPageRelatedLinksProps) => (
  <section className={cn('mt-10 border-t border-border pt-6', className)} aria-labelledby='tool-related-links-heading'>
    <h2 id='tool-related-links-heading' className='font-display text-sm font-semibold tracking-tight text-foreground'>
      More from Upshift
    </h2>
    <ul className='mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground'>
      <li>
        <a
          href={APP_URLS.TOOLS_OVERVIEW}
          className='font-medium text-[var(--brand-accent-strong)] underline-offset-4 hover:underline'
        >
          All tools
        </a>
      </li>
      <li>
        <a
          href={APP_URLS.UPSHIFT_HOMEPAGE}
          className='font-medium text-[var(--brand-accent-strong)] underline-offset-4 hover:underline'
        >
          Upshift
        </a>
      </li>
      {relatedTools.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className='font-medium text-[var(--brand-accent-strong)] underline-offset-4 hover:underline'
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </section>
);
