'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { wordApi } from '@/lib/api'
import { getTranslation } from '@/lib/utils'
import { Word } from '@/types'

const TIME_LIMIT = 75
const WORDS_PER_GAME = 8
const ACCENT = '#9B59B6'
const ACCENT_BG = 'rgba(155,89,182,0.08)'
const ACCENT_BORDER = 'rgba(155,89,182,0.2)'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type GameState = 'ready' | 'playing' | 'finished'
type AnswerState = 'none' | 'correct' | 'wrong'

export default function FillInBlankPage() {
  const user = useAuthStore((s) => s.user)

  const [gameState, setGameState]     = useState<GameState>('ready')
  const [words, setWords]             = useState<Word[]>([])
  const [current, setCurrent]         = useState(0)
  const [input, setInput]             = useState('')
  const [answerState, setAnswerState] = useState<AnswerState>('none')
  const [score, setScore]             = useState(0)
  const [timeLeft, setTimeLeft]       = useState(TIME_LIMIT)
  const [hintUsed, setHintUsed]       = useState(false)
  const [bestScore, setBestScore]     = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    return parseInt(localStorage.getItem(`fill-best-${user?.learningLanguage}`) ?? '0')
  })
  const inputRef = useRef<HTMLInputElement>(null)

  const loadWords = useCallback(async () => {
    if (!user) return undefined
    const { data } = await wordApi.getAll({ language: user.learningLanguage, limit: 50 })
    const all: Word[] = data.data.words
    return shuffle(all).slice(0, WORDS_PER_GAME)
  }, [user])

  const startGame = async () => {
    const loaded = await loadWords()
    if (!loaded) return
    setWords(loaded)
    setCurrent(0)
    setScore(0)
    setTimeLeft(TIME_LIMIT)
    setInput('')
    setAnswerState('none')
    setHintUsed(false)
    setGameState('playing')
  }

  // Focus input
  useEffect(() => {
    if (gameState === 'playing' && answerState === 'none') {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [gameState, current, answerState])

  // Chronomètre
  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) { setGameState('finished'); return }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000)
    return () => clearTimeout(t)
  }, [gameState, timeLeft])

  // Sauvegarde du meilleur score
  useEffect(() => {
    if (gameState !== 'finished') return
    const key = `fill-best-${user?.learningLanguage}`
    const prev = parseInt(localStorage.getItem(key) ?? '0')
    if (score > prev) {
      localStorage.setItem(key, score.toString())
      setBestScore(score)
    }
  }, [gameState]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    if (answerState !== 'none') return
    const word = words[current]
    const isCorrect = input.trim().toLowerCase() === word.term.toLowerCase()
    setAnswerState(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 20)

    setTimeout(() => {
      const next = current + 1
      if (next >= WORDS_PER_GAME) {
        setGameState('finished')
      } else {
        setCurrent(next)
        setInput('')
        setAnswerState('none')
        setHintUsed(false)
      }
    }, 1000)
  }

  const handleHint = () => {
    setInput(words[current].term[0])
    setHintUsed(true)
    inputRef.current?.focus()
  }

  const word = words[current]
  const timerPct   = (timeLeft / TIME_LIMIT) * 100
  const timerColor = timeLeft > 25 ? ACCENT : timeLeft > 10 ? '#E67E22' : '#E74C3C'

  // ── Écran d'accueil ──────────────────────────────────────────────────────────
  if (gameState === 'ready') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✏️</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Texte à trous
          </h1>
          <p style={{ color: '#444', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            {WORDS_PER_GAME} mots · {TIME_LIMIT} secondes<br />
            Tapez le mot dans la langue apprise
          </p>
          {bestScore > 0 && (
            <div style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, borderRadius: '10px', padding: '0.75rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: ACCENT }}>🏆 Meilleur score : <strong>{bestScore} pts</strong></p>
            </div>
          )}
          <button
            onClick={startGame}
            style={{ width: '100%', background: ACCENT, color: '#FFF', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: '0.75rem' }}
          >
            Commencer →
          </button>
          <Link href="/dashboard/games" style={{ display: 'block', fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>
            ← Retour aux jeux
          </Link>
        </div>
      </div>
    )
  }

  // ── Résultats ─────────────────────────────────────────────────────────────────
  if (gameState === 'finished') {
    const isRecord = score >= bestScore && score > 0
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {isRecord ? '🏆' : score >= 100 ? '🎉' : '💪'}
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            {isRecord ? 'Nouveau record !' : 'Partie terminée !'}
          </h2>
          <div style={{ fontSize: '4rem', fontWeight: 300, color: ACCENT, fontFamily: "'DM Serif Display', serif", margin: '1.5rem 0' }}>
            {score}<span style={{ fontSize: '1.5rem', color: '#444' }}> pts</span>
          </div>
          <p style={{ color: '#444', fontSize: '0.8rem', marginBottom: '2rem' }}>
            Meilleur score : <span style={{ color: ACCENT }}>{Math.max(score, bestScore)} pts</span>
          </p>
          <button
            onClick={startGame}
            style={{ width: '100%', background: ACCENT, color: '#FFF', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: '0.75rem' }}
          >
            Rejouer →
          </button>
          <Link href="/dashboard/games" style={{ display: 'block', fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>
            ← Retour aux jeux
          </Link>
        </div>
      </div>
    )
  }

  // ── Jeu en cours ──────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Link href="/dashboard/games" style={{ fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>← Jeux</Link>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: ACCENT }}>{score} pts</span>
      </div>

      {/* Chronomètre */}
      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#444' }}>Mot {current + 1} / {WORDS_PER_GAME}</span>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
          ⏱ {timeLeft}s
        </span>
      </div>
      <div style={{ height: '3px', background: '#1A1A1A', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: '3px', transition: 'width 1s linear, background 0.3s' }} />
      </div>

      {/* Carte question */}
      {word && user && (
        <>
          <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.65rem', color: '#333', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {user.nativeLanguage} → tapez en {user.learningLanguage}
            </p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.75rem, 5vw, 3rem)', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
              {getTranslation(word as unknown as Record<string, string>, user.nativeLanguage)}
            </h2>
            {/* Tirets indiquant le nombre de lettres */}
            <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {Array.from({ length: word.term.length }).map((_, i) => (
                <div
                  key={i}
                  style={{ width: '16px', height: '2px', background: word.term[i] === ' ' ? 'transparent' : '#2A2A2A', borderRadius: '2px' }}
                />
              ))}
            </div>
          </div>

          {/* Feedback */}
          {answerState === 'wrong' && (
            <div style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: '12px', padding: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
              <p style={{ color: '#E74C3C', fontSize: '0.875rem' }}>
                ✗ Réponse attendue : <strong>{word.term}</strong>
                {word.phonetic && <span style={{ color: '#555', marginLeft: '0.5rem' }}>({word.phonetic})</span>}
              </p>
            </div>
          )}
          {answerState === 'correct' && (
            <div style={{ background: 'rgba(82,183,136,0.08)', border: '1px solid rgba(82,183,136,0.2)', borderRadius: '12px', padding: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
              <p style={{ color: '#52B788', fontSize: '0.875rem' }}>✓ Correct ! +20 pts</p>
            </div>
          )}
          {answerState === 'none' && <div style={{ height: '52px', marginBottom: '1rem' }} />}

          {/* Champ de saisie */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              disabled={answerState !== 'none'}
              placeholder={`Tapez le mot en ${user.learningLanguage}…`}
              style={{
                flex: 1,
                background: '#0E0E0E',
                border: `1px solid ${answerState === 'correct' ? 'rgba(82,183,136,0.4)' : answerState === 'wrong' ? 'rgba(231,76,60,0.4)' : '#2A2A2A'}`,
                borderRadius: '12px',
                padding: '0.875rem 1rem',
                fontSize: '1rem',
                color: '#F0F0EE',
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={answerState !== 'none' || !input.trim()}
              style={{
                background: ACCENT,
                color: '#FFF',
                border: 'none',
                borderRadius: '12px',
                padding: '0 1.25rem',
                fontSize: '1.1rem',
                cursor: answerState !== 'none' || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: answerState !== 'none' || !input.trim() ? 0.4 : 1,
                fontFamily: "'DM Sans', sans-serif",
                transition: 'opacity 0.2s',
              }}
            >
              ✓
            </button>
          </div>

          {/* Bouton indice */}
          {!hintUsed && answerState === 'none' && (
            <button
              onClick={handleHint}
              style={{
                display: 'block',
                margin: '0 auto',
                background: 'none',
                border: 'none',
                color: '#444',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              💡 Révéler la première lettre
            </button>
          )}
        </>
      )}
    </div>
  )
}
