# @upshift-tools/shared-ui

Shared React components and design tokens for Upshift Tools apps.

## Usage

### 1. Add dependency

```json
{
  "dependencies": {
    "@upshift-tools/shared-ui": "workspace:*"
  }
}
```

Then run `pnpm install` from the repo root.

### 2. Import components

```tsx
import {
  Button,
  Card,
  Input,
  Label,
  Textarea,
  AppShell,
  cn,
} from "@upshift-tools/shared-ui";
```

### 3. AppShell (navbar + footer layout)

```tsx
<AppShell
  navbar={{
    logo: (
      <>
        <Icon className="h-6 w-6 text-primary" />
        <span>My App</span>
      </>
    ),
    logoHref: "/",
    links: [{ label: "Home", href: "/" }],
  }}
  footer={true}
  // or footer={{ content: <CustomFooter /> }}
  // or footer={false} to hide
>
  <Outlet />
</AppShell>
```

### 4. Use the shared theme

In your app's main CSS (e.g. `src/styles/app.css`):

```css
@import "tailwindcss";
@import "@upshift-tools/shared-ui/theme.css";
@source "../../../../libs/shared-ui/src"; /* so Tailwind scans lib classes */

/* app-specific styles */
* {
  @apply border-border;
}
body {
  @apply bg-background text-foreground m-0;
}
```

## Exports

- **Components**: `Button`, `Card`, `Input`, `Label`, `Textarea`, `Select`, `AppShell`
- **Utils**: `cn()` (clsx + tailwind-merge)
- **Styles**: `@upshift-tools/shared-ui/theme.css` (design tokens, light/dark variables)

## Adding new components

1. Add the component in `libs/shared-ui/src/components/`
2. Export it from `libs/shared-ui/src/index.ts`
3. Ensure the consuming app has `@source` in its CSS pointing to `libs/shared-ui/src`
