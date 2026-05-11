'use client'

import { useEffect, useState } from 'react'
import { progressApi, sessionApi } from '@/lib/api'
import { formatDate, formatDuration } from '@/lib/utils'
import { UserProgress, LearningSession } from '@/types'

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const HEATMAP_WEEKS = 16
const HEATMAP_DAYS  = HEATMAP_WEEKS * 7

/** Construit un map { 'YYYY-MM-DD': nombre d'activités } */
function buildActivityMap(
  sessions: LearningSession[],
  progress: UserProgress[]
): Record<string, number> {
  const map: Record<string, number> = {}

  sessions.forEach(s => {
    const day = s.completedAt.split('T')[0]
    map[day] = (map[day] ?? 0) + 1
  })

  progress.forEach(p => {
    if (p.lastReviewedAt) {
      const day = p.lastReviewedAt.split('T')[0]
      map[day] = (map[day] ?? 0) + 1
    }
  })

  return map
}

/** Série actuelle en jours consécutifs */
function computeStreak(
  sessions: LearningSession[],
  progress: UserProgress[]
): { current: number; longest: number } {
  const allDates = new Set<string>()
  sessions.forEach(s => allDates.add(s.completedAt.split('T')[0]))
  progress.forEach(p => { if (p.lastReviewedAt) allDates.add(p.lastReviewedAt.split('T')[0]) })

  if (!allDates.size) return { current: 0, longest: 0 }

  const toKey = (d: Date) => d.toISOString().split('T')[0]
  const today     = new Date(); today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)

  // Départ du streak courant : aujourd'hui ou hier (grace day)
  let startCurrent = new Date(today)
  if (!allDates.has(toKey(today)) && !allDates.has(toKey(yesterday))) {
    return { current: 0, longest: computeLongest(allDates) }
  }
  if (!allDates.has(toKey(today))) startCurrent = new Date(yesterday)

  let current = 0
  const cursor = new Date(startCurrent)
  while (allDates.has(toKey(cursor))) {
    current++
    cursor.setDate(cursor.getDate() - 1)
  }

  return { current, longest: Math.max(current, computeLongest(allDates)) }
}

function computeLongest(dates: Set<string>): number {
  const sorted = Array.from(dates).sort()
  if (!sorted.length) return 0
  let longest = 1, run = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) /
      86_400_000
    if (diff === 1) { run++; longest = Math.max(longest, run) }
    else run = 1
  }
  return longest
}

/** Couleur d'une cellule de heatmap */
function heatColor(count: number): string {
  if (count === 0) return '#1A1A1A'
  if (count <= 2)  return 'rgba(82,183,136,0.25)'
  if (count <= 5)  return 'rgba(82,183,136,0.55)'
  if (count <= 9)  return 'rgba(82,183,136,0.8)'
  return '#52B788'
}

/** Niveau de maîtrise selon l'intervalle SM-2 */
type MasteryKey = 'hard' | 'learning' | 'familiar' | 'mastered'

function getMastery(p: UserProgress): MasteryKey {
  if (p.interval <= 1)  return 'hard'
  if (p.interval <= 5)  return 'learning'
  if (p.interval <= 14) return 'familiar'
  return 'mastered'
}

