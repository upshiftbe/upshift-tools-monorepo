import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '~/components/Header'
import Footer from '~/components/Footer'

import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'QR Code Creator' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <TanStackRouterDevtools position="bottom-right" />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
