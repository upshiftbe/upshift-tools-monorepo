import { ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/80 backdrop-blur px-5 py-4 sticky bottom-0 left-0 right-0">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <span>Built by</span>
        <a
          href="https://www.upshift.be"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/90 transition"
        >
          Upshift
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </footer>
  )
}

export default Footer
