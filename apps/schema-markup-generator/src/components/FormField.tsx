import { Input, Textarea, Label, Select, cn } from '@upshift-tools/shared-ui'
import type { UseFormRegister, FieldError, Path } from 'react-hook-form'

interface FormFieldProps<T extends Record<string, unknown>> {
  label: string
  name: Path<T>
  register: UseFormRegister<T>
  error?: FieldError | { message?: string }
  required?: boolean
  type?: 'text' | 'url' | 'email' | 'date' | 'textarea' | 'select'
  placeholder?: string
  description?: string
  options?: { value: string; label: string }[]
  rows?: number
}

export function FormField<T extends Record<string, unknown>>({
  label,
  name,
  register,
  error,
  required = false,
  type = 'text',
  placeholder,
  description,
  options,
  rows = 4,
}: FormFieldProps<T>) {
  const fieldId = `field-${String(name)}`
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {type === 'textarea' ? (
        <Textarea id={fieldId} {...register(name)} placeholder={placeholder} rows={rows} className={error ? 'border-destructive' : ''} />
      ) : type === 'select' && options ? (
        <Select
          id={fieldId}
          {...register(name)}
          className={cn(error ? 'border-destructive' : '')}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input id={fieldId} type={type} {...register(name)} placeholder={placeholder} className={error ? 'border-destructive' : ''} />
      )}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  )
}
