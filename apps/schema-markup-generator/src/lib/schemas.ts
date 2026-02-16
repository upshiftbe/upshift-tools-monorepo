import { z } from 'zod'

// Common schemas
export const postalAddressSchema = z.object({
  '@type': z.literal('PostalAddress').optional(),
  streetAddress: z.string().optional(),
  addressLocality: z.string().optional(),
  addressRegion: z.string().optional(),
  postalCode: z.string().optional(),
  addressCountry: z.string().optional(),
})

export const contactPointSchema = z.object({
  '@type': z.literal('ContactPoint').optional(),
  telephone: z.string().optional(),
  contactType: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
})

export const offerSchema = z.object({
  '@type': z.literal('Offer').optional(),
  price: z.string().optional(),
  priceCurrency: z.string().optional(),
  availability: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
})

export const aggregateRatingSchema = z.object({
  '@type': z.literal('AggregateRating').optional(),
  ratingValue: z.string().optional(),
  reviewCount: z.string().optional(),
})

export const geoCoordinatesSchema = z.object({
  '@type': z.literal('GeoCoordinates').optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

// Organization Schema
export const organizationSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('Organization'),
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  address: postalAddressSchema.optional(),
  contactPoint: contactPointSchema.optional(),
  sameAs: z.array(z.string().url()).optional(),
  foundingDate: z.string().optional(),
  numberOfEmployees: z.string().optional(),
})

// Article Schema
export const articleSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('Article'),
  headline: z.string().min(1, 'Headline is required'),
  description: z.string().optional(),
  image: z.union([z.string().url(), z.array(z.string().url())]).optional().or(z.literal('')),
  author: z.object({ '@type': z.literal('Person').optional(), name: z.string().optional() }).optional(),
  publisher: z
    .object({
      '@type': z.literal('Organization').optional(),
      name: z.string().optional(),
      logo: z.object({ '@type': z.literal('ImageObject').optional(), url: z.string().url().optional().or(z.literal('')) }).optional(),
    })
    .optional(),
  datePublished: z.string().min(1, 'Date published is required'),
  dateModified: z.string().optional(),
  articleBody: z.string().optional(),
  articleSection: z.string().optional(),
  keywords: z.string().optional(),
})

// Product Schema
export const productSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('Product'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.union([z.string().url(), z.array(z.string().url())]).optional().or(z.literal('')),
  brand: z.string().optional(),
  sku: z.string().optional(),
  gtin: z.string().optional(),
  category: z.string().optional(),
  offers: offerSchema,
  aggregateRating: aggregateRatingSchema.optional(),
})

// LocalBusiness Schema
export const localBusinessSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('LocalBusiness'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  image: z.union([z.string().url(), z.array(z.string().url())]).optional().or(z.literal('')),
  telephone: z.string().optional(),
  priceRange: z.string().optional(),
  address: postalAddressSchema,
  geo: geoCoordinatesSchema.optional(),
  openingHours: z.string().optional(),
  aggregateRating: aggregateRatingSchema.optional(),
  servesCuisine: z.string().optional(),
  menu: z.string().url().optional().or(z.literal('')),
})

// Event Schema
export const eventSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('Event'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  image: z.union([z.string().url(), z.array(z.string().url())]).optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  location: z
    .union([
      postalAddressSchema,
      z.object({
        '@type': z.literal('Place').optional(),
        name: z.string().optional(),
        address: postalAddressSchema.optional(),
      }),
    ])
    .optional(),
  organizer: z.object({ '@type': z.union([z.literal('Person'), z.literal('Organization')]).optional(), name: z.string().optional() }).optional(),
  offers: offerSchema.optional(),
  eventStatus: z.string().optional(),
  eventAttendanceMode: z.string().optional(),
})

// FAQPage Schema
const questionSchema = z.object({
  '@type': z.literal('Question'),
  name: z.string().min(1, 'Question is required'),
  acceptedAnswer: z.object({ '@type': z.literal('Answer'), text: z.string().min(1, 'Answer is required') }),
})
export const faqPageSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('FAQPage'),
  mainEntity: z.array(questionSchema).min(1, 'At least one question is required'),
})

// BreadcrumbList Schema
const listItemSchema = z.object({
  '@type': z.literal('ListItem'),
  position: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  item: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})
export const breadcrumbListSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('BreadcrumbList'),
  itemListElement: z.array(listItemSchema).min(1, 'At least one item is required'),
})

// JobPosting Schema
export const jobPostingSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('JobPosting'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  datePosted: z.string().min(1, 'Date posted is required'),
  employmentType: z.string().min(1, 'Employment type is required'),
  hiringOrganization: z.object({ '@type': z.literal('Organization').optional(), name: z.string().min(1, 'Organization name is required') }),
  jobLocation: z.object({ '@type': z.literal('Place').optional(), address: postalAddressSchema.optional() }).optional(),
  baseSalary: z
    .object({
      '@type': z.literal('MonetaryAmount').optional(),
      currency: z.string().optional(),
      value: z.object({ '@type': z.literal('QuantitativeValue').optional(), value: z.string().optional(), unitText: z.string().optional() }).optional(),
    })
    .optional(),
  validThrough: z.string().optional(),
  workHours: z.string().optional(),
  qualifications: z.string().optional(),
  skills: z.string().optional(),
})

// Person Schema
export const personSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('Person'),
  name: z.string().min(1, 'Name is required'),
  jobTitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  telephone: z.string().optional(),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  sameAs: z.array(z.string().url()).optional(),
  worksFor: z.object({ '@type': z.literal('Organization').optional(), name: z.string().optional() }).optional(),
  alumniOf: z.string().optional(),
})

// VideoObject Schema
export const videoObjectSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('VideoObject'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  thumbnailUrl: z.string().url('Must be a valid URL').min(1, 'Thumbnail URL is required'),
  uploadDate: z.string().min(1, 'Upload date is required'),
  contentUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  embedUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  duration: z.string().optional(),
  publisher: z.object({ '@type': z.literal('Organization').optional(), name: z.string().optional() }).optional(),
  author: z
    .union([
      z.object({ '@type': z.literal('Person').optional(), name: z.string().optional() }),
      z.object({ '@type': z.literal('Organization').optional(), name: z.string().optional() }),
    ])
    .optional(),
})

export type SchemaFormData =
  | z.infer<typeof organizationSchema>
  | z.infer<typeof articleSchema>
  | z.infer<typeof productSchema>
  | z.infer<typeof localBusinessSchema>
  | z.infer<typeof eventSchema>
  | z.infer<typeof faqPageSchema>
  | z.infer<typeof breadcrumbListSchema>
  | z.infer<typeof jobPostingSchema>
  | z.infer<typeof personSchema>
  | z.infer<typeof videoObjectSchema>

export const schemaMap = {
  Organization: organizationSchema,
  Article: articleSchema,
  Product: productSchema,
  LocalBusiness: localBusinessSchema,
  Event: eventSchema,
  FAQPage: faqPageSchema,
  BreadcrumbList: breadcrumbListSchema,
  JobPosting: jobPostingSchema,
  Person: personSchema,
  VideoObject: videoObjectSchema,
} as const
