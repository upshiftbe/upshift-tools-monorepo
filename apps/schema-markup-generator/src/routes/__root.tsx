import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { AppShell } from "@upshift-tools/shared-ui";
import { Code2 } from "lucide-react";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "color-scheme", content: "light dark" },
      { title: "Schema Markup Generator" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <AppShell
        navbar={{
          logo: (
            <>
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-tight">
                Schema Markup
              </span>
            </>
          ),
          logoHref: "/",
          links: [
            {
              label: "All Tools",
              href: import.meta.env.VITE_OVERVIEW_URL || (import.meta.env.DEV ? "http://localhost:3000" : "https://tools.upshift.be"),
            },
          ],
        }}
        footer={true}
      >
        <Outlet />
      </AppShell>
      <TanStackRouterDevtools position="bottom-right" />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
