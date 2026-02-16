export type FormField = {
  id: string
  label: string
  placeholder: string
  type?: 'text' | 'url'
  hint?: string
}

export type FormGroup = {
  title: string
  description: string
  fieldIds: FormField['id'][]
}

export type FormState = Record<string, string>

export type TrimmedValues = {
  name: string
  role: string
  phone: string
  email: string
  location1: string
  location2: string
  websiteUrl: string
  websiteLabel: string
  facebook: string
  linkedin: string
  instagram: string
  logoUrl: string
}
