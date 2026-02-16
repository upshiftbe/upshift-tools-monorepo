import { APP_VERSION } from '~/config/constants'

export function AppFooter() {
  return (
    <footer className="mt-8 border-t border-slate-200/60 pt-6">
      <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-500 sm:flex-row sm:gap-4">
        <span className="text-xs">
          Version <span className="font-semibold text-slate-600">{APP_VERSION}</span>
        </span>
        <span className="hidden text-slate-300 sm:inline" aria-hidden>•</span>
        <span className="text-xs">
          Created by{' '}
          <a
            href="https://upshift.be"
            target="_blank"
            className="rounded-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/70"
          >
            Upshift
          </a>
        </span>
        <span className="text-xs text-slate-400 sm:text-left">
          Bugs? Drop a note at{' '}
          <a
            href="mailto:hello@upshift.be"
            className="font-semibold text-emerald-600 transition-colors hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/70"
          >
            hello@upshift.be
          </a>
        </span>
      </div>
    </footer>
  )
}
