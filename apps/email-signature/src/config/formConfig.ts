import type { FormField, FormGroup } from '~/types'

export const FORM_FIELDS: FormField[] = [
  { id: 'input-naam', label: 'Name', placeholder: 'Final boss' },
  { id: 'input-functie', label: 'Role', placeholder: 'Chiefest of chiefs' },
  { id: 'input-logo-url', label: 'Logo URL', placeholder: 'https://assets.example.com/logo.png', type: 'url', hint: 'Optional image that appears next to your info.' },
  { id: 'input-gsm', label: 'Phone', placeholder: '+32 470 01 23 45' },
  { id: 'input-email', label: 'Email', placeholder: 'hello@upshift.be' },
  { id: 'input-locatie-1', label: 'Location', placeholder: 'Antwerpen' },
  { id: 'input-locatie-2', label: 'Location', placeholder: 'België', hint: 'Optional extra address line.' },
  { id: 'input-facebook', label: 'Facebook URL', placeholder: 'https://www.facebook.com/upshiftbe', type: 'url', hint: 'Optional, the Facebook icon only appears once this is set.' },
  { id: 'input-linkedin', label: 'LinkedIn URL', placeholder: 'https://www.linkedin.com/company/upshift-be', type: 'url', hint: 'Optional, the LinkedIn icon only appears once this is set.' },
  { id: 'input-instagram', label: 'Instagram URL', placeholder: 'https://www.instagram.com/upshift.be', type: 'url', hint: 'Optional, the Instagram icon only appears once this is set.' },
  { id: 'input-website', label: 'Website URL', placeholder: 'https://upshift.be', type: 'url' },
]

export const FORM_GROUPS: FormGroup[] = [
  { title: 'Identity', description: 'Capture the name and role that appear directly under your signature.', fieldIds: ['input-naam', 'input-functie'] },
  { title: 'Branding', description: 'Paste the link to your logo from your website or image hosting platform.', fieldIds: ['input-logo-url'] },
  { title: 'Contact', description: 'Phone, email and website links are clickable for recipients.', fieldIds: ['input-gsm', 'input-email', 'input-website'] },
  { title: 'Location', description: 'Add primary and optional secondary offices or departments.', fieldIds: ['input-locatie-1', 'input-locatie-2'] },
  { title: 'Social', description: 'Optional public handles to share in your footer.', fieldIds: ['input-facebook', 'input-linkedin', 'input-instagram'] },
]

export const FIELD_MAP: Record<FormField['id'], FormField> = FORM_FIELDS.reduce((acc, field) => {
  acc[field.id] = field
  return acc
}, {} as Record<FormField['id'], FormField>)

export const RAW_ASSET_BASE = 'https://raw.githubusercontent.com/upshiftbe/email-signature/refs/heads/main/src/assets'
export const DEFAULT_LOGO_URL = `${RAW_ASSET_BASE}/upshift_logo.png`

export const PREFILL_VALUES: Record<FormField['id'], string> = {
  'input-naam': '',
  'input-functie': '',
  'input-logo-url': DEFAULT_LOGO_URL,
  'input-gsm': '',
  'input-email': '',
  'input-locatie-1': '',
  'input-locatie-2': '',
  'input-facebook': 'https://www.facebook.com/upshiftbe',
  'input-linkedin': 'https://www.linkedin.com/company/upshift-be',
  'input-instagram': 'https://www.instagram.com/upshift.be',
  'input-website': '',
}

export const STORAGE_KEY = 'signatureBuilderState'
