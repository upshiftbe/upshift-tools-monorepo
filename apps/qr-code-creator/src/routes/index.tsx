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
      <section className="px-6 pt-24 pb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <QrCode className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-extrabold tracking-tight">
            QR Code Creator
          </h1>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Generate QR codes instantly — powered by a from-scratch encoder, no
          external libraries.
        </p>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ─── Left: controls ─── */}
        <div className="space-y-6">
          {/* Text input */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Type className="h-4 w-4 text-primary" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter a URL, text, or any content…"
                rows={4}
                className="resize-y"
              />
              {isOverCapacity && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <Info className="h-4 w-4 shrink-0" />
                  Text is too long for the selected error-correction level.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Error correction level */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Error Correction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {EC_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={ecLevel === opt.value ? 'default' : 'outline'}
                    size="sm"
                    className="h-auto flex-col items-start gap-0.5 py-2.5 px-3 text-left font-normal"
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

          {/* Colours */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4 text-primary" />
                Colours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-muted-foreground">Foreground</Label>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-8 w-8 rounded border border-input cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-muted-foreground">Background</Label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-8 rounded border border-input cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Right: QR preview ─── */}
        <div className="flex flex-col items-center gap-5">
          <div
            ref={svgRef}
            className="w-full max-w-sm aspect-square rounded-2xl bg-muted/50 border border-border flex items-center justify-center overflow-hidden"
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
              <div className="text-center text-muted-foreground px-8">
                <QrCode className="h-16 w-16 mx-auto mb-3 opacity-20" />
                <p className="text-sm">
                  {isOverCapacity
                    ? 'Content exceeds maximum capacity'
                    : 'Enter content on the left to generate a QR code'}
                </p>
              </div>
            )}
          </div>

          {qr && (
            <>
              <p className="text-xs text-muted-foreground">
                Version {qr.version} — {qr.size}×{qr.size} modules
              </p>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  SVG
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadPng}
                  className="gap-2"
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
