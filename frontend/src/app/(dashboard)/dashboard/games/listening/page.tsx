'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { wordApi } from '@/lib/api'
import { getTranslation } from '@/lib/utils'
import { Word, LanguageCode } from '@/types'

const TIME_LIMIT = 90
const WORDS_PER_GAME = 8
const ACCENT = '#EC4899'
const ACCENT_BG = 'rgba(236,72,153,0.08)'
const ACCENT_BORDER = 'rgba(236,72,153,0.2)'

const TTS_LANG: Record<LanguageCode, string> = {
  FR: 'fr-FR',
  EN: 'en-US',
  AR: 'ar-SA',
  ES: 'es-ES',
  RU: 'ru-RU',
}

// Hauteurs relatives pour les barres de l'onde sonore (9 barres)
const WAVE_HEIGHTS = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 1, 0.65, 0.4]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type GameState = 'ready' | 'playing' | 'finished'
type AnswerState = 'none' | 'correct' | 'wrong'

export default function ListeningPage() {
  const user = useAuthStore((s) => s.user)

  const [gameState, setGameState]     = useState<GameState>('ready')
  const [words, setWords]             = useState<Word[]>([])
  const [current, setCurrent]         = useState(0)
  const [choices, setChoices]         = useState<string[]>([])
  const [selected, setSelected]       = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('none')
  const [score, setScore]             = useState(0)
  const [timeLeft, setTimeLeft]       = useState(TIME_LIMIT)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [waveFrame, setWaveFrame]     = useState(0)
  const [bestScore, setBestScore]     = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    return parseInt(localStorage.getItem(`listening-best-${user?.learningLanguage}`) ?? '0')
  })

  // Évite de déclencher la lecture à chaque render
  const hasPlayedRef = useRef(false)

  const speakWord = useCallback((term: string) => {
    if (!user || typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(term)
    utt.lang = TTS_LANG[user.learningLanguage] ?? 'en-US'
    utt.rate = 0.85
    utt.onstart = () => setIsPlaying(true)
    utt.onend   = () => setIsPlaying(false)
    utt.onerror = () => setIsPlaying(false)
    window.speechSynthesis.speak(utt)
  }, [user])

  const generateChoices = useCallback((word: Word, allWords: Word[]) => {
    if (!user) return []
    const correct = getTranslation(word as unknown as Record<string, string>, user.nativeLanguage)
    const others = allWords
      .filter(w => w.id !== word.id)
      .map(w => getTranslation(w as unknown as Record<string, string>, user.nativeLanguage))
      .filter(t => t !== correct)
    return shuffle([correct, ...shuffle(others).slice(0, 3)])
  }, [user])

  const loadWords = useCallback(async () => {
    if (!user) return undefined
    const { data } = await wordApi.getAll({ language: user.learningLanguage, limit: 50 })
    const all: Word[] = data.data.words
    return shuffle(all).slice(0, WORDS_PER_GAME + 10)
  }, [user])

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
    hasPlayedRef.current = false
    setTimeout(() => speakWord(gameWords[0].term), 400)
  }

  // Animation onde sonore
  useEffect(() => {
    if (!isPlaying) return
    const t = setInterval(() => setWaveFrame(f => (f + 1) % 6), 150)
    return () => clearInterval(t)
  }, [isPlaying])

  // Chronomètre
  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) { setGameState('finished'); return }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000)
    return () => clearTimeout(t)
  }, [gameState, timeLeft])

  // Arrêter le TTS et sauvegarder le score en fin de partie
  useEffect(() => {
    if (gameState !== 'finished') return
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
    const key = `listening-best-${user?.learningLanguage}`
    const prev = parseInt(localStorage.getItem(key) ?? '0')
    if (score > prev) {
      localStorage.setItem(key, score.toString())
      setBestScore(score)
    }
  }, [gameState]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (choice: string) => {
    if (answerState !== 'none' || !user) return
    const gameWords = words.slice(0, WORDS_PER_GAME)
    const correct = getTranslation(gameWords[current] as unknown as Record<string, string>, user.nativeLanguage)
    const isCorrect = choice === correct

    setSelected(choice)
    setAnswerState(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 15)

    setTimeout(() => {
      const next = current + 1
      if (next >= WORDS_PER_GAME) {
        setGameState('finished')
      } else {
        setCurrent(next)
        setChoices(generateChoices(gameWords[next], words))
        setSelected(null)
        setAnswerState('none')
        setTimeout(() => speakWord(gameWords[next].term), 200)
      }
    }, 900)
  }

  const currentWord = words.slice(0, WORDS_PER_GAME)[current]
  const timerPct   = (timeLeft / TIME_LIMIT) * 100
  const timerColor = timeLeft > 30 ? ACCENT : timeLeft > 15 ? '#E67E22' : '#E74C3C'

  // ── Écran d'accueil ──────────────────────────────────────────────────────────
  if (gameState === 'ready') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{ background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎧</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Écoute
          </h1>
          <p style={{ color: '#444', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
            {WORDS_PER_GAME} mots · {TIME_LIMIT} secondes<br />
            Écoutez et choisissez la bonne traduction
          </p>
          <p style={{ color: '#333', fontSize: '0.78rem', marginBottom: '1.5rem' }}>
            🔊 Activez le son de votre appareil avant de commencer
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
            {isRecord ? '🏆' : score >= 75 ? '🎉' : '💪'}
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

      {/* Carte audio */}
      {currentWord && (
        <div style={{
          background: '#0E0E0E',
          border: `1px solid ${isPlaying ? ACCENT_BORDER : '#1A1A1A'}`,
          borderRadius: '20px',
          padding: '2.5rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          transition: 'border-color 0.3s',
        }}>
          <p style={{ fontSize: '0.65rem', color: '#333', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            {user?.learningLanguage} — écoutez et trouvez la traduction
          </p>

          {/* Visualisation onde sonore */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', height: '52px', marginBottom: '1.5rem' }}>
            {WAVE_HEIGHTS.map((h, i) => {
              const animated = isPlaying ? WAVE_HEIGHTS[(i + waveFrame) % WAVE_HEIGHTS.length] : h * 0.3
              return (
                <div
                  key={i}
                  style={{
                    width: '5px',
                    height: `${animated * 52}px`,
                    background: isPlaying ? ACCENT : '#2A2A2A',
                    borderRadius: '3px',
                    transition: isPlaying ? 'height 0.15s ease, background 0.3s' : 'height 0.5s ease, background 0.3s',
                  }}
                />
              )
            })}
          </div>

          {/* Bouton réécouter */}
          <button
            onClick={() => currentWord && speakWord(currentWord.term)}
            disabled={isPlaying || answerState !== 'none'}
            style={{
              background: 'none',
              border: `1px solid ${isPlaying ? '#2A2A2A' : ACCENT_BORDER}`,
              borderRadius: '100px',
              padding: '0.5rem 1.5rem',
              color: isPlaying ? '#333' : ACCENT,
              fontSize: '0.82rem',
              cursor: isPlaying || answerState !== 'none' ? 'default' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {isPlaying ? '🔊 Lecture en cours…' : '🔁 Réécouter'}
          </button>
        </div>
      )}

      {/* Choix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {choices.map((choice, i) => {
          const isSelected = selected === choice
          const correct = user ? getTranslation(words[current] as unknown as Record<string, string>, user.nativeLanguage) : ''
          const isCorrectChoice = choice === correct
          let bg = '#0E0E0E', border = '#1A1A1A', color = '#CCC'

          if (isSelected && answerState === 'correct')  { bg = 'rgba(82,183,136,0.12)'; border = '#52B788'; color = '#52B788' }
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
