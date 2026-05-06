'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { THEME_CLASSES } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',          label: 'Apprendre',   icon: '📖' },
  { href: '/dashboard/progress', label: 'Progression', icon: '📈' },
  { href: '/dashboard/settings', label: 'Paramètres',  icon: '⚙️' },
]

const THEME_BG: Record<string, string> = {
  'theme-light': '#FAFAF8',
  'theme-dark':  '#0A0A0A',
  'theme-ocean': '#0A1628',
}

const THEME_SIDEBAR: Record<string, string> = {
  'theme-light': '#F3F3EF',
  'theme-dark':  '#0E0E0E',
  'theme-ocean': '#0F1F3D',
}

const THEME_BORDER: Record<string, string> = {
  'theme-light': '#E5E5DE',
  'theme-dark':  '#1A1A1A',
  'theme-ocean': '#1E3A5F',
}

const THEME_TEXT: Record<string, string> = {
  'theme-light': '#1A1A18',
  'theme-dark':  '#F0F0EE',
  'theme-ocean': '#E8F4FD',
}

const THEME_MUTED: Record<string, string> = {
  'theme-light': '#9A9A8E',
  'theme-dark':  '#444',
  'theme-ocean': '#5B7A91',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { user, isAuth, logout, fetchMe } = useAuthStore()

  useEffect(() => {
    if (!isAuth) { router.push('/login'); return }
    if (!user) fetchMe()
  }, [isAuth, user, router, fetchMe])

  if (!isAuth || !user) return null

  const themeClass = THEME_CLASSES[user.theme] ?? 'theme-dark'
  const bg       = THEME_BG[themeClass]      ?? '#0A0A0A'
  const sidebar  = THEME_SIDEBAR[themeClass] ?? '#0E0E0E'
  const border   = THEME_BORDER[themeClass]  ?? '#1A1A1A'
  const text     = THEME_TEXT[themeClass]    ?? '#F0F0EE'
  const muted    = THEME_MUTED[themeClass]   ?? '#444'

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bg,
      color: text,
      fontFamily: "'DM Sans', sans-serif",
      display: 'flex',
    }}
    data-font-size={user.fontSize}
    data-high-contrast={user.highContrast}
    data-reduce-motion={user.reduceMotion}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        .nav-item { transition: background 0.15s, color 0.15s; }
        .nav-item:hover { background: rgba(82,183,136,0.06) !important; }
        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s;
        }
        .logout-btn:hover { background: rgba(231,76,60,0.08); }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '240px',
        minHeight: '100vh',
        backgroundColor: sidebar,
        borderRight: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>

        {/* Logo */}
        <div style={{
          padding: '1.5rem 1.25rem 1.25rem',
          borderBottom: `1px solid ${border}`,
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📖</span>
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '1rem',
              color: text,
              letterSpacing: '-0.01em',
            }}>
              Lingua<span style={{ color: '#52B788' }}>Learn</span>
            </span>
          </Link>
        </div>

        {/* Langue apprise */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: `1px solid ${border}`,
        }}>
          <p style={{ fontSize: '0.65rem', color: muted, letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            J&apos;apprends
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(82,183,136,0.06)',
            border: '1px solid rgba(82,183,136,0.15)',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
          }}>
            <span style={{ fontSize: '0.875rem', color: '#52B788', fontWeight: 500 }}>
              {user.learningLanguage}
            </span>
            <span style={{ fontSize: '0.75rem', color: muted }}>
              ← {user.nativeLanguage}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem' }}>
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div
                  className="nav-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? '#52B788' : muted,
                    backgroundColor: isActive ? 'rgba(82,183,136,0.08)' : 'transparent',
                    marginBottom: '0.25rem',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{icon}</span>
                  {label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Profil */}
        <div style={{ padding: '0.75rem', borderTop: `1px solid ${border}` }}>
          <div style={{ padding: '0.625rem 0.75rem', marginBottom: '0.25rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: text, marginBottom: '0.1rem' }}>
              {user.username}
            </p>
            <p style={{ fontSize: '0.75rem', color: muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn"
            style={{ color: muted }}
          >
            <span>🚪</span>
            <span style={{ fontSize: '0.875rem' }}>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* ── Contenu ── */}
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}