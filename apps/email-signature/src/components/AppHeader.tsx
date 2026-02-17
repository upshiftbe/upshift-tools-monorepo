export function AppHeader() {
  return (
    <header className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-3 text-sm font-semibold text-primary">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <span>U</span>
        </div>
        <span className="text-xs uppercase tracking-[0.28em]">Upshift</span>
        <span className="mx-2 h-4 w-px bg-border" aria-hidden />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl text-foreground tracking-tight">
            Email signature builder
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Fill in the form and preview your live email signature on the right. Everything stays synced with the URL for easy sharing.
          </p>
        </div>
      </div>
    </header>
  )
}
