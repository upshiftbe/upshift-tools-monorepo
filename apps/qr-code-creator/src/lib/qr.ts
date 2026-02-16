'use client'

/**
 * QR Code Generator — built from scratch (no external libraries).
 *
 * Implements the full QR code encoding pipeline per ISO 18004:
 *   GF(256) arithmetic → Reed-Solomon EC → byte-mode encoding →
 *   matrix construction → masking → format / version info.
 *
 * Supports versions 1-40 and all four error-correction levels.
 */

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export interface QRCode {
  /** 2-D grid: true = dark module, false = light module */
  modules: boolean[][]
  /** Number of modules per side */
  size: number
  /** QR version (1-40) */
  version: number
}

// ────────────────────────────────────────────────────────────
// GF(256) field arithmetic  (primitive poly 0x11D)
// ────────────────────────────────────────────────────────────

const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)

{
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x
    GF_LOG[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255]
  }
}

const gfMul = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0
  return GF_EXP[GF_LOG[a] + GF_LOG[b]]
}

// ────────────────────────────────────────────────────────────
// Reed-Solomon error-correction encoding
// ────────────────────────────────────────────────────────────

/** Build the RS generator polynomial of given degree (highest-coeff first). */
const buildGenPoly = (degree: number): number[] => {
  let g = [1]
  for (let i = 0; i < degree; i++) {
    const next = new Array<number>(g.length + 1)
    next[0] = g[0]
    for (let j = 1; j < g.length; j++) {
      next[j] = g[j] ^ gfMul(GF_EXP[i], g[j - 1])
    }
    next[g.length] = gfMul(GF_EXP[i], g[g.length - 1])
    g = next
  }
  return g
}

/** Return `ecCount` error-correction codewords for `data`. */
const rsEncode = (data: number[], ecCount: number): number[] => {
  const gen = buildGenPoly(ecCount)
  const r = new Array<number>(ecCount).fill(0)

  for (const byte of data) {
    const f = byte ^ r[0]
    for (let i = 0; i < ecCount - 1; i++) {
      r[i] = r[i + 1] ^ gfMul(f, gen[i + 1])
    }
    r[ecCount - 1] = gfMul(f, gen[ecCount])
  }
  return r
}

// ────────────────────────────────────────────────────────────
// Data tables (ISO 18004)
// ────────────────────────────────────────────────────────────

const EC_IDX: Record<ErrorCorrectionLevel, number> = { L: 0, M: 1, Q: 2, H: 3 }

/**
 * EC_BLOCKS[version-1][ecIdx] =
 *   [ecPerBlock, g1Blocks, g1DataPerBlock, g2Blocks, g2DataPerBlock]
 */
