'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function HomeNavbar() {
  const router   = useRouter()
  const isAuth   = useAuthStore((s) => s.isAuth)
  const user     = useAuthStore((s) => s.user)
  const logout   = useAuthStore((s) => s.logout)
  const fetchMe  = useAuthStore((s) => s.fetchMe)
  const [mounted, setMounted] = useState(false)

  // Hydratation côté client
  useEffect(() => {
    setMounted(true)
    // Si token présent mais pas de user → fetch profil
    if (isAuth && !user) fetchMe()
  }, [])

  const handleLogout = async () => {
    await logout()
    router.refresh()
  }

  // Avant hydratation : afficher les boutons par défaut (évite le flash)
  if (!mounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link href="/login" className="btn-ghost">Se connecter</Link>
        <Link href="/register" className="btn-primary">Commencer →</Link>
      </div>
    )
  }

  // Connecté
  if (isAuth && user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Avatar + nom */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.875rem',
          background: '#111',
          border: '1px solid #1A1A1A',
          borderRadius: '100px',
          fontSize: '0.875rem',
          color: '#888',
        }}>
          <span style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: 'rgba(82,183,136,0.15)',
            border: '1px solid rgba(82,183,136,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            color: '#52B788',
            fontWeight: 600,
          }}>
            {user.username.charAt(0).toUpperCase()}
          </span>
          <span>{user.username}</span>
        </div>

        {/* Mon espace */}
        <Link href="/dashboard" className="btn-ghost">
          Mon espace
        </Link>

        {/* Déconnexion */}
        <button onClick={handleLogout} className="btn-primary" style={{ background: 'transparent', color: '#888', border: '1px solid #222' }}>
          Déconnexion
        </button>
      </div>
    )
  }

  // Non connecté
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Link href="/login" className="btn-ghost">Se connecter</Link>
      <Link href="/register" className="btn-primary">Commencer →</Link>
    </div>
  )
}
