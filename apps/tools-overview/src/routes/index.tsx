import { createFileRoute } from '@tanstack/react-router';
import { AppShell, Card, CardContent, CardHeader } from '@upshift-tools/shared-ui';
import { Code2, ExternalLink, ImageDown, Mail, QrCode } from 'lucide-react';
import { TOOLS, getToolHref, type Tool } from '~/config/tools';

const ICONS = { QrCode, Mail, Code2, ImageDown } as const;

export const Route = createFileRoute('/')({ component: OverviewPage });

function OverviewPage() {
  return (
    <AppShell
      navbar={{
        logo: (
          <>
            <span className='flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-primary text-primary-foreground'>
              <QrCode className='h-4 w-4' />
            </span>
            <span className='text-base font-semibold tracking-tight'>Upshift Tools</span>
          </>
        ),
        logoHref: '/',
        links: TOOLS.map((t) => ({ label: t.name, href: getToolHref(t) })),
      }}
      footer={true}
      mainClassName='flex flex-col page-bg brand-grid-bg'
      dataShellVariant='soft'
    >
      <div className='mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14'>
        <section className='surface-panel p-5 sm:p-8'>
          <header className='mb-8 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground'>Upshift workshop</p>
              <h1 className='mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>Tools for practical digital work</h1>
              <p className='mt-3 max-w-2xl text-sm leading-6 text-muted-foreground'>
                Lightweight utilities for everyday production tasks. Each tool runs in the browser and keeps the next action clear.
              </p>
            </div>
            <a
              href='https://upshift.be'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex w-fit items-center gap-2 rounded-[var(--radius)] border border-input bg-card px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              Visit upshift.be
              <ExternalLink className='h-4 w-4' />
            </a>
          </header>

          <div className='grid gap-4 md:grid-cols-2'>
            {TOOLS.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Icon = ICONS[tool.icon as keyof typeof ICONS] ?? Code2;
  const href = getToolHref(tool);

  return (
    <a href={href} target='_blank' rel='noopener noreferrer' className='block h-full'>
      <Card
        className='tools-card-reveal group relative flex h-full flex-col transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-accent-strong)]/40 hover:shadow-[var(--shadow-lg)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        style={{ animationDelay: `${index * 55}ms` }}
      >
        <CardHeader className='flex-row items-start gap-4 space-y-0'>
          <div className='inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius)] border border-border bg-accent text-[var(--brand-accent-strong)]'>
            <Icon className='h-5 w-5' />
          </div>
          <div className='min-w-0'>
            <h2 className='text-lg font-semibold group-hover:text-foreground'>{tool.name}</h2>
            <span className='mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-accent-strong)]'>
              Open tool
              <ExternalLink className='h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </span>
          </div>
        </CardHeader>
        <CardContent className='flex-1 pt-0'>
          <p className='text-sm leading-relaxed text-muted-foreground'>{tool.description}</p>
        </CardContent>
      </Card>
    </a>
  );
}
