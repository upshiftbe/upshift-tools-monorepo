import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-900">Email Signature</h1>
      <p className="mt-4 text-lg text-gray-600">
        Create professional email signatures in seconds.
      </p>
    </div>
  )
}
