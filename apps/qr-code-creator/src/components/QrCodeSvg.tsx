import type { QRCode } from '~/lib/qr'

export type ModuleStyle = 'square' | 'rounded' | 'dots' | 'heart' | 'star' | 'diamond'

interface QrCodeSvgProps {
  qr: QRCode
  fgColor?: string
  bgColor?: string
  moduleStyle?: ModuleStyle
  margin?: number
  /** Data URL or URL of logo image. Use data URL for SVG/PNG export. */
  logoUrl?: string | null
  /** Show logo in the center of the QR code */
  logoCenter?: boolean
  /** Show logo in the three finder (corner) areas */
  logoCorners?: boolean
  className?: string
  id?: string
}

const MARGIN = 4

/** Heart path in 0–1 unit box */
const HEART_PATH =
  'M 0.5 0.92 C 0.15 0.55 0 0.38 0 0.22 C 0 0.06 0.14 0 0.32 0 C 0.45 0 0.5 0.12 0.5 0.18 C 0.5 0.12 0.55 0 0.68 0 C 0.86 0 1 0.06 1 0.22 C 1 0.38 0.85 0.55 0.5 0.92 Z'

/** 5-point star polygon in 0–1 unit box (centered 0.5,0.5) */
const STAR_POINTS =
  '0.5,0.06 0.61,0.36 0.93,0.36 0.68,0.56 0.79,0.94 0.5,0.74 0.21,0.94 0.32,0.56 0.07,0.36 0.39,0.36'

/** Diamond (rotated square) in 0–1 unit box */
const DIAMOND_POINTS = '0.5,0.02 0.98,0.5 0.5,0.98 0.02,0.5'

function renderModule(
  key: string,
  x: number,
  y: number,
  fgColor: string,
  moduleStyle: ModuleStyle
) {
  const cell = (ox: number, oy: number, pathOrPoints: string, type: 'path' | 'polygon') => {
    const s = 1
    const tx = x + ox * s
    const ty = y + oy * s
    if (type === 'path') {
      return (
        <path
          key={key}
          d={pathOrPoints}
          fill={fgColor}
          transform={`translate(${tx},${ty}) scale(${s})`}
        />
      )
    }
    return (
      <polygon
        key={key}
        points={pathOrPoints}
        fill={fgColor}
        transform={`translate(${tx},${ty}) scale(${s})`}
      />
    )
  }
  if (moduleStyle === 'dots') {
    return (
      <circle key={key} cx={x + 0.5} cy={y + 0.5} r={0.45} fill={fgColor} />
    )
  }
  if (moduleStyle === 'rounded') {
    return (
      <rect key={key} x={x} y={y} width={1} height={1} rx={0.28} ry={0.28} fill={fgColor} />
    )
  }
  if (moduleStyle === 'heart') {
    return cell(0, 0, HEART_PATH, 'path')
  }
  if (moduleStyle === 'star') {
    return cell(0, 0, STAR_POINTS, 'polygon')
  }
  if (moduleStyle === 'diamond') {
    return cell(0, 0, DIAMOND_POINTS, 'polygon')
  }
  return <rect key={key} x={x} y={y} width={1} height={1} fill={fgColor} />
}

const QrCodeSvg = ({
  qr,
  fgColor = '#000000',
  bgColor = '#ffffff',
  moduleStyle = 'square',
  margin: marginModules = MARGIN,
  logoUrl,
  logoCenter = false,
  logoCorners = false,
  className,
  id,
}: QrCodeSvgProps) => {
  const total = qr.size + marginModules * 2
  const showLogo = (logoCenter || logoCorners) && logoUrl

  // Logo sizes in module units
  const centerLogoSize = Math.max(5, Math.floor(qr.size * 0.22))
  const cornerLogoSize = 4
  const finderSize = 7
  const centerX = marginModules + (qr.size - centerLogoSize) / 2
  const centerY = marginModules + (qr.size - centerLogoSize) / 2
  const cornerPositions: [number, number][] = [
    [marginModules, marginModules],
    [marginModules + qr.size - finderSize, marginModules],
    [marginModules, marginModules + qr.size - finderSize],
  ]
  const cornerLogoOffset = (finderSize - cornerLogoSize) / 2

  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering={moduleStyle === 'dots' || moduleStyle === 'heart' || moduleStyle === 'star' || moduleStyle === 'diamond' ? 'geometricPrecision' : 'crispEdges'}
      className={className}
    >
      <defs>
        {showLogo && (
          <>
            <clipPath id={`${id ?? 'qr'}-center-clip`}>
              <rect x={centerX} y={centerY} width={centerLogoSize} height={centerLogoSize} rx={centerLogoSize * 0.2} ry={centerLogoSize * 0.2} />
            </clipPath>
            {[0, 1, 2].map((i) => (
              <clipPath key={i} id={`${id ?? 'qr'}-corner-clip-${i}`}>
                <rect
                  x={cornerPositions[i][0] + cornerLogoOffset}
                  y={cornerPositions[i][1] + cornerLogoOffset}
                  width={cornerLogoSize}
                  height={cornerLogoSize}
                  rx={cornerLogoSize * 0.25}
                  ry={cornerLogoSize * 0.25}
                />
              </clipPath>
            ))}
          </>
        )}
      </defs>
      <rect width={total} height={total} fill={bgColor} />
      {qr.modules.map((row, r) =>
        row.map((dark, c) => {
          if (!dark) return null
          const x = c + marginModules
          const y = r + marginModules
          return renderModule(`${r}-${c}`, x, y, fgColor, moduleStyle)
        }),
      )}
      {showLogo && (
        <>
          {logoCenter && (
            <>
              <rect x={centerX} y={centerY} width={centerLogoSize} height={centerLogoSize} fill={bgColor} rx={centerLogoSize * 0.2} ry={centerLogoSize * 0.2} />
              <image
                href={logoUrl}
                x={centerX}
                y={centerY}
                width={centerLogoSize}
                height={centerLogoSize}
                preserveAspectRatio="xMidYMid meet"
                clipPath={`url(#${id ?? 'qr'}-center-clip)`}
              />
            </>
          )}
          {logoCorners &&
            cornerPositions.map(([cx, cy], i) => (
              <g key={i}>
                <rect
                  x={cx + cornerLogoOffset}
                  y={cy + cornerLogoOffset}
                  width={cornerLogoSize}
                  height={cornerLogoSize}
                  fill={bgColor}
                  rx={cornerLogoSize * 0.25}
                  ry={cornerLogoSize * 0.25}
                />
                <image
                  href={logoUrl}
                  x={cx + cornerLogoOffset}
                  y={cy + cornerLogoOffset}
                  width={cornerLogoSize}
                  height={cornerLogoSize}
                  preserveAspectRatio="xMidYMid meet"
                  clipPath={`url(#${id ?? 'qr'}-corner-clip-${i})`}
                />
              </g>
            ))}
        </>
      )}
    </svg>
  )
}

export default QrCodeSvg
