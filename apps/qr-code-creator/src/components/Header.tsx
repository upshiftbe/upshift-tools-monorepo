import { Link } from '@tanstack/react-router'
import { QrCode } from 'lucide-react'

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-3 bg-card/80 backdrop-blur border-b border-border">
      <Link to="/" className="flex items-center gap-2.5 text-foreground">
        <QrCode className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg tracking-tight">QR Creator</span>
      </Link>
    </header>
  )
}

export default Header
