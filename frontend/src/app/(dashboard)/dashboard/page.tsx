'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useLearnStore } from '@/store/learn.store'
import { wordApi, progressApi } from '@/lib/api'
import { getTranslation } from '@/lib/utils'
import { Word, Category } from '@/types'

type CardState = 'question' | 'answer'
type ViewState = 'categories' | 'learning'

// ─────────────────────────────────────────────
// Composant sélecteur de catégories
// ─────────────────────────────────────────────

function CategorySelector({
  categories,
  onSelect,
  onSelectAll,
  language,
}: {
  categories: Category[]
  onSelect: (slug: string, name: string) => void
  onSelectAll: () => void
  language: string
}) {
  return (
    <div style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
          Apprendre
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#444' }}>
          Choisissez un thème ou apprenez tous les mots en {language}
        </p>
      </div>

      {/* Bouton — Tous les mots */}
      <button
        onClick={onSelectAll}
        style={{
          width: '100%',
          background: 'rgba(82,183,136,0.08)',
          border: '1px solid rgba(82,183,136,0.25)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(82,183,136,0.5)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(82,183,136,0.25)')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌍</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#52B788' }}>Tous les mots</p>
            <p style={{ fontSize: '0.75rem', color: '#444', marginTop: '0.1rem' }}>
              {categories.length * 30} mots · toutes catégories
            </p>
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#52B788' }}>→</span>
      </button>

      {/* Séparateur */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, height: '1px', background: '#1A1A1A' }} />
        <span style={{ fontSize: '0.7rem', color: '#333', letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase' }}>
          Par thème
        </span>
        <div style={{ flex: 1, height: '1px', background: '#1A1A1A' }} />
      </div>

      {/* Grille de catégories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {categories.map((cat) => {
          const name = cat.nameFr
          return (
            <button
              key={cat.slug}
              onClick={() => onSelect(cat.slug, name)}
              style={{
                background: '#0E0E0E',
                border: '1px solid #1A1A1A',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.625rem',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#2A2A2A'
                e.currentTarget.style.background = '#111'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1A1A1A'
                e.currentTarget.style.background = '#0E0E0E'
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>{cat.emoji}</span>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#F0F0EE' }}>{name}</p>
                <p style={{ fontSize: '0.7rem', color: '#444', marginTop: '0.2rem' }}>~30 mots</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────

export default function DashboardPage() {
  const user         = useAuthStore((s) => s.user)
  const session      = useLearnStore((s) => s.session)
  const isExpired    = useLearnStore((s) => s.isExpired)
  const startSession = useLearnStore((s) => s.startSession)
  const setPosition  = useLearnStore((s) => s.setPosition)
  const addScore     = useLearnStore((s) => s.addScore)
  const clearSession = useLearnStore((s) => s.clearSession)

  const [view, setView]           = useState<ViewState>('categories')
  const [cardState, setCardState] = useState<CardState>('question')
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [resuming, setResuming]   = useState(false)
  const initialized = useRef(false)

  // ── Chargement initial des catégories ──
  useEffect(() => {
    if (!user || initialized.current) return
    initialized.current = true

    const init = async () => {
      setIsLoading(true)
      try {
        // Récupérer toutes les catégories en paginant
        const catMap = new Map<string, Category>()
        let page = 1
        let hasMore = true

        while (hasMore) {
          const res = await wordApi.getAll({ language: user.learningLanguage, limit: 50, page })
          const words: Word[] = res.data.data.words
          const totalPages: number = res.data.data.pages
          words.forEach((w) => {
            if (w.category && !catMap.has(w.category.slug)) {
              catMap.set(w.category.slug, w.category)
            }
          })
          hasMore = page < totalPages
          page++
        }

        const cats = Array.from(catMap.values()).sort((a, b) => a.orderIndex - b.orderIndex)
        setCategories(cats)

        // Si session valide en cours → reprendre directement
        if (
          session &&
          !isExpired() &&
          session.language === user.learningLanguage &&
          session.words.length > 0 &&
          session.current < session.words.length
        ) {
          setCurrentCategory(session.categorySlug ?? null)
          setResuming(true)
          setView('learning')
        }
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  // ── Démarrer une session par catégorie ──
  const handleSelectCategory = async (slug: string, name: string) => {
    if (!user) return
    setIsLoading(true)
    try {
      const { data } = await wordApi.getAll({
        language: user.learningLanguage,
        category: slug,
        limit: 50,
      })
      clearSession()
      startSession(data.data.words as Word[], user.learningLanguage, slug)
      setCurrentCategory(slug)
      setResuming(false)
      setView('learning')
      setCardState('question')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Démarrer tous les mots ──
  const handleSelectAll = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const { data } = await wordApi.getAll({
        language: user.learningLanguage,
        limit: 50,
      })
      clearSession()
      startSession(data.data.words as Word[], user.learningLanguage, null)
      setCurrentCategory(null)
      setResuming(false)
      setView('learning')
      setCardState('question')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Raccourcis clavier ──
  useEffect(() => {
    if (view !== 'learning') return
    const handler = (e: KeyboardEvent) => {
      if (cardState === 'question' && e.key === ' ') { e.preventDefault(); setCardState('answer') }
      if (cardState === 'answer') {
        if (e.key === 'ArrowRight' || e.key === 'y') handleAnswer(true)
        if (e.key === 'ArrowLeft'  || e.key === 'n') handleAnswer(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [cardState, view, session])

  const words       = session?.words ?? []
  const current     = session?.current ?? 0
  const score       = session?.score ?? { correct: 0, incorrect: 0 }
  const currentWord = words[current]
  const isFinished  = words.length > 0 && current >= words.length
  const progress    = words.length > 0 ? (current / words.length) * 100 : 0

  const handleAnswer = async (correct: boolean) => {
    if (!currentWord) return
    await progressApi.update({ wordId: currentWord.id, correct }).catch(() => {})
    addScore(correct)
    setPosition(current + 1)
    setCardState('question')
  }

  const handleFinishSession = () => {
    clearSession()
    setView('categories')
    setResuming(false)
    setCardState('question')
  }

  // ── Loading ──
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}>📖</div>
          <p style={{ color: '#444', fontSize: '0.875rem' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  // ── Sélecteur de catégories ──
  if (view === 'categories') {
    return (
      <CategorySelector
        categories={categories}
        language={user?.learningLanguage ?? 'EN'}
        onSelect={handleSelectCategory}
        onSelectAll={handleSelectAll}
      />
    )
  }

  // ── Fin de session ──
  if (isFinished) {
    const total   = score.correct + score.incorrect
    const percent = total > 0 ? Math.round((score.correct / total) * 100) : 0
    const catName = currentCategory
      ? categories.find(c => c.slug === currentCategory)?.nameFr
      : 'tous les mots'

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{percent >= 70 ? '🎉' : '💪'}</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
            Session terminée !
          </h2>
          {catName && (
            <p style={{ fontSize: '0.8rem', color: '#52B788', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>
              {catName}
            </p>
          )}
          <p style={{ color: '#444', fontSize: '0.875rem', marginBottom: '2rem' }}>
            {total} mots parcourus
          </p>
          <div style={{ fontSize: '4rem', fontWeight: 300, color: '#52B788', fontFamily: "'DM Serif Display', serif", marginBottom: '1.5rem' }}>
            {percent}%
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#52B788' }}>{score.correct}</div>
              <div style={{ fontSize: '0.75rem', color: '#444' }}>Corrects</div>
            </div>
            <div style={{ width: '1px', background: '#1A1A1A' }} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#E74C3C' }}>{score.incorrect}</div>
              <div style={{ fontSize: '0.75rem', color: '#444' }}>Incorrects</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentCategory && (
              <button
                onClick={() => handleSelectCategory(currentCategory, '')}
                style={{ width: '100%', background: '#52B788', color: '#0A0A0A', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
              >
                Recommencer ce thème →
              </button>
            )}
            <button
              onClick={handleFinishSession}
              style={{ width: '100%', background: 'transparent', color: '#666', border: '1px solid #1A1A1A', borderRadius: '10px', padding: '0.875rem', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
            >
              Choisir un autre thème
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Carte d'apprentissage ──
  return (
    <div style={{ padding: '2.5rem', maxWidth: '640px', margin: '0 auto' }}>

      {/* Bannière reprise */}
      {resuming && (
        <div style={{ background: 'rgba(82,183,136,0.08)', border: '1px solid rgba(82,183,136,0.2)', borderRadius: '12px', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#52B788' }}>
              ↩ Session reprise — mot {current + 1} / {words.length}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#444', marginTop: '0.2rem' }}>
              Score : ✓ {score.correct} · ✗ {score.incorrect}
            </p>
          </div>
          <button
            onClick={handleFinishSession}
            style={{ background: 'transparent', border: '1px solid #1A1A1A', borderRadius: '8px', padding: '0.375rem 0.875rem', fontSize: '0.75rem', color: '#666', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}
          >
            Changer de thème
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <button
              onClick={() => setView('categories')}
              style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif", padding: 0, display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              ← Thèmes
            </button>
            {currentCategory && (
              <>
                <span style={{ color: '#222', fontSize: '0.8rem' }}>/</span>
                <span style={{ fontSize: '0.8rem', color: '#52B788', fontWeight: 500 }}>
                  {categories.find(c => c.slug === currentCategory)?.emoji}{' '}
                  {categories.find(c => c.slug === currentCategory)?.nameFr}
                </span>
              </>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#444' }}>Mot {current + 1} / {words.length}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span style={{ background: 'rgba(82,183,136,0.08)', border: '1px solid rgba(82,183,136,0.15)', color: '#52B788', padding: '0.375rem 0.875rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500 }}>
            ✓ {score.correct}
          </span>
          <span style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.15)', color: '#E74C3C', padding: '0.375rem 0.875rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500 }}>
            ✗ {score.incorrect}
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div style={{ height: '2px', background: '#1A1A1A', borderRadius: '2px', marginBottom: '2.5rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#52B788', borderRadius: '2px', transition: 'width 0.4s ease' }} />
      </div>

      {/* Carte */}
      {currentWord && (
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3rem 2.5rem', textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: '#161616', border: '1px solid #1E1E1E', color: '#555', padding: '0.375rem 0.875rem', borderRadius: '100px', fontSize: '0.75rem', marginBottom: '2rem' }}>
            {currentWord.category?.emoji} {currentWord.category?.nameFr}
          </span>

          <p style={{ fontSize: '0.65rem', color: '#333', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {user?.learningLanguage}
          </p>

          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: '#F0F0EE', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.75rem' }}>
            {currentWord.term}
          </h2>

          {currentWord.phonetic && (
            <p style={{ color: '#52B788', fontSize: '1rem', marginBottom: '2rem', fontWeight: 300 }}>
              {currentWord.phonetic}
            </p>
          )}

          {cardState === 'answer' && (
            <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: '2rem', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.65rem', color: '#333', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                {user?.nativeLanguage}
              </p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: '#52B788', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                {user ? getTranslation(currentWord as unknown as Record<string, string>, user.nativeLanguage) : ''}
              </p>
              {currentWord.exampleEn && (
                <p style={{ fontSize: '0.875rem', color: '#333', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  &quot;{currentWord.exampleEn}&quot;
                </p>
              )}
              <p style={{ fontSize: '0.7rem', color: '#2A2A2A', marginBottom: '1.5rem' }}>← Non · Oui →</p>
            </div>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            {cardState === 'question' ? (
              <div>
                <button onClick={() => setCardState('answer')} style={{ background: '#52B788', color: '#0A0A0A', border: 'none', borderRadius: '100px', padding: '0.75rem 2rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                  Voir la traduction
                </button>
                <p style={{ fontSize: '0.7rem', color: '#2A2A2A', marginTop: '0.75rem' }}>Appuyez sur Espace</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => handleAnswer(false)} style={{ flex: 1, maxWidth: '180px', background: 'transparent', color: '#E74C3C', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                  ✗ Je ne savais pas
                </button>
                <button onClick={() => handleAnswer(true)} style={{ flex: 1, maxWidth: '180px', background: '#52B788', color: '#0A0A0A', border: 'none', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                  ✓ Je savais !
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}