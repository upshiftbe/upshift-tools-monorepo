import { z } from 'zod'
import { isSafeUrl } from './security'

const urlSchema = z
  .string()
  .refine(
    (val) => {
      if (!val.trim()) return true
      try {
        const url = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`
        return isSafeUrl(url)
      } catch {
        return false
      }
    },
    { message: 'Please enter a valid URL (http:// or https://)' }
  )
  .optional()

const logoUrlSchema = urlSchema.refine(
  (val) => {
    if (!val?.trim()) return true
    try {
      const normalized = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`
      const pathname = new URL(normalized).pathname.toLowerCase()
      return ['.png', '.jpg', '.jpeg', '.gif'].some((ext) => pathname.endsWith(ext))
    } catch {
      return false
    }
  },
  { message: 'Logo URL must point to a PNG, JPEG, or GIF file' }
)

const emailSchema = z
  .string()
  .refine((val) => !val.trim() || z.string().email().safeParse(val).success, { message: 'Please enter a valid email address' })
  .optional()

export const formSchema = z.object({
  'input-naam': z.string().max(400, 'Name is too long (max 400 characters)'),
  'input-functie': z.string().max(400, 'Role is too long (max 400 characters)'),
  'input-gsm': z.string().optional(),
  'input-email': emailSchema,
  'input-locatie-1': z.string().max(500, 'Location is too long (max 500 characters)'),
  'input-locatie-2': z.string().max(500, 'Location is too long (max 500 characters)').optional(),
  'input-logo-url': logoUrlSchema,
  'input-facebook': urlSchema,
  'input-linkedin': urlSchema,
  'input-instagram': urlSchema,
  'input-website': urlSchema,
})

export function validateField(fieldId: string, value: string): string | undefined {
  try {
    const schema = formSchema.shape[fieldId as keyof typeof formSchema.shape]
    if (!schema) return undefined
    schema.parse(value)
    return undefined
  } catch (err) {
    return err instanceof z.ZodError ? err.issues[0]?.message : 'Invalid value'
  }
}

export function validateForm(formState: Record<string, string>): { isValid: boolean; errors: Record<string, string> } {
  try {
    formSchema.parse(formState)
    return { isValid: true, errors: {} }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      err.issues.forEach((i) => {
        const path = i.path[0] as string
        if (path) errors[path] = i.message
      })
      return { isValid: false, errors }
    }
    return { isValid: false, errors: {} }
  }
}
