import type { ChangeEvent } from 'react'
import type { FormField as FormFieldType } from '~/types'
import { Input, Label, cn } from '@upshift-tools/shared-ui'

type FormFieldProps = {
  field: FormFieldType
  value: string
  error?: string
  onChange: (id: string) => (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: (id: string) => () => void
}

function Field({
  children,
  className,
  'data-invalid': dataInvalid,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { 'data-invalid'?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card px-4 py-3.5 shadow-[var(--shadow-sm)] transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 data-[invalid=true]:border-destructive data-[invalid=true]:ring-2 data-[invalid=true]:ring-destructive/20',
        className
      )}
      data-invalid={dataInvalid}
      {...rest}
    >
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function InputGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 overflow-hidden rounded-md border border-input bg-background">{children}</div>
}

export function FormField({ field, value, error, onChange, onBlur }: FormFieldProps) {
  const isWide = field.id.startsWith('input-locatie') || field.id === 'input-website'
  const isWebsite = field.id === 'input-website'
  const isPhone = field.id === 'input-gsm'
  const isEmail = field.id === 'input-email'

  return (
    <Field className={isWide ? 'sm:col-span-2' : ''} data-invalid={!!error}>
      <Label htmlFor={field.id} className="text-sm font-medium text-foreground">
        {field.label}
      </Label>
      {isWebsite || isPhone || isEmail ? (
        <InputGroup>
          <Input
            id={field.id}
            placeholder={field.placeholder}
            type={field.type ?? 'text'}
            value={value}
            onChange={onChange(field.id)}
            onBlur={onBlur(field.id)}
            className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-invalid={!!error}
            aria-describedby={error ? `${field.id}-error` : undefined}
          />
        </InputGroup>
      ) : (
        <Input
          id={field.id}
          placeholder={field.placeholder}
          type={field.type ?? 'text'}
          value={value}
          onChange={onChange(field.id)}
          onBlur={onBlur(field.id)}
          className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-invalid={!!error}
          aria-describedby={error ? `${field.id}-error` : undefined}
        />
      )}
      {error ? (
        <p id={`${field.id}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : (
        field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>
      )}
    </Field>
  )
}
