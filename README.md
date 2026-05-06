# upshift-tools-monorepo

Nx monorepo with six Vite + TanStack Router apps for Upshift tools.

## Apps

| App                         | Port | Description                                |
| --------------------------- | ---- | ------------------------------------------ |
| **tools-overview**          | 3000 | Overview landing page — links to all tools |
| **qr-code-creator**         | 3011 | Create and customize QR codes              |
| **email-signature**         | 3002 | Create professional email signatures       |
| **schema-markup-generator** | 3003 | Generate JSON-LD structured data for SEO   |
| **image-optimizer**         | 3004 | Compress and convert images (WebP / AVIF) in the browser |
| **mockup-generator**        | 3005 | Frame screenshots in device mockups, export PNG |

Ports match [`apps/tools-overview/src/config/tools.ts`](apps/tools-overview/src/config/tools.ts) (`devPort`).

## Tech Stack

- **Build:** Vite 7, React 19
- **Routing:** TanStack Router
- **Styling:** Tailwind CSS v4
- **Deployment:** Netlify

## Getting Started

```bash
# Install dependencies
pnpm install

# Run a single app
pnpm dev:overview                  # http://localhost:3000
pnpm dev:qr-code-creator           # http://localhost:3011
pnpm dev:email-signature           # http://localhost:3002
pnpm dev:schema-markup-generator   # http://localhost:3003
pnpm dev:image-optimizer           # http://localhost:3004
pnpm dev:mockup-generator          # http://localhost:3005

# Or use Nx directly
nx dev tools-overview
nx dev qr-code-creator
nx dev email-signature
nx dev schema-markup-generator
nx dev image-optimizer
nx dev mockup-generator

# Build all apps
pnpm build
```

## Netlify Deployment

Deploy all six apps as separate Netlify sites from this monorepo.

### Setup

1. **Create six Netlify sites** from the same repository (Add new project → Import from Git → select this repo, then repeat for each app).

2. **For each site**, set the **Package directory** in Build settings:

   - Site 1 (overview): `apps/tools-overview`
   - Site 2 (QR): `apps/qr-code-creator`
   - Site 3 (email): `apps/email-signature`
   - Site 4 (schema): `apps/schema-markup-generator`
   - Site 5 (images): `apps/image-optimizer`
   - Site 6 (mockups): `apps/mockup-generator`

3. **Leave Base directory** unset (repository root) so `pnpm install` and builds run from root.

### Build commands

Each app’s `netlify.toml` defines:

- `command`: `pnpm nx build <project>`
- `publish`: `apps/<project>/dist`
- `ignore`: only build when that app or `libs/` changes

## Project Structure

```
apps/
├── tools-overview/
├── qr-code-creator/
├── email-signature/
├── schema-markup-generator/
├── image-optimizer/
└── mockup-generator/
libs/
└── shared-ui/
```
