'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { wordApi } from '@/lib/api'
import { getTranslation } from '@/lib/utils'
import { Word } from '@/types'

const TIME_LIMIT = 90
const PAIRS_COUNT = 6

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

interface Card {
  id: string
  text: string
  type: 'word' | 'translation'
  wordId: string
  matched: boolean
}

type GameState = 'ready' | 'playing' | 'finished'

export default function PairsPage() {
  const user = useAuthStore((s) => s.user)

  const [gameState, setGameState] = useState<GameState>('ready')
  const [cards, setCards]         = useState<Card[]>([])
  const [selected, setSelected]   = useState<string | null>(null)
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null)
  const [matched, setMatched]     = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft]   = useState(TIME_LIMIT)
  const [moves, setMoves]         = useState(0)
  const [bestMoves, setBestMoves] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    return parseInt(localStorage.getItem(`pairs-best-${user?.learningLanguage}`) || '0')
  })

  const loadAndStart = useCallback(async () => {
    if (!user) return
    const { data } = await wordApi.getAll({ language: user.learningLanguage, limit: 50 })
    const all: Word[] = data.data.words
    const picked = shuffle(all).slice(0, PAIRS_COUNT)

    const newCards: Card[] = shuffle([
      ...picked.map(w => ({
        id: `word-${w.id}`,
        text: w.term,
        type: 'word' as const,
        wordId: w.id,
        matched: false,
      })),
      ...picked.map(w => ({
        id: `trans-${w.id}`,
        text: getTranslation(w as unknown as Record<string, string>, user.nativeLanguage),
        type: 'translation' as const,
        wordId: w.id,
        matched: false,
      })),
    ])

    setCards(newCards)
    setSelected(null)
    setWrongPair(null)
    setMatched(new Set())
    setMoves(0)
    setTimeLeft(TIME_LIMIT)
    setGameState('playing')
  }, [user])

  // Chronomètre
  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) { setGameState('finished'); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [gameState, timeLeft])

  // Vérifier si toutes les paires sont trouvées
  useEffect(() => {
    if (gameState === 'playing' && matched.size === PAIRS_COUNT) {
      setGameState('finished')
      const key = `pairs-best-${user?.learningLanguage}`
      const prev = parseInt(localStorage.getItem(key) || '0')
      if (prev === 0 || moves < prev) {
        localStorage.setItem(key, moves.toString())
        setBestMoves(moves)
      }
    }
  }, [matched, gameState])

  const handleSelect = (cardId: string) => {
    if (wrongPair) return
    const card = cards.find(c => c.id === cardId)
    if (!card || matched.has(card.wordId)) return

    if (!selected) {
      setSelected(cardId)
      return
    }

    if (selected === cardId) {
      setSelected(null)
      return
    }

    const selCard = cards.find(c => c.id === selected)
    if (!selCard) return

    setMoves(m => m + 1)

    if (selCard.wordId === card.wordId) {
      // Bonne paire !
      setMatched(prev => new Set([...prev, card.wordId]))
      setSelected(null)
    } else {
      // Mauvaise paire
      setWrongPair([selected, cardId])
      setTimeout(() => {
        setWrongPair(null)
        setSelected(null)
      }, 700)
    }
  }

  const timerPct   = (timeLeft / TIME_LIMIT) * 100
  const timerColor = timeLeft > 30 ? '#52B788' : timeLeft > 15 ? '#E67E22' : '#E74C3C'
  const isRecord   = bestMoves > 0 && moves <= bestMoves && matched.size === PAIRS_COUNT

  // ── Écran d'accueil ──
  if (gameState === 'ready') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Paires</h1>
          <p style={{ color: '#444', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            {PAIRS_COUNT} paires · {TIME_LIMIT} secondes<br />
            Reliez chaque mot à sa traduction
          </p>
          {bestMoves > 0 && (
            <div style={{ background: 'rgba(59,158,232,0.08)', border: '1px solid rgba(59,158,232,0.2)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#3B9EE8' }}>🏆 Meilleur : <strong>{bestMoves} coups</strong></p>
            </div>
          )}
          <button onClick={loadAndStart} style={{ width: '100%', background: '#3B9EE8', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: '0.75rem' }}>
            Commencer →
          </button>
          <Link href="/dashboard/games" style={{ display: 'block', fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>← Retour aux jeux</Link>
        </div>
      </div>
    )
  }

  // ── Résultats ──
  if (gameState === 'finished') {
    const completed = matched.size === PAIRS_COUNT
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{isRecord ? '🏆' : completed ? '🎉' : '⏰'}</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            {isRecord ? 'Nouveau record !' : completed ? 'Terminé !' : 'Temps écoulé !'}
          </h2>
          <div style={{ margin: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', fontWeight: 300, color: '#3B9EE8', fontFamily: "'DM Serif Display', serif" }}>
              {matched.size}<span style={{ fontSize: '1.25rem', color: '#444' }}>/{PAIRS_COUNT}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#444', marginTop: '0.5rem' }}>paires trouvées en {moves} coups</p>
          </div>
          {bestMoves > 0 && (
            <p style={{ color: '#444', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              Meilleur : <span style={{ color: '#3B9EE8' }}>{Math.min(moves || 999, bestMoves)} coups</span>
            </p>
          )}
          <button onClick={loadAndStart} style={{ width: '100%', background: '#3B9EE8', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: '0.75rem' }}>
            Rejouer →
          </button>
          <Link href="/dashboard/games" style={{ display: 'block', fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>← Retour aux jeux</Link>
        </div>
      </div>
    )
  }

  // ── Jeu en cours ──
  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Link href="/dashboard/games" style={{ fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>← Jeux</Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#444' }}>{moves} coups</span>
          <span style={{ fontSize: '0.8rem', color: '#52B788', fontWeight: 600 }}>{matched.size}/{PAIRS_COUNT} ✓</span>
        </div>
      </div>

      {/* Chronomètre */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#444' }}>Reliez les paires</span>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: timerColor }}>⏱ {timeLeft}s</span>
      </div>
      <div style={{ height: '3px', background: '#1A1A1A', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: '3px', transition: 'width 1s linear, background 0.3s' }} />
      </div>

      {/* Grille de cartes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem' }}>
        {cards.map((card) => {
          const isMatched  = matched.has(card.wordId)
          const isSelected = selected === card.id
          const isWrong    = wrongPair?.includes(card.id)
          const isAR = card.text.match(/[\u0600-\u06FF]/)

          let bg = '#0E0E0E', border = '#1A1A1A', color = '#CCC', opacity = 1

          if (isMatched)    { bg = 'rgba(82,183,136,0.08)';  border = 'rgba(82,183,136,0.3)';  color = '#52B788'; opacity = 0.7 }
          else if (isWrong) { bg = 'rgba(231,76,60,0.12)';   border = '#E74C3C';               color = '#E74C3C' }
          else if (isSelected) { bg = 'rgba(59,158,232,0.12)'; border = '#3B9EE8';              color = '#3B9EE8' }

          return (
            <button
              key={card.id}
              onClick={() => !isMatched && handleSelect(card.id)}
              disabled={isMatched}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: '10px',
                padding: '0.875rem 0.5rem',
                fontSize: isAR ? '1rem' : '0.8rem',
                fontWeight: 500,
                color,
                cursor: isMatched ? 'default' : 'pointer',
                fontFamily: isAR ? 'serif' : "'DM Sans', sans-serif",
                transition: 'all 0.15s',
                minHeight: '64px',
                lineHeight: '1.3',
                direction: isAR ? 'rtl' : 'ltr',
                opacity,
                wordBreak: 'break-word',
              }}
            >
              {isMatched ? '✓' : card.text}
            </button>
          )
        })}
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#2A2A2A' }}>
        Sélectionnez un mot puis sa traduction
      </p>
    </div>
  )
}