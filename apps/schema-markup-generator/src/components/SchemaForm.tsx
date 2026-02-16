import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaMap } from '~/lib/schemas'
import type { SchemaType } from '~/types/schema'
import { FormField } from './FormField'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useEffect } from 'react'
import type { z } from 'zod'
import { generateJSONLD } from '~/lib/jsonld-generator'

interface SchemaFormProps {
  schemaType: SchemaType
  onDataChange: (data: object | null) => void
}

export const SchemaForm = ({ schemaType, onDataChange }: SchemaFormProps) => {
  const schema = schemaMap[schemaType as keyof typeof schemaMap]
  const methods = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {} as Record<string, unknown>,
  })
  const { watch, handleSubmit, reset } = methods
  const errors = methods.formState.errors as Record<string, { message?: string }>

  useEffect(() => {
    methods.reset({} as Record<string, unknown>, { keepDefaultValues: false })
    onDataChange(null)
  }, [schemaType, methods, onDataChange])

  useEffect(() => {
    const generateJSON = (value: Record<string, unknown>) => {
      try {
        const processedValue = { ...value }
        const dateFields = ['datePublished', 'dateModified', 'startDate', 'endDate', 'uploadDate', 'datePosted']
        for (const key of dateFields) {
          const val = processedValue[key]
          if (typeof val === 'string' && val !== '') {
            processedValue[key] = new Date(val as string).toISOString()
          }
        }
        const baseData: Record<string, unknown> = { '@context': 'https://schema.org', '@type': schemaType }
        Object.keys(processedValue).forEach((key) => {
          const val = processedValue[key]
          if (val !== '' && val !== null && val !== undefined) {
            if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
              const nested = val as Record<string, unknown>
              const cleaned: Record<string, unknown> = {}
              Object.keys(nested).forEach((k) => {
                const v = nested[k]
                if (v !== '' && v !== null && v !== undefined) cleaned[k] = v
              })
              if (Object.keys(cleaned).length > 0) baseData[key] = cleaned
            } else {
              baseData[key] = val
            }
          }
        })
        const generated = generateJSONLD(baseData as Parameters<typeof generateJSONLD>[0])
        onDataChange(Object.keys(generated).length >= 2 ? generated : null)
      } catch {
        onDataChange(null)
      }
    }
    generateJSON(watch())
    const sub = watch((value: Record<string, unknown>) => generateJSON(value))
    return () => sub.unsubscribe()
  }, [watch, schemaType, onDataChange])

  const onSubmit = (data: z.infer<typeof schema>) => {
    onDataChange(generateJSONLD(data))
  }

  const handleReset = () => {
    reset()
    onDataChange(null)
  }

  const renderFormFields = () => {
    switch (schemaType) {
      case 'Organization':
        return (
          <>
            <FormField label="Organization Name" name="name" register={methods.register} error={errors.name} required />
            <FormField label="Website URL" name="url" register={methods.register} error={errors.url} type="url" placeholder="https://example.com" />
            <FormField label="Logo URL" name="logo" register={methods.register} error={errors.logo} type="url" placeholder="https://example.com/logo.png" />
            <FormField label="Description" name="description" register={methods.register} error={errors.description} type="textarea" />
          </>
        )
      case 'Article':
        return (
          <>
            <FormField label="Headline" name="headline" register={methods.register} error={errors.headline} required />
            <FormField label="Description" name="description" register={methods.register} error={errors.description} type="textarea" />
            <FormField label="Image URL" name="image" register={methods.register} error={errors.image} type="url" placeholder="https://example.com/image.jpg" />
            <FormField label="Author Name" name="author.name" register={methods.register} error={errors.author?.name} />
            <FormField label="Publisher Name" name="publisher.name" register={methods.register} error={errors.publisher?.name} />
            <FormField label="Date Published" name="datePublished" register={methods.register} error={errors.datePublished} type="date" required />
            <FormField label="Date Modified" name="dateModified" register={methods.register} error={errors.dateModified} type="date" />
            <FormField label="Article Body" name="articleBody" register={methods.register} error={errors.articleBody} type="textarea" rows={6} />
            <FormField label="Keywords" name="keywords" register={methods.register} error={errors.keywords} placeholder="keyword1, keyword2, keyword3" />
          </>
        )
      case 'Product':
        return (
          <>
            <FormField label="Product Name" name="name" register={methods.register} error={errors.name} required />
            <FormField label="Description" name="description" register={methods.register} error={errors.description} type="textarea" required />
            <FormField label="Image URL" name="image" register={methods.register} error={errors.image} type="url" placeholder="https://example.com/product.jpg" />
            <FormField label="Brand" name="brand" register={methods.register} error={errors.brand} />
            <FormField label="SKU" name="sku" register={methods.register} error={errors.sku} />
            <FormField label="Category" name="category" register={methods.register} error={errors.category} />
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Offer Details</h3>
              <FormField label="Price" name="offers.price" register={methods.register} error={errors.offers?.price} placeholder="29.99" />
              <FormField label="Currency" name="offers.priceCurrency" register={methods.register} error={errors.offers?.priceCurrency} placeholder="USD" />
              <FormField
                label="Availability"
                name="offers.availability"
                register={methods.register}
                error={errors.offers?.availability}
                type="select"
                options={[
                  { value: 'https://schema.org/InStock', label: 'In Stock' },
                  { value: 'https://schema.org/OutOfStock', label: 'Out of Stock' },
                  { value: 'https://schema.org/PreOrder', label: 'Pre-Order' },
                ]}
              />
              <FormField label="Offer URL" name="offers.url" register={methods.register} error={errors.offers?.url} type="url" />
            </div>
          </>
        )
      case 'LocalBusiness':
        return (
          <>
            <FormField label="Business Name" name="name" register={methods.register} error={errors.name} required />
            <FormField label="Description" name="description" register={methods.register} error={errors.description} type="textarea" />
            <FormField label="Phone Number" name="telephone" register={methods.register} error={errors.telephone} />
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Address</h3>
              <FormField label="Street Address" name="address.streetAddress" register={methods.register} error={errors.address?.streetAddress} />
              <FormField label="City" name="address.addressLocality" register={methods.register} error={errors.address?.addressLocality} />
              <FormField label="State/Region" name="address.addressRegion" register={methods.register} error={errors.address?.addressRegion} />
              <FormField label="Postal Code" name="address.postalCode" register={methods.register} error={errors.address?.postalCode} />
              <FormField label="Country" name="address.addressCountry" register={methods.register} error={errors.address?.addressCountry} />
            </div>
            <FormField label="Price Range" name="priceRange" register={methods.register} error={errors.priceRange} placeholder="$$" />
            <FormField label="Opening Hours" name="openingHours" register={methods.register} error={errors.openingHours} placeholder="Mo-Fr 09:00-17:00" />
          </>
        )
      case 'Event':
        return (
          <>
            <FormField label="Event Name" name="name" register={methods.register} error={errors.name} required />
            <FormField label="Description" name="description" register={methods.register} error={errors.description} type="textarea" />
            <FormField label="Start Date" name="startDate" register={methods.register} error={errors.startDate} type="date" required />
            <FormField label="End Date" name="endDate" register={methods.register} error={errors.endDate} type="date" />
            <FormField label="Image URL" name="image" register={methods.register} error={errors.image} type="url" />
          </>
        )
      case 'Person':
        return (
          <>
            <FormField label="Name" name="name" register={methods.register} error={errors.name} required />
            <FormField label="Job Title" name="jobTitle" register={methods.register} error={errors.jobTitle} />
            <FormField label="Description" name="description" register={methods.register} error={errors.description} type="textarea" />
            <FormField label="Email" name="email" register={methods.register} error={errors.email} type="email" />
            <FormField label="Website URL" name="url" register={methods.register} error={errors.url} type="url" />
          </>
        )
      case 'VideoObject':
        return (
          <>
            <FormField label="Video Title" name="name" register={methods.register} error={errors.name} required />
            <FormField label="Description" name="description" register={methods.register} error={errors.description} type="textarea" required />
            <FormField label="Thumbnail URL" name="thumbnailUrl" register={methods.register} error={errors.thumbnailUrl} type="url" required />
            <FormField label="Upload Date" name="uploadDate" register={methods.register} error={errors.uploadDate} type="date" required />
            <FormField label="Content URL" name="contentUrl" register={methods.register} error={errors.contentUrl} type="url" />
            <FormField label="Embed URL" name="embedUrl" register={methods.register} error={errors.embedUrl} type="url" placeholder="https://www.youtube.com/embed/..." />
            <FormField label="Duration" name="duration" register={methods.register} error={errors.duration} placeholder="PT1H30M" />
          </>
        )
      default:
        return <p className="text-muted-foreground">Form fields for {schemaType} are coming soon...</p>
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{schemaType} Schema</CardTitle>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">{renderFormFields()}</div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  )
}
