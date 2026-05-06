'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth.store'

const loginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router    = useRouter()
  const login     = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    try {
      await login(data.email, data.password)
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error ?? 'Email ou mot de passe incorrect'
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
      padding: '1.5rem',
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
          letter-spacing: 0.01em;
        }
        .submit-btn:hover { background: #74C69D; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #2A2A2A;
          font-size: 0.75rem;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #1A1A1A;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
            Bon retour
          </h1>
          <p style={{ color: '#444', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Connectez-vous pour continuer à apprendre
          </p>

          {/* Error */}
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

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#666',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.02em',
                }}>
                  Adresse email
                </label>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  className="input-field"
                  {...register('email')}
                />
                {errors.email && (
                  <p style={{ fontSize: '0.75rem', color: '#E74C3C', marginTop: '0.375rem' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#666',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.02em',
                }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="input-field"
                  {...register('password')}
                />
                {errors.password && (
                  <p style={{ fontSize: '0.75rem', color: '#E74C3C', marginTop: '0.375rem' }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </form>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#444' }}>
          Pas encore de compte ?{' '}
          <Link href="/register" style={{ color: '#52B788', textDecoration: 'none', fontWeight: 500 }}>
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}