import type { ChangeEvent } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@upshift-tools/shared-ui'
import { FORM_GROUPS } from '~/config/formConfig'
import { FormGroup } from './FormGroup'

type SignatureFormProps = {
  formState: Record<string, string>
  errors: Record<string, string>
  onFieldChange: (id: string) => (event: ChangeEvent<HTMLInputElement>) => void
  onFieldBlur: (id: string) => () => void
  onReset: () => void
}

export function SignatureForm({ formState, errors, onFieldChange, onFieldBlur, onReset }: SignatureFormProps) {
  return (
    <Card className="shadow-[var(--shadow-sm)]">
      <CardHeader className="space-y-4 pb-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-foreground">Signature details</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Only the filled fields are copied into the final HTML snippet.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onReset} className="shrink-0">
            Reset form
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        <form className="space-y-6" autoComplete="off">
          {FORM_GROUPS.map((group) => (
            <FormGroup key={group.title} group={group} formState={formState} errors={errors} onChange={onFieldChange} onBlur={onFieldBlur} />
          ))}
        </form>
      </CardContent>
    </Card>
  )
}
