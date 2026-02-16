export type SchemaType =
  | 'Organization'
  | 'Article'
  | 'Product'
  | 'LocalBusiness'
  | 'Event'
  | 'FAQPage'
  | 'BreadcrumbList'
  | 'JobPosting'
  | 'Person'
  | 'VideoObject'

export interface SchemaTypeInfo {
  label: string
  description: string
  type: SchemaType
}

export const SCHEMA_TYPES: SchemaTypeInfo[] = [
  { label: 'Organization', description: 'Business, corporation, or organization', type: 'Organization' },
  { label: 'Article', description: 'Blog posts, news articles, editorial content', type: 'Article' },
  { label: 'Product', description: 'E-commerce product listings', type: 'Product' },
  { label: 'Local Business', description: 'Local business listings (restaurants, shops, services)', type: 'LocalBusiness' },
  { label: 'Event', description: 'Events, conferences, concerts', type: 'Event' },
  { label: 'FAQ Page', description: 'Frequently asked questions', type: 'FAQPage' },
  { label: 'Breadcrumb List', description: 'Site navigation breadcrumbs', type: 'BreadcrumbList' },
  { label: 'Job Posting', description: 'Job listings and career pages', type: 'JobPosting' },
  { label: 'Person', description: 'Personal profiles, authors, team members', type: 'Person' },
  { label: 'Video Object', description: 'Video content metadata', type: 'VideoObject' },
]
