import { APP_VERSION } from '~/config/constants'

export function AppFooter() {
  return (
    <footer className="mt-8 border-t border-border pt-6">
      <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
        <span className="text-xs">
          Version <span className="font-semibold">{APP_VERSION}</span>
        </span>
        <span className="hidden sm:inline" aria-hidden>•</span>
        <span className="text-xs">
          Created by{' '}
          <a
            href="https://upshift.be"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm font-semibold text-primary transition-colors hover:text-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Upshift
          </a>
        </span>
        <span className="text-xs sm:text-left">
          Bugs? Drop a note at{' '}
          <a
            href="mailto:hello@upshift.be"
            className="font-semibold text-primary transition-colors hover:text-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            hello@upshift.be
          </a>
        </span>
      </div>
    </footer>
  )
}
