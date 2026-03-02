import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { AppShell } from "@upshift-tools/shared-ui";
import { Mail } from "lucide-react";
import { APP_VERSION } from "~/config/constants";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Email Signature Builder" },
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
              <Mail className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-tight">
                Email Signature
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
        footer={{
          content: (
            <div className="flex flex-col items-center justify-center gap-2 text-sm sm:flex-row sm:gap-4">
              <span className="text-xs">
                Version <span className="font-semibold">{APP_VERSION}</span>
              </span>
              <span className="hidden sm:inline" aria-hidden>
                •
              </span>
              <span className="text-xs">
                Created by{" "}
                <a
                  href="https://upshift.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm font-semibold text-primary transition-colors hover:text-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Upshift
                </a>
              </span>
              <span className="text-xs sm:text-left">
                Bugs? Drop a note at{" "}
                <a
                  href="mailto:hello@upshift.be"
                  className="font-semibold text-primary transition-colors hover:text-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  hello@upshift.be
                </a>
              </span>
            </div>
          ),
        }}
      >
        <Outlet />
      </AppShell>
      <TanStackRouterDevtools position="bottom-right" />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
