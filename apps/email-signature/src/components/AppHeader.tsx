export function AppHeader() {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-slate-200/70 backdrop-blur">
      <div className="flex items-center gap-3 text-sm font-semibold text-emerald-700">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-400/50">
          <span>U</span>
        </div>
        <span className="text-xs tracking-[0.28em] text-emerald-700 uppercase">Upshift</span>
        <span className="mx-2 h-4 w-px bg-slate-200" aria-hidden />
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Email signature builder</h1>
          <p className="max-w-3xl text-base text-slate-600">Fill in the form and preview your live email signature on the right.</p>
          <p className="max-w-3xl text-base text-slate-600">Everything stays synced with the URL for easy sharing.</p>
        </div>
      </div>
    </header>
  )
}
