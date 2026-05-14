import * as React from 'react';
import { APP_URLS } from '../config/urls';
import { cn } from '../lib/utils';

export interface NavLink {
  label: string;
  href: string;
}

export interface AppShellNavbarConfig {
  /** Logo/brand content (e.g. icon + text) */
  logo: React.ReactNode;
  /** URL for logo click */
  logoHref: string;
  /** Optional nav links */
  links?: NavLink[];
}

export interface AppShellFooterConfig {
  /** Custom footer content. If not provided, shows default "Built by Upshift" */
  content?: React.ReactNode;
}

export interface AppShellProps {
  /** Navbar config. Omit to hide navbar */
  navbar?: AppShellNavbarConfig | React.ReactNode;
  /** Footer config. Pass { content: <...> } for custom, true/default for built-in, false to hide */
  footer?: boolean | AppShellFooterConfig | React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Additional class for the outer wrapper */
  className?: string;
  /** Additional class for the main content area */
  mainClassName?: string;
  /** Optional shell personality: affects navbar/footer shadow and border radius */
  dataShellVariant?: 'default' | 'soft' | 'sharp';
}

const DEFAULT_FOOTER = (
  <p className='text-sm text-[var(--navbar-foreground)]/80'>
    Built by{' '}
    <a
      href={APP_URLS.UPSHIFT_HOMEPAGE}
      target='_blank'
      rel='noopener noreferrer'
      className='font-semibold text-[var(--brand-accent-strong)] transition hover:text-[var(--brand-accent)]'
    >
      Upshift
    </a>
  </p>
);

const NAVBAR_STYLES = {
  default: 'border-b border-border shadow-[0_1px_0_0_var(--border)]',
  soft: 'border-b border-border shadow-[var(--shadow-sm)]',
  sharp: 'border-b border-border',
} as const;

function Navbar({
  config,
  variant = 'default',
}: {
  config: AppShellNavbarConfig;
  variant?: keyof typeof NAVBAR_STYLES;
}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between bg-[var(--navbar)] px-4 py-3 backdrop-blur-md md:px-6',
        NAVBAR_STYLES[variant],
      )}
    >
      <a
        href={config.logoHref}
        className='flex items-center gap-2.5 rounded-[var(--radius)] text-[var(--navbar-foreground)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      >
        {config.logo}
      </a>
      <div className='flex items-center gap-2 md:gap-4'>
        {config.links && config.links.length > 0 && (
          <nav className='flex items-center gap-3 md:gap-5' aria-label='Main'>
            {config.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className='rounded-[var(--radius)] px-2 py-1 text-sm font-medium text-[var(--navbar-foreground)]/72 transition hover:bg-accent hover:text-[var(--navbar-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

const FOOTER_STYLES = {
  default: 'border-t border-border shadow-[0_-1px_0_0_var(--border)]',
  soft: 'border-t border-border shadow-[var(--shadow-sm)]',
  sharp: 'border-t border-border',
} as const;

function Footer({
  config,
  variant = 'default',
}: {
  config?: AppShellFooterConfig;
  variant?: keyof typeof FOOTER_STYLES;
}) {
  const content = config?.content ?? DEFAULT_FOOTER;
  return (
    <footer className={cn('bg-[var(--navbar)] px-4 py-4 backdrop-blur-md md:px-6', FOOTER_STYLES[variant])}>
      <div className='mx-auto flex max-w-6xl items-center justify-center text-[var(--navbar-foreground)]/90 [&_a]:text-[var(--brand-accent-strong)] [&_a]:hover:text-[var(--brand-accent)]'>
        {content}
      </div>
    </footer>
  );
}

export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ navbar, footer = true, children, className, mainClassName, dataShellVariant: variant = 'default' }, ref) => {
    const showFooter = footer !== false;
    const isFooterConfig =
      typeof footer === 'object' && footer !== null && 'content' in footer && !React.isValidElement(footer);
    const footerConfig = isFooterConfig ? (footer as AppShellFooterConfig) : undefined;
    const isCustomFooterNode = showFooter && React.isValidElement(footer);

    return (
      <div
        ref={ref}
        className={cn('flex min-h-screen flex-col text-foreground page-bg', className)}
        data-shell-variant={variant}
      >
        {navbar &&
          (React.isValidElement(navbar) ? (
            navbar
          ) : (
            <Navbar config={navbar as AppShellNavbarConfig} variant={variant} />
          ))}
        <main className={cn('relative z-10 flex-1', mainClassName)}>{children}</main>
        {showFooter &&
          (isCustomFooterNode ? (
            <footer className={cn('bg-[var(--navbar)] px-4 py-4 backdrop-blur-md md:px-6', FOOTER_STYLES[variant])}>
              <div className='mx-auto flex max-w-6xl items-center justify-center text-[var(--navbar-foreground)] [&_a]:text-[var(--brand-accent-strong)]'>
                {footer}
              </div>
            </footer>
          ) : (
            <Footer config={footerConfig} variant={variant} />
          ))}
      </div>
    );
  },
);
AppShell.displayName = 'AppShell';
