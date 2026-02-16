import type { FormGroup as FormGroupType } from '~/types'
import { FIELD_MAP } from '~/config/formConfig'
import { Card, CardContent, CardHeader } from '@upshift-tools/shared-ui'
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
    <Card className="bg-muted/30">
      <CardHeader className="pb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{group.title}</p>
        <p className="text-sm text-muted-foreground">{group.description}</p>
      </CardHeader>
      <CardContent className="pt-0">
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
      </CardContent>
    </Card>
  )
}
