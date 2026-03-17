export const APP_URLS = {
  TOOLS_OVERVIEW: "https://tools.upshift.be",
  QR_CODE_CREATOR: "https://qr-code-maken.upshift.be",
  SCHEMA_MARKUP_GENERATOR: "https://schema-markup-generator.upshift.be",
  EMAIL_SIGNATURE: "https://email-signature.upshift.be",
} as const;

export type AppUrlKey = keyof typeof APP_URLS;
