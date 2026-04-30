import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '@upshift-tools/shared-ui';
import { useFormState } from '~/hooks/useFormState';
import { useClipboard } from '~/hooks/useClipboard';
import { AppHeader } from '~/components/AppHeader';
import { SignatureForm } from '~/components/SignatureForm';
import { SignaturePreview } from '~/components/SignaturePreview';

const CONSENT_COOKIE_NAME = 'emailSignatureConsent';

function getConsentCookie(): 'accepted' | 'rejected' | null {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!cookie) return null;
  const [, value] = cookie.split('=');
  return value === 'accepted' || value === 'rejected' ? value : null;
}

function setConsentCookie(value: 'accepted' | 'rejected') {
  if (typeof document === 'undefined') return;
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 365};`;
}

export const Route = createFileRoute('/')({ component: EmailSignaturePage });

function EmailSignaturePage() {
  const { formState, trimmedValues, updateField, setFieldTouched, resetForm, hydrated, errors } = useFormState();
  const { previewRef, copySignature } = useClipboard();
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(() => getConsentCookie());

  const handleFieldChange = useCallback(
    (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
      updateField(id, event.target.value);
    },
    [updateField],
  );

  const handleFieldBlur = useCallback(
    (id: string) => () => {
      setFieldTouched(id);
    },
    [setFieldTouched],
  );

  useEffect(() => {
    if (consent === null) setConsent(getConsentCookie());
  }, [consent]);

  const handleConsentDecision = useCallback((value: 'accepted' | 'rejected') => {
    setConsentCookie(value);
    setConsent(value);
    if (value === 'accepted' && typeof window !== 'undefined') {
      const dl = (window as Window & { dataLayer?: unknown[] }).dataLayer;
      if (Array.isArray(dl)) dl.push({ event: 'consent_granted' });
    }
  }, []);

  if (!hydrated) {
    return (
      <div className='min-h-screen px-4 py-8 text-foreground'>
        <div className='mx-auto flex max-w-6xl flex-col gap-8'>
          <div className='flex items-center justify-center py-20'>
            <p className='text-muted-foreground'>Loading</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen px-4 py-8 text-foreground sm:px-6 sm:py-10'>
      <div className='mx-auto flex max-w-7xl flex-col gap-6'>
        <AppHeader />
        <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_500px]'>
          <section className='space-y-6'>
            <SignatureForm
              formState={formState}
              errors={errors}
              onFieldChange={handleFieldChange}
              onFieldBlur={handleFieldBlur}
              onReset={resetForm}
            />
          </section>
          <aside className='lg:sticky lg:top-20'>
            <SignaturePreview
              values={trimmedValues}
              previewRef={previewRef}
              onReset={resetForm}
              onCopy={copySignature}
            />
          </aside>
        </div>
      </div>
      {consent === null && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm'
          role='dialog'
          aria-modal='true'
          aria-labelledby='consent-heading'
        >
          <div className='w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-card p-6 text-card-foreground shadow-[var(--shadow-lg)]'>
            <h2 id='consent-heading' className='font-display text-lg font-semibold text-foreground'>
              Cookie preferences
            </h2>
            <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
              We use a small preference cookie and analytics consent signal to improve this free tool.
            </p>
            <div className='mt-6 flex flex-wrap gap-3'>
              <Button type='button' size='lg' onClick={() => handleConsentDecision('accepted')}>
                Allow
              </Button>
              <Button
                type='button'
                variant='outline'
                size='lg'
                onClick={() => handleConsentDecision('rejected')}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
