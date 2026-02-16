import type { ChangeEvent } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui'
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
    <Card className="border border-slate-200 bg-white/90 text-slate-900 shadow-2xl shadow-slate-900/5">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-slate-900">Signature details</CardTitle>
            <CardDescription className="text-slate-500">Only the filled fields are copied into the final HTML snippet.</CardDescription>
          </div>
          <Button type="button" className="h-10 cursor-pointer border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-700 shadow-sm shadow-rose-200 hover:border-rose-300 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500/70" onClick={onReset}>
            Reset form
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pt-1 pb-6">
        <form className="space-y-6" autoComplete="off">
          {FORM_GROUPS.map((group) => (
            <FormGroup key={group.title} group={group} formState={formState} errors={errors} onChange={onFieldChange} onBlur={onFieldBlur} />
          ))}
        </form>
      </CardContent>
    </Card>
  )
}