// prettier-ignore
const EC_BLOCKS: [number, number, number, number, number][][] = [
  /* V1  */ [[7,1,19,0,0],[10,1,16,0,0],[13,1,13,0,0],[17,1,9,0,0]],
  /* V2  */ [[10,1,34,0,0],[16,1,28,0,0],[22,1,22,0,0],[28,1,16,0,0]],
  /* V3  */ [[15,1,55,0,0],[26,1,44,0,0],[18,2,17,0,0],[22,2,13,0,0]],
  /* V4  */ [[20,1,80,0,0],[18,2,32,0,0],[26,2,24,0,0],[16,4,9,0,0]],
  /* V5  */ [[26,1,108,0,0],[24,2,43,0,0],[18,2,15,2,16],[22,2,11,2,12]],
  /* V6  */ [[18,2,68,0,0],[16,4,27,0,0],[24,4,19,0,0],[28,4,15,0,0]],
  /* V7  */ [[20,2,78,0,0],[18,4,31,0,0],[18,2,14,4,15],[26,4,13,1,14]],
  /* V8  */ [[24,2,97,0,0],[22,2,38,2,39],[22,4,18,2,19],[26,4,14,2,15]],
  /* V9  */ [[30,2,116,0,0],[22,3,36,2,37],[20,4,16,4,17],[24,4,12,4,13]],
  /* V10 */ [[18,2,68,2,69],[26,4,43,1,44],[24,6,19,2,20],[28,6,15,2,16]],
  /* V11 */ [[20,4,81,0,0],[30,1,50,4,51],[28,4,22,4,23],[24,3,12,8,13]],
  /* V12 */ [[24,2,92,2,93],[22,6,36,2,37],[26,4,20,6,21],[28,7,14,4,15]],
  /* V13 */ [[26,4,107,0,0],[22,8,37,1,38],[24,8,20,4,21],[22,12,11,4,12]],
  /* V14 */ [[30,3,115,1,116],[24,4,40,5,41],[20,11,16,5,17],[24,11,12,5,13]],
  /* V15 */ [[22,5,87,1,88],[24,5,41,5,42],[30,5,24,7,25],[24,11,12,7,13]],
  /* V16 */ [[24,5,98,1,99],[28,7,45,3,46],[24,15,19,2,20],[30,3,15,13,16]],
  /* V17 */ [[28,1,107,5,108],[28,10,46,1,47],[28,1,22,15,23],[28,2,14,17,15]],
  /* V18 */ [[30,5,120,1,121],[26,9,43,4,44],[28,17,22,1,23],[28,2,14,19,15]],
  /* V19 */ [[28,3,113,4,114],[26,3,44,11,45],[26,17,21,4,22],[26,9,13,16,14]],
  /* V20 */ [[28,3,107,5,108],[26,3,41,13,42],[28,15,24,5,25],[28,15,15,10,16]],
  /* V21 */ [[28,4,116,4,117],[26,17,42,0,0],[30,17,22,6,23],[28,19,16,6,17]],
  /* V22 */ [[28,2,111,7,112],[28,17,46,0,0],[24,7,24,16,25],[30,34,13,0,0]],
  /* V23 */ [[30,4,121,5,122],[28,4,47,14,48],[30,11,24,14,25],[30,16,15,14,16]],
  /* V24 */ [[30,6,117,4,118],[28,6,45,14,46],[30,11,24,16,25],[30,30,16,2,17]],
  /* V25 */ [[26,8,106,4,107],[28,8,47,13,48],[30,7,24,22,25],[30,22,15,13,16]],
  /* V26 */ [[28,10,114,2,115],[28,19,46,4,47],[28,28,22,6,23],[30,33,16,4,17]],
  /* V27 */ [[30,8,122,4,123],[28,22,45,3,46],[30,8,23,26,24],[30,12,15,28,16]],
  /* V28 */ [[30,3,117,10,118],[28,3,45,23,46],[30,4,24,31,25],[30,11,15,31,16]],
  /* V29 */ [[30,7,116,7,117],[28,21,45,7,46],[30,1,23,37,24],[30,19,15,26,16]],
  /* V30 */ [[30,5,115,10,116],[28,19,47,10,48],[30,15,24,25,25],[30,23,15,25,16]],
  /* V31 */ [[30,13,115,3,116],[28,2,46,29,47],[30,42,24,1,25],[30,23,15,28,16]],
  /* V32 */ [[30,17,115,0,0],[28,10,46,23,47],[30,10,24,35,25],[30,19,15,35,16]],
  /* V33 */ [[30,17,115,1,116],[28,14,46,21,47],[30,29,24,19,25],[30,11,15,46,16]],
  /* V34 */ [[30,13,115,6,116],[28,14,46,23,47],[30,44,24,7,25],[30,59,16,1,17]],
  /* V35 */ [[30,12,121,7,122],[28,12,47,26,48],[30,39,24,14,25],[30,22,15,41,16]],
  /* V36 */ [[30,6,121,14,122],[28,6,47,34,48],[30,46,24,10,25],[30,2,15,64,16]],
  /* V37 */ [[30,17,122,4,123],[28,29,46,14,47],[30,49,24,10,25],[30,24,15,46,16]],
  /* V38 */ [[30,4,122,18,123],[28,13,46,32,47],[30,48,24,14,25],[30,42,15,32,16]],
  /* V39 */ [[30,20,117,4,118],[28,40,47,7,48],[30,43,24,22,25],[30,10,15,67,16]],
  /* V40 */ [[30,19,118,6,119],[28,18,47,31,48],[30,34,24,34,25],[30,20,15,61,16]],
]

