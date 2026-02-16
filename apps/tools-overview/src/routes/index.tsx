import { createFileRoute } from '@tanstack/react-router'
import { QrCode, Mail, Code2, ExternalLink } from 'lucide-react'
import { TOOLS, getToolHref, type Tool } from '~/config/tools'

const ICONS = { QrCode, Mail, Code2 } as const

export const Route = createFileRoute('/')({ component: OverviewPage })

function OverviewPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100">
      <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Upshift Tools
          </h1>
          <p className="mt-4 text-lg text-stone-400">
            Free, open-source utilities for developers and teams
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <footer className="mt-20 border-t border-stone-800 pt-10 text-center">
          <p className="text-sm text-stone-500">
            Built by{' '}
            <a
              href="https://upshift.be"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-400 transition hover:text-amber-300"
            >
              Upshift
            </a>
          </p>
        </footer>
      </main>
    </div>
  )
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = ICONS[tool.icon as keyof typeof ICONS] ?? Code2
  const href = getToolHref(tool)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-2xl border border-stone-800 bg-stone-900/50 p-6 transition hover:border-stone-700 hover:bg-stone-800/50"
    >
      <div
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-semibold text-stone-100 group-hover:text-white">
        {tool.name}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-400">
        {tool.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-400">
        Open tool
        <ExternalLink className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  )
}
