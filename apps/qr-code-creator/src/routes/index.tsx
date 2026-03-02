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
      <section className="px-6 pt-20 pb-10 sm:pt-24 sm:pb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <QrCode className="h-10 w-10 text-primary" aria-hidden />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            QR Code Creator
          </h1>
        </div>
        <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Generate QR codes instantly — powered by a from-scratch encoder, no
          external libraries.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        <div className="space-y-6 lg:space-y-8">
          <Card className="shadow-[var(--shadow-sm)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Type className="h-4 w-4 text-primary shrink-0" />
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
                      backgroundColor: isOverCapacity ? 'var(--destructive)' : charRatio > 0.8 ? 'var(--ring)' : 'var(--primary)',
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

          <Card className="shadow-[var(--shadow-sm)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Shapes className="h-4 w-4 text-primary shrink-0" />
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

          <Card className="shadow-[var(--shadow-sm)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ImagePlus className="h-4 w-4 text-primary shrink-0" />
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
                        className="rounded border-input accent-[var(--ring)]"
                      />
                      <span className="text-sm">Center</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={logoCorners}
                        onChange={(e) => setLogoCorners(e.target.checked)}
                        className="rounded border-input accent-[var(--ring)]"
                      />
                      <span className="text-sm">Corners (finder areas)</span>
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-sm)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Palette className="h-4 w-4 text-primary shrink-0" />
                Colours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-foreground">Foreground</Label>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-10 w-10 rounded-lg border border-input cursor-pointer bg-transparent hover:ring-2 hover:ring-primary/20 transition-shadow"
                    aria-label="Foreground colour"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-foreground">Background</Label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-10 rounded-lg border border-input cursor-pointer bg-transparent hover:ring-2 hover:ring-primary/20 transition-shadow"
                    aria-label="Background colour"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center gap-6 lg:sticky lg:top-8">
          <div
            ref={svgRef}
            className="w-full max-w-[320px] sm:max-w-sm aspect-square rounded-2xl bg-muted/60 border border-border flex items-center justify-center overflow-hidden shadow-[var(--shadow-md)] ring-1 ring-border/50 transition-all duration-300"
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

          {qr && (
            <>
              <p className="text-xs text-muted-foreground">
                Version {qr.version} — {qr.size}×{qr.size} modules
              </p>

              <div className="flex gap-3 flex-wrap justify-center">
                <Button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="gap-2 transition-all duration-150 active:scale-95"
                >
                  {downloadFeedback === 'svg' ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  {downloadFeedback === 'svg' ? 'Downloaded!' : 'SVG'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadPng}
                  className="gap-2 transition-all duration-150 active:scale-95"
                >
                  {downloadFeedback === 'png' ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  {downloadFeedback === 'png' ? 'Downloaded!' : 'PNG'}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
