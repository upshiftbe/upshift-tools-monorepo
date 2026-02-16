import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-900">
        Schema Markup Generator
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Generate JSON-LD structured data for better SEO.
      </p>
    </div>
  )
}
