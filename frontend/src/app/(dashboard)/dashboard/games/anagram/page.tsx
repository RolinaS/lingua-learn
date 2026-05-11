'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { wordApi } from '@/lib/api'
import { getTranslation } from '@/lib/utils'
import { Word } from '@/types'

const TIME_LIMIT   = 45
const WORDS_COUNT  = 8

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function scramble(word: string): string[] {
  const letters = word.toUpperCase().split('')
  // S'assurer que l'anagramme est différent du mot original
  let scrambled = shuffle(letters)
  let attempts  = 0
  while (scrambled.join('') === word.toUpperCase() && attempts < 20) {
    scrambled = shuffle(letters)
    attempts++
  }
  return scrambled
}

type GameState = 'ready' | 'playing' | 'finished'
type AnswerState = 'none' | 'correct' | 'wrong'

export default function AnagramPage() {
  const user = useAuthStore((s) => s.user)

  const [gameState, setGameState]     = useState<GameState>('ready')
  const [words, setWords]             = useState<Word[]>([])
  const [current, setCurrent]         = useState(0)
  const [letters, setLetters]         = useState<string[]>([])   // lettres disponibles
  const [answer, setAnswer]           = useState<string[]>([])   // lettres placées
  const [answerState, setAnswerState] = useState<AnswerState>('none')
  const [score, setScore]             = useState(0)
  const [timeLeft, setTimeLeft]       = useState(TIME_LIMIT)
  const [bestScore, setBestScore]     = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    return parseInt(localStorage.getItem(`anagram-best-${user?.learningLanguage}`) || '0')
  })

  const loadWords = useCallback(async () => {
    if (!user) return []
    const { data } = await wordApi.getAll({ language: user.learningLanguage, limit: 50 })
    const all: Word[] = data.data.words
    // Filtrer les mots courts (min 3 lettres) et sans espaces pour l'anagramme
    const suitable = all.filter(w => w.term.length >= 3 && !w.term.includes(' '))
    return shuffle(suitable).slice(0, WORDS_COUNT)
  }, [user])

  const startGame = async () => {
    const loaded = await loadWords()
    if (!loaded.length) return
    setWords(loaded)
    setCurrent(0)
    setScore(0)
    setTimeLeft(TIME_LIMIT)
    setAnswerState('none')
    setAnswer([])
    setLetters(scramble(loaded[0].term))
    setGameState('playing')
  }

  const setupWord = (word: Word) => {
    setLetters(scramble(word.term))
    setAnswer([])
    setAnswerState('none')
  }

  // Chronomètre
  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) { setGameState('finished'); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [gameState, timeLeft])

  // Fin de partie
  useEffect(() => {
    if (gameState === 'finished') {
      const key = `anagram-best-${user?.learningLanguage}`
      const prev = parseInt(localStorage.getItem(key) || '0')
      if (score > prev) {
        localStorage.setItem(key, score.toString())
        setBestScore(score)
      }
    }
  }, [gameState])

  // Ajouter une lettre à la réponse
  const addLetter = (idx: number) => {
    if (answerState !== 'none') return
    const letter = letters[idx]
    setAnswer(prev => [...prev, letter])
    setLetters(prev => prev.filter((_, i) => i !== idx))
  }

  // Retirer une lettre de la réponse
  const removeLetter = (idx: number) => {
    if (answerState !== 'none') return
    const letter = answer[idx]
    setLetters(prev => [...prev, letter])
    setAnswer(prev => prev.filter((_, i) => i !== idx))
  }

  // Valider la réponse
  const validate = () => {
    if (answerState !== 'none' || !words[current]) return
    const attempt = answer.join('').toLowerCase()
    const correct = words[current].term.toLowerCase()

    if (attempt === correct) {
      setAnswerState('correct')
      setScore(s => s + 15)
      setTimeout(() => {
        const next = current + 1
        if (next >= words.length) {
          setGameState('finished')
        } else {
          setCurrent(next)
          setupWord(words[next])
        }
      }, 800)
    } else {
      setAnswerState('wrong')
      setTimeout(() => {
        // Remettre toutes les lettres
        setupWord(words[current])
      }, 700)
    }
  }

  // Passer le mot
  const skip = () => {
    if (answerState !== 'none') return
    const next = current + 1
    if (next >= words.length) {
      setGameState('finished')
    } else {
      setCurrent(next)
      setupWord(words[next])
    }
  }

  const currentWord = words[current]
  const timerPct    = (timeLeft / TIME_LIMIT) * 100
  const timerColor  = timeLeft > 20 ? '#E67E22' : timeLeft > 10 ? '#E74C3C' : '#E74C3C'
  const isComplete  = answer.length === (currentWord?.term.length ?? 0)

  // ── Écran d'accueil ──
  if (gameState === 'ready') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔀</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Anagramme</h1>
          <p style={{ color: '#444', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            {WORDS_COUNT} mots · {TIME_LIMIT} secondes par mot<br />
            Remettez les lettres dans le bon ordre
          </p>
          {bestScore > 0 && (
            <div style={{ background: 'rgba(230,126,34,0.08)', border: '1px solid rgba(230,126,34,0.2)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#E67E22' }}>🏆 Meilleur score : <strong>{bestScore} pts</strong></p>
            </div>
          )}
          <button onClick={startGame} style={{ width: '100%', background: '#E67E22', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: '0.75rem' }}>
            Commencer →
          </button>
          <Link href="/dashboard/games" style={{ display: 'block', fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>← Retour aux jeux</Link>
        </div>
      </div>
    )
  }

  // ── Résultats ──
  if (gameState === 'finished') {
    const isRecord = score >= bestScore && score > 0
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{isRecord ? '🏆' : score >= 80 ? '🎉' : '💪'}</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            {isRecord ? 'Nouveau record !' : 'Partie terminée !'}
          </h2>
          <div style={{ fontSize: '4rem', fontWeight: 300, color: '#E67E22', fontFamily: "'DM Serif Display', serif", margin: '1.5rem 0' }}>
            {score}<span style={{ fontSize: '1.5rem', color: '#444' }}> pts</span>
          </div>
          <p style={{ color: '#444', fontSize: '0.8rem', marginBottom: '2rem' }}>
            Meilleur score : <span style={{ color: '#E67E22' }}>{Math.max(score, bestScore)} pts</span>
          </p>
          <button onClick={startGame} style={{ width: '100%', background: '#E67E22', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: '0.75rem' }}>
            Rejouer →
          </button>
          <Link href="/dashboard/games" style={{ display: 'block', fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>← Retour aux jeux</Link>
        </div>
      </div>
    )
  }

  // ── Jeu en cours ──
  return (
    <div style={{ padding: '2rem', maxWidth: '560px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Link href="/dashboard/games" style={{ fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>← Jeux</Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#444' }}>Mot {current + 1}/{words.length}</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#E67E22' }}>{score} pts</span>
        </div>
      </div>

      {/* Chronomètre */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#444' }}>Reconstituez le mot</span>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: timerColor }}>⏱ {timeLeft}s</span>
      </div>
      <div style={{ height: '3px', background: '#1A1A1A', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: '3px', transition: 'width 1s linear, background 0.3s' }} />
      </div>

      {/* Indice — traduction */}
      {currentWord && (
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.65rem', color: '#333', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Traduction ({user?.nativeLanguage})
          </p>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#52B788', letterSpacing: '-0.02em' }}>
            {user ? getTranslation(currentWord as unknown as Record<string, string>, user.nativeLanguage) : ''}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#333', marginTop: '0.5rem' }}>
            {currentWord.term.length} lettres · {user?.learningLanguage}
          </p>
        </div>
      )}

      {/* Zone de réponse */}
      <div style={{
        minHeight: '64px',
        background: answerState === 'correct' ? 'rgba(82,183,136,0.08)' : answerState === 'wrong' ? 'rgba(231,76,60,0.08)' : '#0E0E0E',
        border: `1px solid ${answerState === 'correct' ? 'rgba(82,183,136,0.4)' : answerState === 'wrong' ? 'rgba(231,76,60,0.4)' : '#1A1A1A'}`,
        borderRadius: '14px',
        padding: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1rem',
        minWidth: 0,
        transition: 'all 0.15s',
      }}>
        {answer.length === 0 ? (
          <span style={{ fontSize: '0.8rem', color: '#2A2A2A' }}>Cliquez sur les lettres ci-dessous</span>
        ) : (
          answer.map((letter, idx) => (
            <button
              key={idx}
              onClick={() => removeLetter(idx)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: answerState === 'correct' ? 'rgba(82,183,136,0.15)' : answerState === 'wrong' ? 'rgba(231,76,60,0.15)' : '#161616',
                border: `1px solid ${answerState === 'correct' ? 'rgba(82,183,136,0.3)' : answerState === 'wrong' ? 'rgba(231,76,60,0.3)' : '#222'}`,
                color: answerState === 'correct' ? '#52B788' : answerState === 'wrong' ? '#E74C3C' : '#F0F0EE',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: answerState !== 'none' ? 'default' : 'pointer',
                fontFamily: "'DM Serif Display', serif",
                transition: 'all 0.1s',
              }}
            >
              {letter}
            </button>
          ))
        )}
      </div>

      {/* Lettres disponibles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {letters.map((letter, idx) => (
          <button
            key={idx}
            onClick={() => addLetter(idx)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: '#111',
              border: '1px solid #2A2A2A',
              color: '#F0F0EE',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'DM Serif Display', serif",
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.borderColor = '#E67E22' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.borderColor = '#2A2A2A' }}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Boutons action */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={skip}
          disabled={answerState !== 'none'}
          style={{ flex: 1, background: 'transparent', border: '1px solid #1A1A1A', borderRadius: '10px', padding: '0.75rem', fontSize: '0.8rem', color: '#444', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
        >
          Passer →
        </button>
        <button
          onClick={validate}
          disabled={!isComplete || answerState !== 'none'}
          style={{
            flex: 2,
            background: isComplete && answerState === 'none' ? '#E67E22' : '#1A1A1A',
            border: 'none',
            borderRadius: '10px',
            padding: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: isComplete && answerState === 'none' ? '#fff' : '#333',
            cursor: isComplete && answerState === 'none' ? 'pointer' : 'default',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.2s',
          }}
        >
          {answerState === 'correct' ? '✓ Correct !' : answerState === 'wrong' ? '✗ Réessayez' : 'Valider'}
        </button>
      </div>
    </div>
  )
}