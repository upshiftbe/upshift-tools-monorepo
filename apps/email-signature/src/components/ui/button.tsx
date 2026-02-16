import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '~/lib/utils'

const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-lg border border-transparent bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/90 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
))
Button.displayName = 'Button'
export { Button }
