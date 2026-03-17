# upshift-tools-monorepo

Nx monorepo containing four TanStack Start apps for Upshift tools.

## Apps

| App                         | Port | Description                                |
| --------------------------- | ---- | ------------------------------------------ |
| **tools-overview**          | 3000 | Overview landing page — links to all tools |
| **qr-code-creator**         | 3001 | Create and customize QR codes              |
| **email-signature**         | 3002 | Create professional email signatures       |
| **schema-markup-generator** | 3003 | Generate JSON-LD structured data for SEO   |

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

## Netlify Deployment

Deploy all four apps as separate Netlify sites from this monorepo.

### Setup

1. **Create 4 Netlify sites** from the same repository (Add new project → Import from Git → select this repo, then repeat for each app).

2. **For each site**, set the **Package directory** in Build settings:
   - Site 1 (overview): `apps/tools-overview`
   - Site 2 (QR): `apps/qr-code-creator`
   - Site 3 (email): `apps/email-signature`
   - Site 4 (schema): `apps/schema-markup-generator`

3. **Leave Base directory** unset (repository root) so `pnpm install` and builds run from root.

### Build commands

Each app’s `netlify.toml` defines:

- `command`: `pnpm nx build <project>`
- `publish`: `apps/<project>/dist/client`
- `ignore`: only build when that app or `libs/` changes

## Project Structure

```
apps/
├── tools-overview/          # Landing page
├── qr-code-creator/
├── email-signature/
└── schema-markup-generator/
libs/
└── shared-ui/               # Shared components
```