const MASTERY: Record<MasteryKey, { label: string; color: string; bg: string; border: string }> = {
  hard:     { label: 'Difficile', color: '#E74C3C', bg: 'rgba(231,76,60,0.08)',    border: 'rgba(231,76,60,0.2)' },
  learning: { label: 'En cours',  color: '#E67E22', bg: 'rgba(230,126,34,0.08)',   border: 'rgba(230,126,34,0.2)' },
  familiar: { label: 'Familier',  color: '#F39C12', bg: 'rgba(243,156,18,0.08)',   border: 'rgba(243,156,18,0.2)' },
  mastered: { label: 'Maîtrisé',  color: '#52B788', bg: 'rgba(82,183,136,0.08)',   border: 'rgba(82,183,136,0.2)' },
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: '#444', fontSize: '0.875rem' }}>Chargement…</p>
      </div>
    )
  }

  // ── Calculs ──────────────────────────────────────────────────────────────────

  const totalWords     = progress.length
  const masteredWords  = progress.filter(p => p.interval > 14).length
  const avgScore       = totalWords > 0
    ? Math.round(progress.reduce((a, p) => a + p.score, 0) / totalWords)
    : 0
  const totalReviews   = progress.reduce((a, p) => a + p.reviewCount, 0)
  const { current: streak, longest: longestStreak } = computeStreak(sessions, progress)

  // Heatmap
  const activityMap  = buildActivityMap(sessions, progress)
  const today        = new Date(); today.setHours(0, 0, 0, 0)
  const heatmapDays  = Array.from({ length: HEATMAP_DAYS }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (HEATMAP_DAYS - 1 - i))
    return d.toISOString().split('T')[0]
  })

  // Étiquettes des mois sur la heatmap (une par colonne quand le mois change)
  const monthLabels: Record<number, string> = {}
  for (let col = 0; col < HEATMAP_WEEKS; col++) {
    const firstDayOfCol = heatmapDays[col * 7]
    const date = new Date(firstDayOfCol)
    const prevCol = col > 0 ? new Date(heatmapDays[(col - 1) * 7]) : null
    if (!prevCol || date.getMonth() !== prevCol.getMonth()) {
      monthLabels[col] = date.toLocaleDateString('fr-FR', { month: 'short' })
    }
  }

  // Mastery distribution
  const masteryGroups: Record<MasteryKey, UserProgress[]> = { hard: [], learning: [], familiar: [], mastered: [] }
  progress.forEach(p => masteryGroups[getMastery(p)].push(p))
  const masteryOrder: MasteryKey[] = ['mastered', 'familiar', 'learning', 'hard']
  const maxMasteryCount = Math.max(...Object.values(masteryGroups).map(g => g.length), 1)

  // Mots à réviser aujourd'hui
  const reviewDue = progress.filter(p => p.nextReviewAt && new Date(p.nextReviewAt) <= today).length

  // ── Vide ─────────────────────────────────────────────────────────────────────

  if (totalWords === 0 && sessions.length === 0) {
    return (
      <div style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
          Ma progression
        </h1>
        <p style={{ color: '#444', fontSize: '0.875rem', marginBottom: '3rem' }}>Suivez votre apprentissage au fil du temps</p>
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem', color: '#F0F0EE', marginBottom: '0.5rem' }}>
            Pas encore de progression
          </h3>
          <p style={{ color: '#444', fontSize: '0.875rem' }}>Commencez à apprendre pour voir vos statistiques ici</p>
        </div>
      </div>
    )
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '2.5rem', maxWidth: '860px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
            Ma progression
          </h1>
          <p style={{ color: '#444', fontSize: '0.875rem' }}>Suivez votre apprentissage au fil du temps</p>
        </div>

        {/* Streak badge */}
        <div style={{
          background: streak > 0 ? 'rgba(230,126,34,0.08)' : '#0E0E0E',
          border: `1px solid ${streak > 0 ? 'rgba(230,126,34,0.25)' : '#1A1A1A'}`,
          borderRadius: '14px',
          padding: '0.875rem 1.25rem',
          textAlign: 'center',
          minWidth: '120px',
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{streak > 0 ? '🔥' : '💤'}</div>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '1.75rem',
            color: streak > 0 ? '#E67E22' : '#333',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '0.25rem',
          }}>
            {streak}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#555', fontWeight: 500 }}>
            {streak === 1 ? 'jour de série' : streak > 1 ? 'jours de série' : 'pas de série'}
          </div>
          {longestStreak > 0 && (
            <div style={{ fontSize: '0.65rem', color: '#444', marginTop: '0.25rem' }}>
              record : {longestStreak}j
            </div>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Mots étudiés',    value: totalWords,      icon: '📚', color: '#52B788' },
          { label: 'Mots maîtrisés',  value: masteredWords,   icon: '✅', color: '#52B788' },
          { label: 'Score moyen',     value: `${avgScore}%`,  icon: '🎯', color: avgScore >= 70 ? '#52B788' : '#E67E22' },
          { label: 'Total révisions', value: totalReviews,    icon: '🔁', color: '#3B9EE8' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#444' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Heatmap d'activité ── */}
      <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
            Activité — {HEATMAP_WEEKS} semaines
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: '#444' }}>
            <span>Moins</span>
            {['#1A1A1A', 'rgba(82,183,136,0.25)', 'rgba(82,183,136,0.55)', 'rgba(82,183,136,0.8)', '#52B788'].map((c, i) => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '2px', background: c }} />
            ))}
            <span>Plus</span>
          </div>
        </div>

        {/* Étiquettes des mois */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${HEATMAP_WEEKS}, 1fr)`, gap: '3px', marginBottom: '3px' }}>
          {Array.from({ length: HEATMAP_WEEKS }, (_, col) => (
            <div key={col} style={{ fontSize: '0.6rem', color: monthLabels[col] ? '#555' : 'transparent', textAlign: 'left', paddingLeft: '1px' }}>
              {monthLabels[col] ?? '.'}
            </div>
          ))}
        </div>

        {/* Grille : 7 lignes × 16 colonnes */}
        {Array.from({ length: 7 }, (_, row) => (
          <div key={row} style={{ display: 'grid', gridTemplateColumns: `repeat(${HEATMAP_WEEKS}, 1fr)`, gap: '3px', marginBottom: '3px' }}>
            {Array.from({ length: HEATMAP_WEEKS }, (_, col) => {
              const dayIdx = col * 7 + row
              const dateKey = heatmapDays[dayIdx]
              const count = activityMap[dateKey] ?? 0
              return (
                <div
                  key={col}
                  title={`${dateKey} — ${count} activité${count > 1 ? 's' : ''}`}
                  style={{ height: '10px', borderRadius: '2px', background: heatColor(count), cursor: 'default' }}
                />
              )
            })}
          </div>
        ))}

        {/* Jours de la semaine */}
        <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <div key={i} style={{ fontSize: '0.6rem', color: '#333', width: `calc((100% - ${(HEATMAP_WEEKS - 1) * 3}px) / ${HEATMAP_WEEKS})`, textAlign: 'center', display: i % 2 === 0 ? 'block' : 'none' }}>
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bas de page : 2 colonnes ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* ── Distribution de maîtrise ── */}
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
              Maîtrise du vocabulaire
            </h2>
            {reviewDue > 0 && (
              <span style={{ fontSize: '0.7rem', color: '#E67E22', background: 'rgba(230,126,34,0.08)', border: '1px solid rgba(230,126,34,0.2)', padding: '0.2rem 0.6rem', borderRadius: '100px', fontWeight: 500 }}>
                {reviewDue} à réviser
              </span>
            )}
          </div>

          {totalWords === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#444', textAlign: 'center', padding: '2rem 0' }}>Aucun mot étudié</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {masteryOrder.map(key => {
                const { label, color, bg, border } = MASTERY[key]
                const group = masteryGroups[key]
                const count = group.length
                const pct   = Math.round((count / totalWords) * 100)
                const barW  = Math.round((count / maxMasteryCount) * 100)
                const avgAcc = count > 0
                  ? Math.round(group.reduce((a, p) => a + (p.reviewCount > 0 ? p.correctCount / p.reviewCount : 0), 0) / count * 100)
                  : 0

                return (
                  <div key={key}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.78rem', color, fontWeight: 500 }}>{label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.68rem', color: '#444' }}>{avgAcc}% correct</span>
                        <span style={{ fontSize: '0.75rem', color, background: bg, border: `1px solid ${border}`, padding: '0.15rem 0.5rem', borderRadius: '100px', fontWeight: 600, minWidth: '32px', textAlign: 'right' }}>
                          {count}
                        </span>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: '#1A1A1A', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${barW}%`, background: color, borderRadius: '6px', transition: 'width 0.6s ease', opacity: count === 0 ? 0.2 : 1 }} />
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#333', marginTop: '0.2rem' }}>
                      {pct}% du vocabulaire
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Courbe de rétention simplifiée */}
          {totalWords > 0 && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #1A1A1A' }}>
              <p style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Rétention par niveau de révision
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '48px' }}>
                {([
                  { label: '1 rév.',  filter: (p: UserProgress) => p.reviewCount === 1 },
                  { label: '2–3',     filter: (p: UserProgress) => p.reviewCount >= 2 && p.reviewCount <= 3 },
                  { label: '4–7',     filter: (p: UserProgress) => p.reviewCount >= 4 && p.reviewCount <= 7 },
                  { label: '8+',      filter: (p: UserProgress) => p.reviewCount >= 8 },
                ] as const).map(({ label, filter }) => {
                  const group = progress.filter(filter)
                  const retention = group.length > 0
                    ? Math.round(group.reduce((a, p) => a + (p.correctCount / Math.max(p.reviewCount, 1)), 0) / group.length * 100)
                    : 0
                  const barColor = retention >= 75 ? '#52B788' : retention >= 50 ? '#F39C12' : '#E74C3C'
                  return (
                    <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.62rem', color: barColor, fontWeight: 600 }}>{group.length > 0 ? `${retention}%` : '—'}</span>
                      <div style={{ width: '100%', height: `${Math.max(retention, 4)}%`, background: barColor, borderRadius: '3px 3px 0 0', opacity: group.length > 0 ? 1 : 0.15 }} />
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '3px' }}>
                {['1 rév.', '2–3', '4–7', '8+'].map(l => (
                  <div key={l} style={{ flex: 1, textAlign: 'center', fontSize: '0.6rem', color: '#444' }}>{l}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sessions récentes ── */}
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '16px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Sessions récentes
          </h2>

          {sessions.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#444', textAlign: 'center', padding: '2rem 0' }}>Aucune session enregistrée</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sessions.slice(0, 8).map((session: LearningSession) => {
                const correct = session.totalWords > 0
                  ? Math.round((session.correctAnswers / session.totalWords) * 100)
                  : session.score
                const isGood = correct >= 70
                return (
                  <div key={session.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#111', borderRadius: '10px', border: '1px solid #1A1A1A' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#CCC', fontWeight: 500 }}>
                          {session.languageCode}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: '#444', background: '#1A1A1A', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          {session.exerciseType?.replace('_', ' ').toLowerCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.68rem', color: '#444' }}>
                        {formatDate(session.completedAt)} · {formatDuration(session.durationSecs)} · {session.totalWords} mots
                      </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isGood ? '#52B788' : '#E74C3C', background: isGood ? 'rgba(82,183,136,0.08)' : 'rgba(231,76,60,0.08)', border: `1px solid ${isGood ? 'rgba(82,183,136,0.2)' : 'rgba(231,76,60,0.2)'}`, padding: '0.25rem 0.6rem', borderRadius: '100px', whiteSpace: 'nowrap' }}>
                      {session.correctAnswers}/{session.totalWords}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
