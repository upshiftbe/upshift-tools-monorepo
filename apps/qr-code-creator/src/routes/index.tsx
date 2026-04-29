'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  QrCode,
  Download,
  Palette,
  Type,
  Info,
  Shapes,
  ImagePlus,
  X,
  Check,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea, Label } from '@upshift-tools/shared-ui'

import { generateQR } from '~/lib/qr'
import QrCodeSvg from '~/components/QrCodeSvg'
import type { ModuleStyle } from '~/components/QrCodeSvg'

export const Route = createFileRoute('/')({ component: App })

const MODULE_STYLES: { value: ModuleStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'heart', label: 'Heart' },
  { value: 'star', label: 'Star' },
  { value: 'diamond', label: 'Diamond' },
]

const MAX_CAPACITY = 2953

function App() {
  const [text, setText] = useState('')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [moduleStyle, setModuleStyle] = useState<ModuleStyle>('square')
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null)
  const [logoCenter, setLogoCenter] = useState(true)
  const [logoCorners, setLogoCorners] = useState(false)
  const [downloadFeedback, setDownloadFeedback] = useState<'svg' | 'png' | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const svgRef = useRef<HTMLDivElement>(null)

  const qr = useMemo(() => {
    if (!text.trim()) return null
    try {
      return generateQR(text, 'H')
    } catch {
      return null
    }
  }, [text])

  useEffect(() => {
    if (!downloadFeedback) return
    const id = setTimeout(() => setDownloadFeedback(null), 2000)
    return () => clearTimeout(id)
  }, [downloadFeedback])

  const handleDownloadSvg = useCallback(() => {
    const svg = svgRef.current?.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qr-code.svg'
    a.click()
    URL.revokeObjectURL(url)
    setDownloadFeedback('svg')
  }, [])

  const handleDownloadPng = useCallback(() => {
    const svg = svgRef.current?.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const canvas = document.createElement('canvas')
    const pxSize = 1024
    canvas.width = pxSize
    canvas.height = pxSize
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, pxSize, pxSize)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = 'qr-code.png'
      a.click()
      setDownloadFeedback('png')
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgStr)
  }, [])

  const isOverCapacity = text.trim().length > 0 && qr === null
  const charRatio = text.length / MAX_CAPACITY

  const handleLogoFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setLogoDataUrl(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [])

  const clearLogo = useCallback(() => {
    setLogoDataUrl(null)
    logoInputRef.current?.value && (logoInputRef.current.value = '')
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6 border-b border-border pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">QR Code Creator</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Generate a production-ready QR code</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Add content, adjust the module style, and export as SVG or PNG. Encoding happens locally in the browser.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Type className="h-4 w-4 text-[var(--brand-accent-strong)] shrink-0" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter a URL, text, or any content…"
                rows={4}
                className="resize-y min-h-[100px]"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(charRatio * 100, 100)}%`,
                      backgroundColor: isOverCapacity ? 'var(--destructive)' : charRatio > 0.8 ? 'var(--warning)' : 'var(--brand-accent-strong)',
                    }}
                  />
                </div>
                <span className={`text-xs tabular-nums shrink-0 ${isOverCapacity ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                  {text.length.toLocaleString()} / {MAX_CAPACITY.toLocaleString()}
                </span>
              </div>
              {isOverCapacity && (
                <p className="text-sm text-destructive flex items-center gap-1.5" role="alert">
                  <Info className="h-4 w-4 shrink-0" />
                  Text is too long. Try a shorter input.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Shapes className="h-4 w-4 text-[var(--brand-accent-strong)] shrink-0" />
                Style
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">Module shape</Label>
                <div className="flex flex-wrap gap-2">
                  {MODULE_STYLES.map((opt) => (
                    <Button
                      key={opt.value}
                      type="button"
                      variant={moduleStyle === opt.value ? 'default' : 'outline'}
                      size="sm"
                      className="capitalize transition-all duration-150"
                      onClick={() => setModuleStyle(opt.value)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ImagePlus className="h-4 w-4 text-[var(--brand-accent-strong)] shrink-0" />
                Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFile}
                  className="hidden"
                  aria-label="Upload logo image"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => logoInputRef.current?.click()}
                  className="gap-2"
                >
                  <ImagePlus className="h-4 w-4" />
                  {logoDataUrl ? 'Change logo' : 'Upload logo'}
                </Button>
                {logoDataUrl && (
                  <Button type="button" variant="ghost" size="sm" onClick={clearLogo} className="gap-2 text-muted-foreground">
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
              {logoDataUrl && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Placement</Label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={logoCenter}
                        onChange={(e) => setLogoCenter(e.target.checked)}
                        className="rounded border-input accent-[var(--brand-accent-strong)]"
                      />
                      <span className="text-sm">Center</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={logoCorners}
                        onChange={(e) => setLogoCorners(e.target.checked)}
                        className="rounded border-input accent-[var(--brand-accent-strong)]"
                      />
                      <span className="text-sm">Corners (finder areas)</span>
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Palette className="h-4 w-4 text-[var(--brand-accent-strong)] shrink-0" />
                Colors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-border bg-muted/40 px-3 py-2">
                  <Label htmlFor="qr-fg-color" className="text-sm font-medium text-foreground">Foreground</Label>
                  <input
                    id="qr-fg-color"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-9 w-11 cursor-pointer rounded-[var(--radius)] border border-input bg-transparent p-1 transition-shadow hover:ring-2 hover:ring-ring/30"
                    aria-label="Foreground color"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-border bg-muted/40 px-3 py-2">
                  <Label htmlFor="qr-bg-color" className="text-sm font-medium text-foreground">Background</Label>
                  <input
                    id="qr-bg-color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-9 w-11 cursor-pointer rounded-[var(--radius)] border border-input bg-transparent p-1 transition-shadow hover:ring-2 hover:ring-ring/30"
                    aria-label="Background color"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col items-center gap-5 lg:sticky lg:top-20">
          <div className="w-full rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Preview</p>
                <p className="text-xs text-muted-foreground">{qr ? `Version ${qr.version}, ${qr.size}x${qr.size} modules` : 'Waiting for content'}</p>
              </div>
            </div>
          <div
            ref={svgRef}
            className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[var(--radius)] border border-border bg-muted/60 transition duration-200"
          >
            {qr ? (
              <QrCodeSvg
                qr={qr}
                fgColor={fgColor}
                bgColor={bgColor}
                moduleStyle={moduleStyle}
                logoUrl={logoDataUrl}
                logoCenter={logoCenter}
                logoCorners={logoCorners}
                className="w-full h-full"
                id="qr-svg"
              />
            ) : (
              <div className="text-center text-muted-foreground px-8 py-10 qr-empty-state">
                <QrCode className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 opacity-30" aria-hidden />
                <p className="text-sm font-medium text-foreground/80">
                  {isOverCapacity
                    ? 'Content exceeds maximum capacity'
                    : 'Enter content on the left to generate a QR code'}
                </p>
                <p className="text-xs mt-1.5 text-muted-foreground">
                  {isOverCapacity ? 'Try a shorter input.' : 'URL, text, or anything you like.'}
                </p>
              </div>
            )}
          </div>
          </div>

          {qr && (
            <>
              <div className="flex gap-3 flex-wrap justify-center">
                <Button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="gap-2 transition-all duration-150 active:scale-95"
                >
                  {downloadFeedback === 'svg' ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  {downloadFeedback === 'svg' ? 'Downloaded' : 'SVG'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadPng}
                  className="gap-2 transition-all duration-150 active:scale-95"
                >
                  {downloadFeedback === 'png' ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  {downloadFeedback === 'png' ? 'Downloaded' : 'PNG'}
                </Button>
              </div>
            </>
          )}
        </aside>
        </div>
      </section>
    </div>
  )
}
