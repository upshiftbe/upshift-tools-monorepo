import type { LabelHTMLAttributes } from 'react'
import { cn } from '~/lib/utils'

const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('block text-sm font-medium text-slate-300', className)} {...props} />
)
export { Label }
