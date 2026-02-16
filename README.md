# upshift-tools-monorepo

Nx monorepo containing four TanStack Start apps for Upshift tools.

## Apps

| App | Port | Description |
|-----|------|-------------|
| **tools-overview** | 3000 | Overview landing page — links to all tools |
| **qr-code-creator** | 3001 | Create and customize QR codes |
| **email-signature** | 3002 | Create professional email signatures |
| **schema-markup-generator** | 3003 | Generate JSON-LD structured data for SEO |

## Tech Stack

- **Framework:** TanStack Start (React 19, Vite 7)
- **Routing:** TanStack Router
- **Styling:** Tailwind CSS v4
- **Deployment:** Netlify

## Getting Started

```bash
# Install dependencies
pnpm install

# Run a single app
pnpm dev:overview             # http://localhost:3000 — overview of all tools
pnpm dev:qr-code-creator     # http://localhost:3001
pnpm dev:email-signature     # http://localhost:3002
pnpm dev:schema-markup-generator  # http://localhost:3003

# Or use Nx directly
nx dev tools-overview
nx dev qr-code-creator
nx dev email-signature
nx dev schema-markup-generator

# Build all apps
pnpm build
```

## Project Structure

```
apps/
├── tools-overview/          # Landing page
├── qr-code-creator/
├── email-signature/
└── schema-markup-generator/
```