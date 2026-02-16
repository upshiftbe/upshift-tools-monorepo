import type { QRCode } from '~/lib/qr'

interface QrCodeSvgProps {
  qr: QRCode
  fgColor?: string
  bgColor?: string
  className?: string
  id?: string
}

const QrCodeSvg = ({
  qr,
  fgColor = '#000000',
  bgColor = '#ffffff',
  className,
  id,
}: QrCodeSvgProps) => {
  const margin = 4 // quiet zone (spec recommends 4 modules)
  const total = qr.size + margin * 2

  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      className={className}
    >
      <rect width={total} height={total} fill={bgColor} />
      {qr.modules.map((row, r) =>
        row.map((dark, c) =>
          dark ? (
            <rect
              key={`${r}-${c}`}
              x={c + margin}
              y={r + margin}
              width={1}
              height={1}
              fill={fgColor}
            />
          ) : null,
        ),
      )}
    </svg>
  )
}

export default QrCodeSvg
