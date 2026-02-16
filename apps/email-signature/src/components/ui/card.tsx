import { cn } from '~/lib/utils'
import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

const Card = ({ className, ...props }: CardProps) => (
  <div className={cn('rounded-3xl border border-slate-800 bg-slate-950/60 shadow-2xl shadow-slate-950/40 backdrop-blur-lg', className)} {...props} />
)
const CardHeader = ({ className, ...props }: CardProps) => <div className={cn('space-y-1 px-6 pt-6 pb-3', className)} {...props} />
const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => <h2 className={cn('text-lg font-semibold text-white', className)} {...props} />
const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => <p className={cn('text-sm text-slate-400', className)} {...props} />
const CardContent = ({ className, ...props }: CardProps) => <div className={cn('flex flex-col gap-5 px-6 pb-6', className)} {...props} />
const CardFooter = ({ className, ...props }: CardProps) => <div className={cn('flex items-end justify-end gap-2 px-6 pt-2 pb-6', className)} {...props} />

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
