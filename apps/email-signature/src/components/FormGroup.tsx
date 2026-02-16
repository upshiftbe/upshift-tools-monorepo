import type { FormGroup as FormGroupType } from '~/types'
import { FIELD_MAP } from '~/config/formConfig'
import { FieldGroup } from './ui/form'
import { FormField } from './FormField'
import type { ChangeEvent } from 'react'

type FormGroupProps = {
  group: FormGroupType
  formState: Record<string, string>
  errors: Record<string, string>
  onChange: (id: string) => (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: (id: string) => () => void
}

export function FormGroup({ group, formState, errors, onChange, onBlur }: FormGroupProps) {
  return (
    <fieldset className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-5 shadow-inner">
      <legend className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">{group.title}</legend>
      <p className="text-sm text-slate-500">{group.description}</p>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          {group.fieldIds.map((fieldId) => {
            const field = FIELD_MAP[fieldId]
            if (!field) return null
            return (
              <FormField
                key={field.id}
                field={field}
                value={formState[field.id] ?? ''}
                error={errors[field.id]}
                onChange={onChange}
                onBlur={onBlur}
              />
            )
          })}
        </div>
      </FieldGroup>
    </fieldset>
  )
}
