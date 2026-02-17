'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useCallback, useRef } from 'react'
import {
  QrCode,
  Download,
  Palette,
  ShieldCheck,
  Type,
  Info,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea, Label } from '@upshift-tools/shared-ui'

import { generateQR } from '~/lib/qr'
import type { ErrorCorrectionLevel } from '~/lib/qr'
import QrCodeSvg from '~/components/QrCodeSvg'

export const Route = createFileRoute('/')({ component: App })

const EC_OPTIONS: {
  value: ErrorCorrectionLevel
  label: string
  desc: string
}[] = [
  { value: 'L', label: 'Low (7%)', desc: 'Smallest QR code' },
  { value: 'M', label: 'Medium (15%)', desc: 'Balanced' },
  { value: 'Q', label: 'Quartile (25%)', desc: 'Good recovery' },
  { value: 'H', label: 'High (30%)', desc: 'Best recovery' },
]

function App() {
  const [text, setText] = useState('')
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>('M')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const svgRef = useRef<HTMLDivElement>(null)

  const qr = useMemo(() => {
    if (!text.trim()) return null
    try {
      return generateQR(text, ecLevel)
    } catch {
      return null
    }
  }, [text, ecLevel])

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
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgStr)
  }, [])

  const isOverCapacity = text.trim().length > 0 && qr === null

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
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

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        {/* Left: controls */}
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
              {isOverCapacity && (
                <p className="text-sm text-destructive flex items-center gap-1.5" role="alert">
                  <Info className="h-4 w-4 shrink-0" />
                  Text is too long for the selected error-correction level.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-sm)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                Error Correction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {EC_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={ecLevel === opt.value ? 'default' : 'outline'}
                    size="sm"
                    className="h-auto flex-col items-start gap-0.5 py-2.5 px-3 text-left font-normal transition-shadow hover:shadow-[var(--shadow-sm)]"
                    onClick={() => setEcLevel(opt.value)}
                  >
                    <span className="font-medium">{opt.value}</span>
                    <span className="text-xs opacity-70">— {opt.label}</span>
                    <span className="block text-xs opacity-50">
                      {opt.desc}
                    </span>
                  </Button>
                ))}
              </div>
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

        {/* Right: QR preview – emphasised output area */}
        <div className="flex flex-col items-center gap-6 lg:sticky lg:top-8">
          <div
            ref={svgRef}
            className="w-full max-w-[320px] sm:max-w-sm aspect-square rounded-2xl bg-muted/60 border border-border flex items-center justify-center overflow-hidden shadow-[var(--shadow-md)] ring-1 ring-border/50 qr-preview-container"
          >
            {qr ? (
              <QrCodeSvg
                qr={qr}
                fgColor={fgColor}
                bgColor={bgColor}
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
                  {isOverCapacity ? 'Try a shorter input or lower error correction.' : 'URL, text, or anything you like.'}
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
                  className="gap-2 transition-shadow hover:shadow-[var(--shadow-sm)]"
                >
                  <Download className="h-4 w-4" />
                  SVG
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadPng}
                  className="gap-2 transition-shadow hover:shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Download className="h-4 w-4" />
                  PNG
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