/** Alignment-pattern center coordinates per version. */
// prettier-ignore
const ALIGN_POS: number[][] = [
  /*V1*/[],/*V2*/[6,18],/*V3*/[6,22],/*V4*/[6,26],/*V5*/[6,30],/*V6*/[6,34],
  /*V7*/[6,22,38],/*V8*/[6,24,42],/*V9*/[6,26,46],/*V10*/[6,28,50],
  /*V11*/[6,30,54],/*V12*/[6,32,58],/*V13*/[6,34,62],
  /*V14*/[6,26,46,66],/*V15*/[6,26,48,70],/*V16*/[6,26,50,74],
  /*V17*/[6,30,54,78],/*V18*/[6,30,56,82],/*V19*/[6,30,58,86],/*V20*/[6,34,62,90],
  /*V21*/[6,28,50,72,94],/*V22*/[6,26,50,74,98],/*V23*/[6,30,54,78,102],
  /*V24*/[6,28,54,80,106],/*V25*/[6,32,58,84,110],/*V26*/[6,30,58,86,114],
  /*V27*/[6,34,62,90,118],
  /*V28*/[6,26,50,74,98,122],/*V29*/[6,30,54,78,102,126],
  /*V30*/[6,26,52,78,104,130],/*V31*/[6,30,56,82,108,134],
  /*V32*/[6,34,60,86,112,138],/*V33*/[6,30,58,86,114,142],
  /*V34*/[6,34,62,90,118,146],
  /*V35*/[6,30,54,78,102,126,150],/*V36*/[6,24,50,76,102,128,154],
  /*V37*/[6,28,54,80,106,132,158],/*V38*/[6,32,58,84,110,136,162],
  /*V39*/[6,26,54,82,110,138,166],/*V40*/[6,30,58,86,114,142,170],
]

/** Remainder bits to pad after EC codewords (per version). */
// prettier-ignore
const REM_BITS = [
  0,7,7,7,7,7,0,0,0,0, 0,0,0,3,3,3,3,3,3,3,
  4,4,4,4,4,4,4,3,3,3, 3,3,3,3,0,0,0,0,0,0,
]

// ────────────────────────────────────────────────────────────
// Version selection
// ────────────────────────────────────────────────────────────

const getMinVersion = (byteLen: number, ec: ErrorCorrectionLevel): number => {
  const idx = EC_IDX[ec]
  for (let v = 1; v <= 40; v++) {
    const [, g1n, g1k, g2n, g2k] = EC_BLOCKS[v - 1][idx]
    const cap = (g1n * g1k + g2n * g2k) * 8
    const need = 4 + (v <= 9 ? 8 : 16) + byteLen * 8
    if (need <= cap) return v
  }
  return -1
}

// ────────────────────────────────────────────────────────────
// Data encoding (byte mode only — covers all UTF-8)
// ────────────────────────────────────────────────────────────

const encodeData = (
  bytes: Uint8Array,
  version: number,
  ec: ErrorCorrectionLevel,
): number[] => {
  const idx = EC_IDX[ec]
  const [, g1n, g1k, g2n, g2k] = EC_BLOCKS[version - 1][idx]
  const totalBits = (g1n * g1k + g2n * g2k) * 8
  const ccBits = version <= 9 ? 8 : 16

  const bits: number[] = []
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1)
  }

  push(0b0100, 4) // byte-mode indicator
  push(bytes.length, ccBits) // character count
  for (const b of bytes) push(b, 8)

  // terminator (up to 4 zeros)
  const term = Math.min(4, totalBits - bits.length)
  for (let i = 0; i < term; i++) bits.push(0)

  // pad to byte boundary
  while (bits.length % 8) bits.push(0)

  // pad codewords
  const pads = [0xec, 0x11]
  let pi = 0
  while (bits.length < totalBits) {
    push(pads[pi & 1], 8)
    pi++
  }

  // bits → codewords
  const cw: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j]
    cw.push(byte)
  }
  return cw
}

