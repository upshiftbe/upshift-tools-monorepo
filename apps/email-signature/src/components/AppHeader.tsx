export function AppHeader() {
  return (
    <header className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-3 text-sm font-semibold text-primary">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <span>U</span>
        </div>
        <span className="text-xs uppercase tracking-[0.28em]">Upshift</span>
        <span className="mx-2 h-4 w-px bg-border" aria-hidden />
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold md:text-4xl">Email signature builder</h1>
          <p className="max-w-3xl text-base text-muted-foreground">Fill in the form and preview your live email signature on the right.</p>
          <p className="max-w-3xl text-base text-muted-foreground">Everything stays synced with the URL for easy sharing.</p>
        </div>
      </div>
    </header>
  )
}
