import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { APP_URLS, AppShell } from "@upshift-tools/shared-ui";
import { Mail } from "lucide-react";
import { APP_VERSION } from "~/config/constants";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <AppShell
        navbar={{
          logo: (
            <>
              <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-primary text-primary-foreground">
                <Mail className="h-4 w-4" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                Email Signature
              </span>
            </>
          ),
          logoHref: "/",
          links: [
            {
              label: "All Tools",
              href: import.meta.env.DEV
                ? "http://localhost:3000"
                : APP_URLS.TOOLS_OVERVIEW,
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
                  className="rounded-sm font-semibold text-[var(--brand-accent-strong)] transition-colors hover:text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Upshift
                </a>
              </span>
              <span className="text-xs sm:text-left">
                Bugs? Drop a note at{" "}
                <a
                  href="mailto:hello@upshift.be"
                  className="font-semibold text-[var(--brand-accent-strong)] transition-colors hover:text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
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
    </>
  );
}