// ────────────────────────────────────────────────────────────
// Interleaving (data + EC)
// ────────────────────────────────────────────────────────────

const interleave = (
  data: number[],
  version: number,
  ec: ErrorCorrectionLevel,
): number[] => {
  const idx = EC_IDX[ec]
  const [ecPer, g1n, g1k, g2n, g2k] = EC_BLOCKS[version - 1][idx]

  const dBlocks: number[][] = []
  let off = 0
  for (let i = 0; i < g1n; i++) {
    dBlocks.push(data.slice(off, off + g1k))
    off += g1k
  }
  for (let i = 0; i < g2n; i++) {
    dBlocks.push(data.slice(off, off + g2k))
    off += g2k
  }

  const ecBlocks = dBlocks.map((b) => rsEncode(b, ecPer))

  const out: number[] = []
  const maxD = Math.max(g1k, g2k || 0)
  for (let i = 0; i < maxD; i++) {
    for (const b of dBlocks) if (i < b.length) out.push(b[i])
  }
  for (let i = 0; i < ecPer; i++) {
    for (const b of ecBlocks) out.push(b[i])
  }
  return out
}

// ────────────────────────────────────────────────────────────
// Matrix helpers
// ────────────────────────────────────────────────────────────

interface Matrix {
  mod: boolean[][]
  res: boolean[][] // reserved (function patterns)
}

const makeGrid = (size: number): boolean[][] =>
  Array.from({ length: size }, () => new Array<boolean>(size).fill(false))

/** Place 7×7 finder pattern + 1-module separator. */
const placeFinder = (m: Matrix, size: number, r0: number, c0: number) => {
  for (let dr = -1; dr <= 7; dr++) {
    for (let dc = -1; dc <= 7; dc++) {
      const r = r0 + dr
      const c = c0 + dc
      if (r < 0 || r >= size || c < 0 || c >= size) continue
      const dark =
        (dr >= 0 && dr <= 6 && (dc === 0 || dc === 6)) ||
        (dc >= 0 && dc <= 6 && (dr === 0 || dr === 6)) ||
        (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)
      m.mod[r][c] = dark
      m.res[r][c] = true
    }
  }
}

/** Place 5×5 alignment pattern centred at (row, col). */
const placeAlign = (m: Matrix, row: number, col: number) => {
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      m.mod[row + dr][col + dc] =
        Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0)
      m.res[row + dr][col + dc] = true
    }
  }
}

/** Reserve cells that will hold format information (15 bits × 2). */
const reserveFormat = (res: boolean[][], size: number) => {
  for (let i = 0; i < 9; i++) {
    res[8][i] = true
    res[i][8] = true
  }
  for (let i = 0; i < 8; i++) res[8][size - 1 - i] = true
  for (let i = 0; i < 7; i++) res[size - 1 - i][8] = true
}

/** Reserve cells that will hold version information (18 bits × 2). */
const reserveVersion = (res: boolean[][], size: number) => {
  for (let i = 0; i < 18; i++) {
    const a = Math.floor(i / 3)
    const b = size - 11 + (i % 3)
    res[b][a] = true
    res[a][b] = true
  }
}

