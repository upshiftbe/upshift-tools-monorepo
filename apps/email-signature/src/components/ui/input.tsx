import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '~/lib/utils'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'
export { Input }
