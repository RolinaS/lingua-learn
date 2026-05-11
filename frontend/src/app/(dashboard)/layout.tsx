'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { THEME_CLASSES } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',           label: 'Apprendre',   icon: '📖' },
  { href: '/dashboard/games',     label: 'Jeux',        icon: '🎮' },
  { href: '/dashboard/alphabet',  label: 'Alphabet',    icon: '🔤' },
  { href: '/dashboard/progress',  label: 'Progression', icon: '📈' },
  { href: '/dashboard/settings',  label: 'Paramètres',  icon: '⚙️' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { user, isAuth, logout, fetchMe } = useAuthStore()

  // Protection de route
  useEffect(() => {
    if (!isAuth) {
      router.push('/login')
      return
    }
    if (!user) fetchMe()
  }, [isAuth, user, router, fetchMe])

  if (!isAuth || !user) return null

  const themeClass = THEME_CLASSES[user.theme] ?? 'theme-light'

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div
      className={themeClass}
      data-font-size={user.fontSize}
      data-high-contrast={user.highContrast}
      data-reduce-motion={user.reduceMotion}
      style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="flex h-screen overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-64 flex flex-col border-r shrink-0"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>

          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-2xl">📖</span>
            <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              Lingua<span style={{ color: 'var(--accent)' }}>Learn</span>
            </span>
          </div>

          {/* Langue apprise */}
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              J&apos;apprends
            </p>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>🌍</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {user.learningLanguage}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map(({ href, label, icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{icon}</span>
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Profil + Logout */}
          <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {user.username}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span style={{ fontSize: '1rem' }}>🚪</span>
              Se déconnecter
            </button>
          </div>
        </aside>

        {/* ── Contenu principal ── */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}