/** Build an empty matrix with all function patterns placed. */
const buildMatrix = (version: number): { m: Matrix; size: number } => {
  const size = version * 4 + 17
  const m: Matrix = { mod: makeGrid(size), res: makeGrid(size) }

  // Finder patterns (top-left, top-right, bottom-left)
  placeFinder(m, size, 0, 0)
  placeFinder(m, size, 0, size - 7)
  placeFinder(m, size, size - 7, 0)

  // Alignment patterns
  if (version >= 2) {
    const pos = ALIGN_POS[version - 1]
    for (const r of pos) {
      for (const c of pos) {
        if (
          (r <= 8 && c <= 8) ||
          (r <= 8 && c >= size - 8) ||
          (r >= size - 8 && c <= 8)
        )
          continue
        placeAlign(m, r, c)
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    const dark = i % 2 === 0
    if (!m.res[6][i]) {
      m.mod[6][i] = dark
      m.res[6][i] = true
    }
    if (!m.res[i][6]) {
      m.mod[i][6] = dark
      m.res[i][6] = true
    }
  }

  // Dark module (always present)
  m.mod[size - 8][8] = true
  m.res[size - 8][8] = true

  // Reserve format & version areas
  reserveFormat(m.res, size)
  if (version >= 7) reserveVersion(m.res, size)

  return { m, size }
}

// ────────────────────────────────────────────────────────────
// Data placement (zigzag)
// ────────────────────────────────────────────────────────────

const placeData = (m: Matrix, size: number, bits: number[]) => {
  let idx = 0
  let up = true

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5 // skip timing column

    for (let v = 0; v < size; v++) {
      const row = up ? size - 1 - v : v
      for (let j = 0; j < 2; j++) {
        const col = right - j
        if (m.res[row][col]) continue
        m.mod[row][col] = idx < bits.length && bits[idx] === 1
        idx++
      }
    }
    up = !up
  }
}

// ────────────────────────────────────────────────────────────
// Masking
// ────────────────────────────────────────────────────────────

type MaskFn = (r: number, c: number) => boolean

const MASKS: MaskFn[] = [
  (r, c) => (r + c) % 2 === 0,
  (r, _c) => r % 2 === 0,
  (_r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
]

const applyMask = (
  mod: boolean[][],
  res: boolean[][],
  size: number,
  maskIdx: number,
) => {
  const fn = MASKS[maskIdx]
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!res[r][c] && fn(r, c)) mod[r][c] = !mod[r][c]
    }
  }
}

// ────────────────────────────────────────────────────────────
// Penalty scoring
// ────────────────────────────────────────────────────────────

const calcPenalty = (mod: boolean[][], size: number): number => {
  let pen = 0

  // Rule 1 — runs of 5+ same-colour modules (rows then cols)
  for (let r = 0; r < size; r++) {
    let cnt = 1
    for (let c = 1; c < size; c++) {
      if (mod[r][c] === mod[r][c - 1]) {
        cnt++
      } else {
        if (cnt >= 5) pen += cnt - 2
        cnt = 1
      }
    }
    if (cnt >= 5) pen += cnt - 2
  }
  for (let c = 0; c < size; c++) {
    let cnt = 1
    for (let r = 1; r < size; r++) {
      if (mod[r][c] === mod[r - 1][c]) {
        cnt++
      } else {
        if (cnt >= 5) pen += cnt - 2
        cnt = 1
      }
    }
    if (cnt >= 5) pen += cnt - 2
  }

  // Rule 2 — 2×2 same-colour blocks
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = mod[r][c]
      if (v === mod[r][c + 1] && v === mod[r + 1][c] && v === mod[r + 1][c + 1])
        pen += 3
    }
  }

  // Rule 3 — finder-like patterns (10111010000 or 00001011101)
  const p1 = [
    true,
    false,
    true,
    true,
    true,
    false,
    true,
    false,
    false,
    false,
    false,
  ]
  const p2 = [
    false,
    false,
    false,
    false,
    true,
    false,
    true,
    true,
    true,
    false,
    true,
  ]

  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - 11; c++) {
      let m1 = true
      let m2 = true
      for (let k = 0; k < 11; k++) {
        if (mod[r][c + k] !== p1[k]) m1 = false
        if (mod[r][c + k] !== p2[k]) m2 = false
        if (!m1 && !m2) break
      }
      if (m1) pen += 40
      if (m2) pen += 40
    }
  }
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - 11; r++) {
      let m1 = true
      let m2 = true
      for (let k = 0; k < 11; k++) {
        if (mod[r + k][c] !== p1[k]) m1 = false
        if (mod[r + k][c] !== p2[k]) m2 = false
        if (!m1 && !m2) break
      }
      if (m1) pen += 40
      if (m2) pen += 40
    }
  }

  // Rule 4 — dark-module proportion
  let dark = 0
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) if (mod[r][c]) dark++
  const pct = (dark * 100) / (size * size)
  pen += Math.floor(Math.abs(pct - 50) / 5) * 10

  return pen
}

