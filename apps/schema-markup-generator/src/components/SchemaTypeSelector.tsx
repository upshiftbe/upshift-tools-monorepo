import { Select } from '@upshift-tools/shared-ui'
import type { SelectHTMLAttributes } from 'react'
import { SCHEMA_TYPES } from '~/types/schema'
import type { SchemaType } from '~/types/schema'

interface SchemaTypeSelectorProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'value' | 'onChange'> {
  value: SchemaType
  onValueChange: (value: SchemaType) => void
}

export const SchemaTypeSelector = ({ value, onValueChange, ...props }: SchemaTypeSelectorProps) => (
  <Select value={value} onChange={(e) => onValueChange(e.target.value as SchemaType)} {...props}>
    {SCHEMA_TYPES.map((schema) => (
      <option key={schema.type} value={schema.type}>
        {schema.label}
      </option>
    ))}
  </Select>
)
