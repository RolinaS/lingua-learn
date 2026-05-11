'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { wordApi } from '@/lib/api'
import { getTranslation } from '@/lib/utils'
import { Word } from '@/types'

const TIME_LIMIT = 60
const WORDS_PER_GAME = 10

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type GameState = 'ready' | 'playing' | 'finished'
type AnswerState = 'none' | 'correct' | 'wrong'

export default function QCMPage() {
  const user = useAuthStore((s) => s.user)

  const [gameState, setGameState] = useState<GameState>('ready')
  const [words, setWords]         = useState<Word[]>([])
  const [current, setCurrent]     = useState(0)
  const [choices, setChoices]     = useState<string[]>([])
  const [selected, setSelected]   = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('none')
  const [score, setScore]         = useState(0)
  const [timeLeft, setTimeLeft]   = useState(TIME_LIMIT)
  const [bestScore, setBestScore] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    return parseInt(localStorage.getItem(`qcm-best-${user?.learningLanguage}`) || '0')
  })

  // Charger les mots
  const loadWords = useCallback(async () => {
    if (!user) return
    const { data } = await wordApi.getAll({ language: user.learningLanguage, limit: 50 })
    const all: Word[] = data.data.words
    return shuffle(all).slice(0, WORDS_PER_GAME + 10) // extra pour les faux choix
  }, [user])

  // Générer les choix pour une question
  const generateChoices = useCallback((word: Word, allWords: Word[]) => {
    if (!user) return []
    const correct = getTranslation(word as unknown as Record<string, string>, user.nativeLanguage)
    const others = allWords
      .filter(w => w.id !== word.id)
      .map(w => getTranslation(w as unknown as Record<string, string>, user.nativeLanguage))
      .filter(t => t !== correct)
    return shuffle([correct, ...shuffle(others).slice(0, 3)])
  }, [user])

  // Démarrer le jeu
  const startGame = async () => {
    const loaded = await loadWords()
    if (!loaded) return
    const gameWords = loaded.slice(0, WORDS_PER_GAME)
    setWords(loaded)
    setCurrent(0)
    setScore(0)
    setTimeLeft(TIME_LIMIT)
    setSelected(null)
    setAnswerState('none')
    setChoices(generateChoices(gameWords[0], loaded))
    setGameState('playing')
  }

  // Chronomètre
  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) {
      setGameState('finished')
      return
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [gameState, timeLeft])

  // Fin de partie — sauvegarder meilleur score
  useEffect(() => {
    if (gameState === 'finished') {
      const key = `qcm-best-${user?.learningLanguage}`
      const prev = parseInt(localStorage.getItem(key) || '0')
      if (score > prev) {
        localStorage.setItem(key, score.toString())
        setBestScore(score)
      }
    }
  }, [gameState])

  // Répondre
  const handleAnswer = (choice: string) => {
    if (answerState !== 'none' || !user) return
    const gameWords = words.slice(0, WORDS_PER_GAME)
    const correct = getTranslation(gameWords[current] as unknown as Record<string, string>, user.nativeLanguage)
    const isCorrect = choice === correct

    setSelected(choice)
    setAnswerState(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 10)

    // Passer au suivant après 800ms
    setTimeout(() => {
      const next = current + 1
      if (next >= WORDS_PER_GAME) {
        setGameState('finished')
      } else {
        setCurrent(next)
        setChoices(generateChoices(gameWords[next], words))
        setSelected(null)
        setAnswerState('none')
      }
    }, 800)
  }

  const currentWord = words[current]
  const timerPct    = (timeLeft / TIME_LIMIT) * 100
  const timerColor  = timeLeft > 20 ? '#52B788' : timeLeft > 10 ? '#E67E22' : '#E74C3C'

  // ── Écran d'accueil ──
  if (gameState === 'ready') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>QCM</h1>
          <p style={{ color: '#444', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            {WORDS_PER_GAME} questions · {TIME_LIMIT} secondes<br />
            Trouvez la bonne traduction parmi 4 choix
          </p>
          {bestScore > 0 && (
            <div style={{ background: 'rgba(82,183,136,0.08)', border: '1px solid rgba(82,183,136,0.2)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#52B788' }}>🏆 Meilleur score : <strong>{bestScore} pts</strong></p>
            </div>
          )}
          <button onClick={startGame} style={{ width: '100%', background: '#52B788', color: '#0A0A0A', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: '0.75rem' }}>
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{isRecord ? '🏆' : score >= 70 ? '🎉' : '💪'}</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            {isRecord ? 'Nouveau record !' : 'Partie terminée !'}
          </h2>
          <div style={{ fontSize: '4rem', fontWeight: 300, color: '#52B788', fontFamily: "'DM Serif Display', serif", margin: '1.5rem 0' }}>
            {score}<span style={{ fontSize: '1.5rem', color: '#444' }}> pts</span>
          </div>
          <p style={{ color: '#444', fontSize: '0.8rem', marginBottom: '2rem' }}>
            Meilleur score : <span style={{ color: '#52B788' }}>{Math.max(score, bestScore)} pts</span>
          </p>
          <button onClick={startGame} style={{ width: '100%', background: '#52B788', color: '#0A0A0A', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: '0.75rem' }}>
            Rejouer →
          </button>
          <Link href="/dashboard/games" style={{ display: 'block', fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>← Retour aux jeux</Link>
        </div>
      </div>
    )
  }

  // ── Jeu en cours ──
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Link href="/dashboard/games" style={{ fontSize: '0.8rem', color: '#444', textDecoration: 'none' }}>← Jeux</Link>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#52B788' }}>{score} pts</span>
      </div>

      {/* Chronomètre */}
      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#444' }}>Question {current + 1} / {WORDS_PER_GAME}</span>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
          ⏱ {timeLeft}s
        </span>
      </div>
      <div style={{ height: '3px', background: '#1A1A1A', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: '3px', transition: 'width 1s linear, background 0.3s' }} />
      </div>

      {/* Carte question */}
      {currentWord && (
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.65rem', color: '#333', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {user?.learningLanguage}
          </p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: '#F0F0EE', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            {currentWord.term}
          </h2>
          {currentWord.phonetic && (
            <p style={{ color: '#52B788', fontSize: '0.9rem', fontWeight: 300 }}>{currentWord.phonetic}</p>
          )}
        </div>
      )}

      {/* Choix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {choices.map((choice, i) => {
          const isSelected = selected === choice
          const correct = user ? getTranslation(words[current] as unknown as Record<string, string>, user.nativeLanguage) : ''
          const isCorrectChoice = choice === correct
          let bg = '#0E0E0E', border = '#1A1A1A', color = '#CCC'

          if (isSelected && answerState === 'correct') { bg = 'rgba(82,183,136,0.12)'; border = '#52B788'; color = '#52B788' }
          else if (isSelected && answerState === 'wrong') { bg = 'rgba(231,76,60,0.12)'; border = '#E74C3C'; color = '#E74C3C' }
          else if (answerState === 'wrong' && isCorrectChoice) { bg = 'rgba(82,183,136,0.08)'; border = '#52B788'; color = '#52B788' }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(choice)}
              disabled={answerState !== 'none'}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: '12px',
                padding: '1rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                color,
                cursor: answerState !== 'none' ? 'default' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.15s',
                minHeight: '60px',
                lineHeight: '1.3',
              }}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}