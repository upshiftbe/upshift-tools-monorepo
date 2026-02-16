import type { TrimmedValues } from '~/types'
import { RAW_ASSET_BASE } from '~/config/formConfig'
import { sanitizeUrl, sanitizePhone, sanitizeEmail } from '~/lib/security'

type EmailSignatureProps = { values: TrimmedValues }

export function EmailSignature({ values }: EmailSignatureProps) {
  const logoSrc = sanitizeUrl(values.logoUrl)
  const websiteLink = sanitizeUrl(values.websiteUrl) || 'https://upshift.be'

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: 24,
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: 12,
        lineHeight: 1.4,
        color: '#181127',
      }}
    >
      <table cellPadding={0} cellSpacing={0} style={{ width: '450px', fontFamily: 'inherit', fontSize: 'inherit', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: 'middle', width: '50%' }}>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 500, color: '#181127' }}>{values.name}</h3>
                      <p style={{ margin: 0, fontSize: 12, lineHeight: '22px', color: '#181127' }}>{values.role}</p>
                    </td>
                    <td style={{ verticalAlign: 'middle', width: '50%', borderLeft: '1px solid #283e89', paddingLeft: 16 }}>
                      <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
                        <tbody>
                          <tr style={{ verticalAlign: 'middle', height: 25 }}>
                            <td width={30} style={{ verticalAlign: 'middle' }}>
                              <img src={`${RAW_ASSET_BASE}/phone.png`} width={20} height={20} alt="Phone" style={{ display: 'block' }} />
                            </td>
                            <td style={{ verticalAlign: 'middle', fontSize: 12 }}>
                              <a id="link-gsm" href={values.phone ? `tel:${sanitizePhone(values.phone)}` : ''} style={{ textDecoration: 'none', color: '#181127' }}>
                                {values.phone}
                              </a>
                            </td>
                          </tr>
                          <tr style={{ verticalAlign: 'middle', height: 25 }}>
                            <td width={30} style={{ verticalAlign: 'middle' }}>
                              <img src={`${RAW_ASSET_BASE}/mail.png`} width={20} height={20} alt="Email" style={{ display: 'block' }} />
                            </td>
                            <td style={{ verticalAlign: 'middle', fontSize: 12 }}>
                              <a id="link-email" href={values.email ? `mailto:${sanitizeEmail(values.email)}` : ''} style={{ textDecoration: 'none', color: '#181127' }}>
                                {values.email}
                              </a>
                            </td>
                          </tr>
                          {values.websiteUrl && (
                            <tr style={{ verticalAlign: 'middle', height: 25 }}>
                              <td width={30} style={{ verticalAlign: 'middle' }}>
                                <img src={`${RAW_ASSET_BASE}/globe.png`} width={20} height={20} alt="Website" style={{ display: 'block' }} />
                              </td>
                              <td style={{ verticalAlign: 'middle', fontSize: 12 }}>
                                <a id="link-website" href={sanitizeUrl(values.websiteUrl)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#181127' }}>
                                  {values.websiteLabel || values.websiteUrl}
                                </a>
                              </td>
                            </tr>
                          )}
                          <tr style={{ verticalAlign: 'middle', height: 25 }}>
                            <td width={30} style={{ verticalAlign: 'middle' }}>
                              <img src={`${RAW_ASSET_BASE}/building.png`} width={20} height={20} alt="Location" style={{ display: 'block' }} />
                            </td>
                            <td style={{ verticalAlign: 'middle', fontSize: 12 }}>{values.location1}</td>
                          </tr>
                          {values.location2 && (
                            <tr style={{ verticalAlign: 'middle', height: 25 }}>
                              <td width={30} style={{ verticalAlign: 'middle' }} />
                              <td style={{ verticalAlign: 'middle', fontSize: 12 }}>{values.location2}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%', marginTop: 5 }}>
                <tbody>
                  <tr>
                    <td>
                      {logoSrc && (
                        <a href={websiteLink} target="_blank" rel="noopener noreferrer">
                          <img src={logoSrc} width={100} alt="Logo" style={{ maxHeight: 50, width: 'auto', display: 'block' }} />
                        </a>
                      )}
                    </td>
                    <td style={{ paddingBottom: 2, textAlign: 'right' }}>
                      <table cellPadding={0} cellSpacing={0} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center' }}>
                        <tbody>
                          <tr>
                            {[
                              { id: 'facebook', icon: 'facebook.png', href: values.facebook },
                              { id: 'linkedin', icon: 'linkedin.png', href: values.linkedin },
                              { id: 'instagram', icon: 'instagram.png', href: values.instagram },
                            ]
                              .map((s) => ({ ...s, href: sanitizeUrl(s.href) }))
                              .filter((s) => s.href)
                              .map((social, i) => (
                                <td key={social.id} style={{ paddingLeft: i === 0 ? 0 : 8 }}>
                                  <a id={`link-${social.id}`} href={social.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: 0, color: '#181127' }}>
                                    <img src={`${RAW_ASSET_BASE}/${social.icon}`} width={20} height={20} alt={social.id} style={{ display: 'block' }} />
                                  </a>
                                </td>
                              ))}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
                <tbody>
                  <tr><td height={5} /></tr>
                  <tr>
                    <td style={{ width: '100%', borderBottom: '1px solid #283e89', display: 'block' }} />
                  </tr>
                  <tr><td height={5} /></tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
