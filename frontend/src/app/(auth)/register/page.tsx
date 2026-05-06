'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth.store'
import { LANGUAGE_LABELS, LANGUAGE_CODES } from '@/lib/utils'
import { LanguageCode } from '@/types'

const registerSchema = z.object({
  email:            z.string().email('Email invalide'),
  username:         z.string().min(3, 'Minimum 3 caractères').max(30)
                     .regex(/^[a-zA-Z0-9_-]+$/, 'Lettres, chiffres, _ et -'),
  password:         z.string().min(8, 'Minimum 8 caractères')
                     .regex(/[A-Z]/, 'Au moins une majuscule')
                     .regex(/[0-9]/, 'Au moins un chiffre'),
  nativeLanguage:   z.enum(['FR', 'EN', 'AR', 'ES', 'RU'] as const),
  learningLanguage: z.enum(['FR', 'EN', 'AR', 'ES', 'RU'] as const),
}).refine((d) => d.nativeLanguage !== d.learningLanguage, {
  message: 'Les deux langues doivent être différentes',
  path: ['learningLanguage'],
})
type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router    = useRouter()
  const register_ = useAuthStore((s) => s.register)
  const isLoading = useAuthStore((s) => s.isLoading)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nativeLanguage: 'FR', learningLanguage: 'EN' },
  })

  const onSubmit = async (data: RegisterForm) => {
    setError(null)
    try {
      await register_(data)
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error ?? 'Une erreur est survenue'
      setError(msg)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: '2rem 1.5rem',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }

        .input-field {
          width: 100%;
          background: #111;
          border: 1px solid #1E1E1E;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #F0F0EE;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #52B788; }
        .input-field::placeholder { color: #333; }

        .select-field {
          width: 100%;
          background: #111;
          border: 1px solid #1E1E1E;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #F0F0EE;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
          appearance: none;
          cursor: pointer;
        }
        .select-field:focus { border-color: #52B788; }

        .submit-btn {
          width: 100%;
          background: #52B788;
          color: #0A0A0A;
          border: none;
          border-radius: 10px;
          padding: 0.875rem;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .submit-btn:hover { background: #74C69D; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .field-label {
          display: block;
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 0.5rem;
          letter-spacing: 0.02em;
        }
        .field-error {
          font-size: 0.75rem;
          color: #E74C3C;
          margin-top: 0.375rem;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '1.5rem',
              color: '#F0F0EE',
            }}>
              Lingua<span style={{ color: '#52B788' }}>Learn</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: '#0E0E0E',
          border: '1px solid #1A1A1A',
          borderRadius: '20px',
          padding: '2.5rem',
        }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '1.75rem',
            letterSpacing: '-0.02em',
            color: '#F0F0EE',
            marginBottom: '0.5rem',
          }}>
            Créer un compte
          </h1>
          <p style={{ color: '#444', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Rejoignez LinguaLearn et commencez à apprendre
          </p>

          {error && (
            <div style={{
              background: '#1A0D0D',
              border: '1px solid #3A1A1A',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              color: '#E74C3C',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div>
                <label className="field-label">Adresse email</label>
                <input type="email" placeholder="vous@exemple.com" className="input-field" {...register('email')} />
                {errors.email && <p className="field-error">{errors.email.message}</p>}
              </div>

              <div>
                <label className="field-label">Nom d&apos;utilisateur</label>
                <input type="text" placeholder="mon_pseudo" className="input-field" {...register('username')} />
                {errors.username && <p className="field-error">{errors.username.message}</p>}
              </div>

              <div>
                <label className="field-label">Mot de passe</label>
                <input type="password" placeholder="••••••••" className="input-field" {...register('password')} />
                {errors.password && <p className="field-error">{errors.password.message}</p>}
              </div>

              {/* Séparateur langues */}
              <div style={{
                borderTop: '1px solid #1A1A1A',
                paddingTop: '1rem',
                marginTop: '0.5rem',
              }}>
                <p style={{ fontSize: '0.75rem', color: '#444', marginBottom: '1rem', letterSpacing: '0.02em' }}>
                  VOS LANGUES
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="field-label">Langue maternelle</label>
                    <select className="select-field" {...register('nativeLanguage')}>
                      {LANGUAGE_CODES.map((code: LanguageCode) => (
                        <option key={code} value={code}>{LANGUAGE_LABELS[code]}</option>
                      ))}
                    </select>
                    {errors.nativeLanguage && <p className="field-error">{errors.nativeLanguage.message}</p>}
                  </div>

                  <div>
                    <label className="field-label">J&apos;apprends</label>
                    <select className="select-field" {...register('learningLanguage')}>
                      {LANGUAGE_CODES.map((code: LanguageCode) => (
                        <option key={code} value={code}>{LANGUAGE_LABELS[code]}</option>
                      ))}
                    </select>
                    {errors.learningLanguage && <p className="field-error">{errors.learningLanguage.message}</p>}
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Création du compte...' : 'Créer mon compte →'}
              </button>
            </div>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#444' }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: '#52B788', textDecoration: 'none', fontWeight: 500 }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}