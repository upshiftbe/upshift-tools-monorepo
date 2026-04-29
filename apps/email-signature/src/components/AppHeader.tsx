export function AppHeader() {
  return (
    <header className="border-b border-border pb-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Email Signature Builder</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Build a shareable email signature</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Fill the fields, inspect the email preview, then copy a clean HTML signature. The URL keeps the current draft shareable.
          </p>
        </div>
      </div>
    </header>
  )
}
