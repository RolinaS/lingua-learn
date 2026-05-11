'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'

const GAMES = [
  {
    href: '/dashboard/games/qcm',
    emoji: '🎯',
    title: 'QCM',
    desc: '4 choix de traduction pour un mot. Trouvez la bonne réponse avant la fin du temps !',
    difficulty: 'Débutant',
    time: '60 sec',
    color: 'rgba(82,183,136,0.08)',
    border: 'rgba(82,183,136,0.2)',
    accent: '#52B788',
  },
  {
    href: '/dashboard/games/pairs',
    emoji: '🔗',
    title: 'Paires',
    desc: 'Reliez chaque mot à sa traduction. Trouvez toutes les paires le plus vite possible.',
    difficulty: 'Intermédiaire',
    time: '90 sec',
    color: 'rgba(59,158,232,0.08)',
    border: 'rgba(59,158,232,0.2)',
    accent: '#3B9EE8',
  },
  {
    href: '/dashboard/games/anagram',
    emoji: '🔀',
    title: 'Anagramme',
    desc: 'Les lettres sont mélangées. Reconstituez le mot dans la langue apprise.',
    difficulty: 'Avancé',
    time: '45 sec',
    color: 'rgba(230,126,34,0.08)',
    border: 'rgba(230,126,34,0.2)',
    accent: '#E67E22',
  },
]

export default function GamesPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
          Jeux
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#444' }}>
          Entraînez-vous en vous amusant — langue apprise : <span style={{ color: '#52B788', fontWeight: 500 }}>{user?.learningLanguage}</span>
        </p>
      </div>

      {/* Cartes des jeux */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {GAMES.map(({ href, emoji, title, desc, difficulty, time, color, border, accent }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#0E0E0E',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = border
                e.currentTarget.style.background = color
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1A1A1A'
                e.currentTarget.style.background = '#0E0E0E'
              }}
            >
              {/* Icône */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '14px',
                background: color,
                border: `1px solid ${border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                flexShrink: 0,
              }}>
                {emoji}
              </div>

              {/* Contenu */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem', color: '#F0F0EE', letterSpacing: '-0.01em' }}>
                    {title}
                  </h2>
                  <span style={{ fontSize: '0.7rem', color: accent, background: color, border: `1px solid ${border}`, padding: '0.2rem 0.6rem', borderRadius: '100px', fontWeight: 500 }}>
                    {difficulty}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#555', lineHeight: '1.5' }}>{desc}</p>
              </div>

              {/* Temps + flèche */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#444', fontSize: '0.8rem', marginBottom: '0.25rem', justifyContent: 'flex-end' }}>
                  <span>⏱</span>
                  <span>{time}</span>
                </div>
                <span style={{ color: accent, fontSize: '1.1rem' }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Note */}
      <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '12px' }}>
        <p style={{ fontSize: '0.8rem', color: '#444', lineHeight: '1.6' }}>
          💡 <strong style={{ color: '#666' }}>Conseil :</strong> Commencez par le QCM pour vous familiariser avec les mots, puis progressez vers les Paires et l&apos;Anagramme pour consolider votre mémoire.
        </p>
      </div>
    </div>
  )
}