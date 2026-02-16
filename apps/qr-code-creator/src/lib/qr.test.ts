import { describe, it, expect } from 'vitest'
import jsQR from 'jsqr'
import { generateQR } from './qr'
import type { ErrorCorrectionLevel } from './qr'

/**
 * Convert a boolean[][] QR module grid into RGBA pixel data that jsQR can read.
 * Each module is scaled to `scale x scale` pixels with a quiet-zone margin.
 */
const modulesToImageData = (
  modules: boolean[][],
  size: number,
  scale: number = 10,
): { data: Uint8ClampedArray; width: number; height: number } => {
  const margin = 4
  const total = (size + margin * 2) * scale
  const data = new Uint8ClampedArray(total * total * 4)

  // Fill with white
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255
    data[i + 1] = 255
    data[i + 2] = 255
    data[i + 3] = 255
  }

  // Draw dark modules as black
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c]) {
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const py = (r + margin) * scale + dy
            const px = (c + margin) * scale + dx
            const idx = (py * total + px) * 4
            data[idx] = 0
            data[idx + 1] = 0
            data[idx + 2] = 0
            data[idx + 3] = 255
          }
        }
      }
    }
  }
  return { data, width: total, height: total }
}

describe('QR code generation', () => {
  const testCases: { text: string; ec: ErrorCorrectionLevel }[] = [
    { text: 'hello world', ec: 'M' },
    { text: 'https://example.com', ec: 'M' },
    { text: '1', ec: 'M' },
    // Longer text to exercise version >= 7 (version info area)
    {
      text: 'The quick brown fox jumps over the lazy dog. 0123456789 ABCDEFGHIJKLMNOP',
      ec: 'M',
    },
    // Different EC levels
    { text: 'hello world', ec: 'L' },
    { text: 'hello world', ec: 'Q' },
    { text: 'hello world', ec: 'H' },
  ]

  for (const { text, ec } of testCases) {
    it(`generates a scannable QR code for "${text}" (EC=${ec})`, () => {
      const qr = generateQR(text, ec)
      expect(qr).not.toBeNull()

      const { data, width, height } = modulesToImageData(qr!.modules, qr!.size)
      const result = jsQR(data, width, height)

      expect(result).not.toBeNull()
      expect(result!.data).toBe(text)
    })
  }

  it('returns null for text that exceeds max capacity', () => {
    // A very long string should exceed version-40 capacity at high EC
    const longText = 'A'.repeat(10000)
    const qr = generateQR(longText, 'H')
    expect(qr).toBeNull()
  })
})
