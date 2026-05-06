'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth.store'
import { userApi } from '@/lib/api'
import { LANGUAGE_LABELS, LANGUAGE_CODES } from '@/lib/utils'
import { LanguageCode, Theme } from '@/types'

const prefsSchema = z.object({
  nativeLanguage:   z.enum(['FR', 'EN', 'AR', 'ES', 'RU'] as const),
  learningLanguage: z.enum(['FR', 'EN', 'AR', 'ES', 'RU'] as const),
  theme:            z.enum(['LIGHT', 'DARK', 'OCEAN'] as const),
  fontSize:         z.number().min(14).max(24),
  highContrast:     z.boolean(),
  reduceMotion:     z.boolean(),
})
type PrefsForm = z.infer<typeof prefsSchema>

const themes: { value: Theme; label: string; desc: string; colors: string[] }[] = [
  { value: 'LIGHT', label: '☀️ Clair',      desc: 'Fond blanc, texte sombre', colors: ['#FAFAF8', '#1A1A18', '#2D6A4F'] },
  { value: 'DARK',  label: '🌙 Sombre',     desc: 'Fond noir, texte clair',   colors: ['#111110', '#F5F5F0', '#52B788'] },
  { value: 'OCEAN', label: '🌊 Océan',      desc: 'Bleu nuit profond',        colors: ['#0A1628', '#E8F4FD', '#3B9EE8'] },
]

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue } = useForm<PrefsForm>({
    resolver: zodResolver(prefsSchema),
    defaultValues: {
      nativeLanguage:   user?.nativeLanguage   ?? 'FR',
      learningLanguage: user?.learningLanguage ?? 'EN',
      theme:            user?.theme            ?? 'DARK',
      fontSize:         user?.fontSize         ?? 16,
      highContrast:     user?.highContrast     ?? false,
      reduceMotion:     user?.reduceMotion     ?? false,
    },
  })

  const currentTheme = watch('theme')
  const currentFont  = watch('fontSize')
  const highContrast = watch('highContrast')
  const reduceMotion = watch('reduceMotion')

  const onSubmit = async (data: PrefsForm) => {
    setError(null)
    try {
      await userApi.updatePreferences(data)
      updateUser(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Erreur lors de la sauvegarde.')
    }
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: '680px', margin: '0 auto' }}>
      <style>{`
        .select-field {
          width: 100%;
          background: #111;
          border: 1px solid #1E1E1E;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #F0F0EE;
          font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
          appearance: none;
          cursor: pointer;
        }
        .select-field:focus { border-color: #52B788; }
        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: #111;
          border: 1px solid #1A1A1A;
          border-radius: 12px;
          cursor: pointer;
          transition: border-color 0.2s;
          width: 100%;
        }
        .toggle-btn:hover { border-color: #2A2A2A; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '1.75rem',
          color: '#F0F0EE',
          letterSpacing: '-0.02em',
          marginBottom: '0.375rem',
        }}>
          Paramètres
        </h1>
        <p style={{ color: '#444', fontSize: '0.875rem' }}>
          Personnalisez votre expérience d&apos;apprentissage
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* ── Langues ── */}
          <section style={{
            background: '#0E0E0E',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '1.5rem',
          }}>
            <h2 style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Langues
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#555', marginBottom: '0.5rem' }}>
                  Langue maternelle
                </label>
                <select className="select-field" {...register('nativeLanguage')}>
                  {LANGUAGE_CODES.map((code: LanguageCode) => (
                    <option key={code} value={code}>{LANGUAGE_LABELS[code]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#555', marginBottom: '0.5rem' }}>
                  J&apos;apprends
                </label>
                <select className="select-field" {...register('learningLanguage')}>
                  {LANGUAGE_CODES.map((code: LanguageCode) => (
                    <option key={code} value={code}>{LANGUAGE_LABELS[code]}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ── Thème ── */}
          <section style={{
            background: '#0E0E0E',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '1.5rem',
          }}>
            <h2 style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Apparence
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {themes.map(({ value, label, desc, colors }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('theme', value)}
                  style={{
                    background: currentTheme === value ? 'rgba(82,183,136,0.06)' : '#111',
                    border: `1px solid ${currentTheme === value ? 'rgba(82,183,136,0.3)' : '#1A1A1A'}`,
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Color preview */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem' }}>
                    {colors.map((c, i) => (
                      <div key={i} style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: c,
                        border: '1px solid rgba(255,255,255,0.08)',
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: currentTheme === value ? '#52B788' : '#888', fontWeight: 500, marginBottom: '0.25rem' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#444' }}>{desc}</div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Police ── */}
          <section style={{
            background: '#0E0E0E',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '1.5rem',
          }}>
            <h2 style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Taille du texte — <span style={{ color: '#F0F0EE' }}>{currentFont}px</span>
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[14, 16, 18, 20].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setValue('fontSize', size)}
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    background: currentFont === size ? 'rgba(82,183,136,0.08)' : '#111',
                    border: `1px solid ${currentFont === size ? 'rgba(82,183,136,0.3)' : '#1A1A1A'}`,
                    borderRadius: '8px',
                    color: currentFont === size ? '#52B788' : '#555',
                    fontSize: '0.875rem',
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {size}px
                </button>
              ))}
            </div>
            <p style={{
              marginTop: '1rem',
              fontSize: `${currentFont}px`,
              color: '#555',
              transition: 'font-size 0.2s',
            }}>
              Aperçu du texte à {currentFont}px — Lingua Learn
            </p>
          </section>

          {/* ── Accessibilité ── */}
          <section style={{
            background: '#0E0E0E',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '1.5rem',
          }}>
            <h2 style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Accessibilité
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

              {/* Contraste */}
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setValue('highContrast', !highContrast)}
              >
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.875rem', color: '#F0F0EE', fontWeight: 500, marginBottom: '0.2rem' }}>Contraste élevé</p>
                  <p style={{ fontSize: '0.75rem', color: '#444' }}>Améliore la lisibilité pour les personnes malvoyantes</p>
                </div>
                <div style={{
                  width: '40px',
                  height: '22px',
                  borderRadius: '100px',
                  background: highContrast ? '#52B788' : '#1A1A1A',
                  position: 'relative',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: highContrast ? '21px' : '3px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: highContrast ? '#0A0A0A' : '#444',
                    transition: 'left 0.2s',
                  }} />
                </div>
                <input type="checkbox" {...register('highContrast')} style={{ display: 'none' }} />
              </button>

              {/* Animations */}
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setValue('reduceMotion', !reduceMotion)}
              >
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.875rem', color: '#F0F0EE', fontWeight: 500, marginBottom: '0.2rem' }}>Réduire les animations</p>
                  <p style={{ fontSize: '0.75rem', color: '#444' }}>Pour les personnes sensibles aux mouvements</p>
                </div>
                <div style={{
                  width: '40px',
                  height: '22px',
                  borderRadius: '100px',
                  background: reduceMotion ? '#52B788' : '#1A1A1A',
                  position: 'relative',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: reduceMotion ? '21px' : '3px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: reduceMotion ? '#0A0A0A' : '#444',
                    transition: 'left 0.2s',
                  }} />
                </div>
                <input type="checkbox" {...register('reduceMotion')} style={{ display: 'none' }} />
              </button>
            </div>
          </section>

          {error && <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#E74C3C' }}>{error}</p>}

          {/* Save button */}
          <button
            type="submit"
            style={{
              background: saved ? '#1B4332' : '#52B788',
              color: saved ? '#52B788' : '#0A0A0A',
              border: `1px solid ${saved ? 'rgba(82,183,136,0.3)' : 'transparent'}`,
              borderRadius: '10px',
              padding: '0.875rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.3s',
              width: '100%',
            }}
          >
            {saved ? '✓ Préférences sauvegardées' : 'Sauvegarder les préférences'}
          </button>

        </div>
      </form>
    </div>
  )
}