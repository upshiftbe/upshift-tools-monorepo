import mapPinSvg from '~/assets/signature-icons/map-pin.svg?raw';
import mailSvg from '~/assets/signature-icons/mail.svg?raw';
import phoneSvg from '~/assets/signature-icons/phone.svg?raw';

/** Lucide-derived SVGs as data URLs for email-safe <img src> (clipboard HTML embeds the payload). */
function svgToDataUrl(svg: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

export const SIGNATURE_ICON_PHONE = svgToDataUrl(phoneSvg);
export const SIGNATURE_ICON_MAIL = svgToDataUrl(mailSvg);
export const SIGNATURE_ICON_MAP_PIN = svgToDataUrl(mapPinSvg);
