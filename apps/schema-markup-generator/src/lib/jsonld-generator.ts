import type { SchemaFormData } from './schemas'

export function generateJSONLD(data: SchemaFormData): object {
  const cleanData = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(cleanData).filter((item) => item !== null && item !== undefined && item !== '')
    }
    if (obj && typeof obj === 'object') {
      const cleaned: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(obj)) {
        if (value === '' || value === null || value === undefined) continue
        if (Array.isArray(value)) {
          const cleanedArray = (value as unknown[]).map(cleanData).filter((item) => item !== null && item !== undefined && item !== '')
          if (cleanedArray.length > 0) cleaned[key] = cleanedArray
        } else if (typeof value === 'object' && value !== null) {
          const cleanedObj = cleanData(value) as Record<string, unknown>
          if (Object.keys(cleanedObj).length > 0) cleaned[key] = cleanedObj
        } else {
          cleaned[key] = value
        }
      }
      return cleaned
    }
    return obj
  }
  return cleanData(data) as object
}
