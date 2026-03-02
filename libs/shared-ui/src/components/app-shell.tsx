import * as React from 'react';
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
      href='https://upshift.be'
      target='_blank'
      rel='noopener noreferrer'
      className='font-semibold text-[var(--brand-accent)] transition hover:text-[var(--brand-accent-dark)]'
    >
      Upshift
    </a>
  </p>
);

const NAVBAR_STYLES = {
  default: 'border-b border-border shadow-[0_1px_0_0_var(--border)]',
  soft: 'border-b border-border shadow-[var(--shadow-sm)]',
  sharp: 'border-b-2 border-border',
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
        'sticky top-0 z-50 flex items-center justify-between bg-[var(--navbar)]/95 px-4 py-3 backdrop-blur md:px-6',
        NAVBAR_STYLES[variant],
      )}
    >
      <a
        href={config.logoHref}
        className='flex items-center gap-2.5 text-[var(--navbar-foreground)] transition hover:opacity-90'
      >
        {config.logo}
      </a>
      {config.links && config.links.length > 0 && (
        <nav className='flex items-center gap-4 md:gap-6' aria-label='Main'>
          {config.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='text-sm font-medium text-[var(--navbar-foreground)]/80 transition hover:text-[var(--navbar-foreground)]'
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

const FOOTER_STYLES = {
  default: 'border-t border-border shadow-[0_-1px_0_0_var(--border)]',
  soft: 'border-t border-border shadow-[var(--shadow-sm)]',
  sharp: 'border-t-2 border-border',
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
    <footer className={cn('bg-[var(--navbar)]/95 px-4 py-4 backdrop-blur md:px-6', FOOTER_STYLES[variant])}>
      <div className='mx-auto flex max-w-6xl items-center justify-center text-[var(--navbar-foreground)]/90 [&_a]:text-[var(--brand-accent)] [&_a]:hover:text-[var(--brand-accent-dark)]'>
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
        className={cn('flex min-h-screen flex-col text-foreground page-gradient-bg', className)}
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
            <footer className={cn('bg-[var(--navbar)]/95 px-4 py-4 backdrop-blur md:px-6', FOOTER_STYLES[variant])}>
              <div className='mx-auto flex max-w-6xl items-center justify-center text-[var(--navbar-foreground)] [&_a]:text-[var(--brand-accent)]'>
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
