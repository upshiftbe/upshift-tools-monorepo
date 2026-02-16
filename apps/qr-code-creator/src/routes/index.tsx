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
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100">
      {/* Hero */}
      <section className="px-6 pt-24 pb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <QrCode className="h-10 w-10 text-cyan-400" />
          <h1 className="text-4xl font-extrabold tracking-tight">
            QR Code Creator
          </h1>
        </div>
        <p className="text-gray-400 max-w-lg mx-auto">
          Generate QR codes instantly — powered by a from-scratch encoder, no
          external libraries.
        </p>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ─── Left: controls ─── */}
        <div className="space-y-6">
          {/* Text input */}
          <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Type className="h-4 w-4 text-cyan-400" />
              Content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a URL, text, or any content…"
              rows={4}
              className="w-full rounded-lg bg-slate-900 border border-slate-600 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition resize-y"
            />
            {isOverCapacity && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5">
                <Info className="h-4 w-4 shrink-0" />
                Text is too long for the selected error-correction level.
              </p>
            )}
          </div>

          {/* Error correction level */}
          <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              Error Correction
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EC_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setEcLevel(opt.value)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                    ecLevel === opt.value
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                      : 'border-slate-600 bg-slate-900 text-gray-400 hover:border-slate-500'
                  }`}
                >
                  <span className="font-medium">{opt.value}</span>
                  <span className="ml-1 text-xs opacity-70">— {opt.label}</span>
                  <span className="block text-xs mt-0.5 opacity-50">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Colours */}
          <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
              <Palette className="h-4 w-4 text-cyan-400" />
              Colours
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                Foreground
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-8 w-8 rounded border border-slate-600 cursor-pointer bg-transparent"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400">
                Background
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-8 w-8 rounded border border-slate-600 cursor-pointer bg-transparent"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ─── Right: QR preview ─── */}
        <div className="flex flex-col items-center gap-5">
          <div
            ref={svgRef}
            className="w-full max-w-sm aspect-square rounded-2xl bg-white/5 border border-slate-700 flex items-center justify-center overflow-hidden"
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
              <div className="text-center text-gray-500 px-8">
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
              <p className="text-xs text-gray-500">
                Version {qr.version} — {qr.size}×{qr.size} modules
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-600/20 transition"
                >
                  <Download className="h-4 w-4" />
                  SVG
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="flex items-center gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 px-4 py-2.5 text-sm font-medium text-gray-200 transition"
                >
                  <Download className="h-4 w-4" />
                  PNG
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
