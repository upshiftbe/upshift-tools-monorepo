import type { ChangeEvent, FocusEvent } from 'react'
import type { FormField as FormFieldType } from '~/types'
import { Input } from './ui/input'
import { Field, FieldDescription, FieldLabel, InputGroup } from './ui/form'

type FormFieldProps = {
  field: FormFieldType
  value: string
  error?: string
  onChange: (id: string) => (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: (id: string) => () => void
}

export function FormField({ field, value, error, onChange, onBlur }: FormFieldProps) {
  const isWide = field.id.startsWith('input-locatie') || field.id === 'input-website'
  const isWebsite = field.id === 'input-website'
  const isPhone = field.id === 'input-gsm'
  const isEmail = field.id === 'input-email'

  return (
    <Field className={isWide ? 'sm:col-span-2' : ''} data-invalid={!!error}>
      <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
      {isWebsite || isPhone || isEmail ? (
        <InputGroup>
          <div className="flex-1">
            <Input
              id={field.id}
              placeholder={field.placeholder}
              type={field.type ?? 'text'}
              value={value}
              onChange={onChange(field.id)}
              onBlur={onBlur(field.id)}
              className="h-11 border-0 bg-transparent px-3 text-slate-900 shadow-none placeholder:text-slate-400 focus:border-0 focus:ring-0"
              aria-invalid={!!error}
              aria-describedby={error ? `${field.id}-error` : undefined}
            />
          </div>
        </InputGroup>
      ) : (
        <Input
          id={field.id}
          placeholder={field.placeholder}
          type={field.type ?? 'text'}
          value={value}
          onChange={onChange(field.id)}
          onBlur={onBlur(field.id)}
          className="h-11 border-0 bg-transparent px-0 text-slate-900 shadow-none placeholder:text-slate-400 focus:ring-0"
          aria-invalid={!!error}
          aria-describedby={error ? `${field.id}-error` : undefined}
        />
      )}
      {error ? (
        <p id={`${field.id}-error`} className="text-xs text-rose-600" role="alert">
          {error}
        </p>
      ) : (
        field.hint && <FieldDescription>{field.hint}</FieldDescription>
      )}
    </Field>
  )
}
