'use client'

import { useEffect, useState } from 'react'
import { progressApi, sessionApi } from '@/lib/api'
import { formatDate, formatDuration } from '@/lib/utils'
import { UserProgress, LearningSession } from '@/types'

export default function ProgressPage() {
  const [progress, setProgress]   = useState<UserProgress[]>([])
  const [sessions, setSessions]   = useState<LearningSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [prog, sess] = await Promise.all([progressApi.getAll(), sessionApi.getAll()])
        setProgress(prog.data.data)
        setSessions(sess.data.data)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const totalWords   = progress.length
  const learnedWords = progress.filter((p) => p.score >= 80).length
  const avgScore     = totalWords > 0
    ? Math.round(progress.reduce((a, p) => a + p.score, 0) / totalWords)
    : 0

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: '#444', fontSize: '0.875rem' }}>Chargement...</p>
      </div>
    )
  }

  const stats = [
    { label: 'Mots étudiés',   value: totalWords,    icon: '📚', color: '#52B788' },
    { label: 'Mots maîtrisés', value: learnedWords,  icon: '✅', color: '#52B788' },
    { label: 'Score moyen',    value: `${avgScore}%`, icon: '🎯', color: '#52B788' },
  ]

  return (
    <div style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '1.75rem',
          color: '#F0F0EE',
          letterSpacing: '-0.02em',
          marginBottom: '0.375rem',
        }}>
          Ma progression
        </h1>
        <p style={{ color: '#444', fontSize: '0.875rem' }}>
          Suivez votre apprentissage au fil du temps
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(({ label, value, icon }) => (
          <div key={label} style={{
            background: '#0E0E0E',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '2rem',
              color: '#52B788',
              letterSpacing: '-0.02em',
              marginBottom: '0.375rem',
            }}>
              {value}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#444' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Vide */}
      {totalWords === 0 && sessions.length === 0 && (
        <div style={{
          background: '#0E0E0E',
          border: '1px solid #1A1A1A',
          borderRadius: '16px',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <h3 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '1.25rem',
            color: '#F0F0EE',
            marginBottom: '0.5rem',
          }}>
            Pas encore de progression
          </h3>
          <p style={{ color: '#444', fontSize: '0.875rem' }}>
            Commencez à apprendre pour voir vos statistiques ici
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* Sessions récentes */}
        {sessions.length > 0 && (
          <div style={{
            background: '#0E0E0E',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '1.5rem',
          }}>
            <h2 style={{
              fontSize: '0.7rem',
              color: '#52B788',
              letterSpacing: '0.1em',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>
              Sessions récentes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sessions.slice(0, 6).map((session: LearningSession) => (
                <div key={session.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: '#111',
                  borderRadius: '10px',
                  border: '1px solid #1A1A1A',
                }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#CCC', fontWeight: 500 }}>
                      {session.languageCode}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#444', marginTop: '0.1rem' }}>
                      {formatDate(session.completedAt)} · {formatDuration(session.durationSecs)}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: session.score >= 70 ? '#52B788' : '#E74C3C',
                    background: session.score >= 70 ? 'rgba(82,183,136,0.08)' : 'rgba(231,76,60,0.08)',
                    border: `1px solid ${session.score >= 70 ? 'rgba(82,183,136,0.2)' : 'rgba(231,76,60,0.2)'}`,
                    padding: '0.25rem 0.625rem',
                    borderRadius: '100px',
                  }}>
                    {session.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vocabulaire étudié */}
        {progress.length > 0 && (
          <div style={{
            background: '#0E0E0E',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '1.5rem',
          }}>
            <h2 style={{
              fontSize: '0.7rem',
              color: '#52B788',
              letterSpacing: '0.1em',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>
              Vocabulaire étudié
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {progress.slice(0, 8).map((p: UserProgress) => (
                <div key={p.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.75rem',
                  background: '#111',
                  borderRadius: '10px',
                  border: '1px solid #1A1A1A',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontSize: '0.9rem' }}>{p.word?.category?.emoji}</span>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#CCC', fontWeight: 500 }}>{p.word?.term}</p>
                      <p style={{ fontSize: '0.7rem', color: '#444' }}>{p.reviewCount} rév.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '40px', height: '2px', borderRadius: '2px', background: '#1A1A1A', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${p.score}%`,
                        background: p.score >= 80 ? '#52B788' : '#E67E22',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#444', width: '28px', textAlign: 'right' }}>
                      {p.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}