// ────────────────────────────────────────────────────────────
// Format & version information (BCH-encoded)
// ────────────────────────────────────────────────────────────

const writeFormatInfo = (
  mod: boolean[][],
  size: number,
  ecIdx: number,
  mask: number,
) => {
  const EC_IND = [1, 0, 3, 2] // L M Q H → binary indicators
  const d = (EC_IND[ecIdx] << 3) | mask
  let rem = d << 10
  for (let i = 4; i >= 0; i--) {
    if (rem & (1 << (i + 10))) rem ^= 0x537 << i
  }
  const info = ((d << 10) | rem) ^ 0x5412

  for (let i = 0; i < 15; i++) {
    const dark = ((info >> i) & 1) === 1

    // Copy along column 8 (top → skip timing → bottom)
    if (i < 6) {
      mod[i][8] = dark
    } else if (i < 8) {
      mod[i + 1][8] = dark // skip row 6 (timing)
    } else {
      mod[size - 15 + i][8] = dark
    }

    // Copy along row 8 (right → skip timing → left)
    if (i < 8) {
      mod[8][size - 1 - i] = dark
    } else if (i < 9) {
      mod[8][15 - i - 1 + 1] = dark // = mod[8][7]
    } else {
      mod[8][15 - i - 1] = dark
    }
  }

  // Dark module (always present)
  mod[size - 8][8] = true
}

const writeVersionInfo = (mod: boolean[][], size: number, version: number) => {
  let rem = version << 12
  for (let i = 5; i >= 0; i--) {
    if (rem & (1 << (i + 12))) rem ^= 0x1f25 << i
  }
  const info = (version << 12) | rem

  for (let i = 0; i < 18; i++) {
    const dark = ((info >> i) & 1) === 1
    const a = Math.floor(i / 3)
    const b = size - 11 + (i % 3)
    mod[b][a] = dark // near bottom-left
    mod[a][b] = dark // near top-right
  }
}

// ────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────

/**
 * Generate a QR code for the given text.
 * Returns `null` when the payload exceeds version-40 capacity.
 */
export const generateQR = (
  text: string,
  ecLevel: ErrorCorrectionLevel = 'M',
): QRCode | null => {
  if (text.length === 0) return null

  const bytes = new TextEncoder().encode(text)
  const version = getMinVersion(bytes.length, ecLevel)
  if (version === -1) return null

  // Encode → EC → interleave
  const dataCW = encodeData(bytes, version, ecLevel)
  const final = interleave(dataCW, version, ecLevel)

  // Codewords → bit stream (+ remainder bits)
  const bits: number[] = []
  for (const byte of final) {
    for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1)
  }
  for (let i = 0; i < REM_BITS[version - 1]; i++) bits.push(0)

  // Build matrix & place data
  const { m, size } = buildMatrix(version)
  placeData(m, size, bits)

  // Find best mask (lowest penalty)
  const ecIdx = EC_IDX[ecLevel]
  let bestMask = 0
  let bestPen = Infinity

  for (let mask = 0; mask < 8; mask++) {
    const test = m.mod.map((r) => [...r])
    applyMask(test, m.res, size, mask)
    writeFormatInfo(test, size, ecIdx, mask)
    if (version >= 7) writeVersionInfo(test, size, version)
    const pen = calcPenalty(test, size)
    if (pen < bestPen) {
      bestPen = pen
      bestMask = mask
    }
  }

  // Apply best mask + write final info
  applyMask(m.mod, m.res, size, bestMask)
  writeFormatInfo(m.mod, size, ecIdx, bestMask)
  if (version >= 7) writeVersionInfo(m.mod, size, version)

  return { modules: m.mod, size, version }
}
