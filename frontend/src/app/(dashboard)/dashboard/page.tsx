'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { wordApi, progressApi } from '@/lib/api'
import { getTranslation } from '@/lib/utils'
import { Word } from '@/types'

type CardState = 'question' | 'answer' | 'done'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [words, setWords]       = useState<Word[]>([])
  const [current, setCurrent]   = useState(0)
  const [cardState, setCardState] = useState<CardState>('question')
  const [score, setScore]       = useState({ correct: 0, incorrect: 0 })
  const [isLoading, setIsLoading] = useState(true)

  const loadWords = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const { data } = await wordApi.getAll({ language: user.learningLanguage, limit: 10 })
      setWords(data.data.words)
      setCurrent(0)
      setCardState('question')
      setScore({ correct: 0, incorrect: 0 })
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => { loadWords() }, [loadWords])

  const currentWord = words[current]
  const isFinished  = current >= words.length && words.length > 0
  const progress    = words.length > 0 ? (current / words.length) * 100 : 0

  const handleAnswer = async (correct: boolean) => {
    if (!currentWord) return
    await progressApi.update({ wordId: currentWord.id, correct }).catch(() => {})
    setScore((s) => ({
      correct:   correct ? s.correct + 1 : s.correct,
      incorrect: correct ? s.incorrect : s.incorrect + 1,
    }))
    setCurrent((c) => c + 1)
    setCardState('question')
  }

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

  if (isFinished) {
    const total   = score.correct + score.incorrect
    const percent = total > 0 ? Math.round((score.correct / total) * 100) : 0

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1.5rem' }}>
        <div style={{
          background: '#0E0E0E',
          border: '1px solid #1A1A1A',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          maxWidth: '380px',
          width: '100%',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
            {percent >= 70 ? '🎉' : '💪'}
          </div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '1.75rem',
            color: '#F0F0EE',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}>
            Session terminée
          </h2>
          <p style={{ color: '#444', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Voici votre résultat
          </p>

          <div style={{
            fontSize: '4rem',
            fontWeight: 300,
            color: '#52B788',
            fontFamily: "'DM Serif Display', serif",
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
          }}>
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

          <button
            onClick={loadWords}
            style={{
              width: '100%',
              background: '#52B788',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '10px',
              padding: '0.875rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Nouvelle session →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: '640px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '1.75rem',
            color: '#F0F0EE',
            letterSpacing: '-0.02em',
            marginBottom: '0.25rem',
          }}>
            Apprendre
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#444' }}>
            {current + 1} / {words.length} mots
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span style={{
            background: 'rgba(82,183,136,0.08)',
            border: '1px solid rgba(82,183,136,0.15)',
            color: '#52B788',
            padding: '0.375rem 0.875rem',
            borderRadius: '100px',
            fontSize: '0.8rem',
            fontWeight: 500,
          }}>
            ✓ {score.correct}
          </span>
          <span style={{
            background: 'rgba(231,76,60,0.08)',
            border: '1px solid rgba(231,76,60,0.15)',
            color: '#E74C3C',
            padding: '0.375rem 0.875rem',
            borderRadius: '100px',
            fontSize: '0.8rem',
            fontWeight: 500,
          }}>
            ✗ {score.incorrect}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '2px',
        background: '#1A1A1A',
        borderRadius: '2px',
        marginBottom: '2.5rem',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: '#52B788',
          borderRadius: '2px',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {currentWord && (
        <div style={{
          background: '#0E0E0E',
          border: '1px solid #1A1A1A',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          textAlign: 'center',
        }}>

          {/* Catégorie */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            background: '#161616',
            border: '1px solid #1E1E1E',
            color: '#555',
            padding: '0.375rem 0.875rem',
            borderRadius: '100px',
            fontSize: '0.75rem',
            marginBottom: '2rem',
          }}>
            {currentWord.category?.emoji} {currentWord.category?.nameFr}
          </span>

          {/* Langue apprise */}
          <p style={{
            fontSize: '0.65rem',
            color: '#333',
            letterSpacing: '0.1em',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            {user?.learningLanguage}
          </p>

          {/* Mot */}
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            color: '#F0F0EE',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '0.75rem',
          }}>
            {currentWord.term}
          </h2>

          {currentWord.phonetic && (
            <p style={{ color: '#52B788', fontSize: '1rem', marginBottom: '2rem', fontWeight: 300 }}>
              {currentWord.phonetic}
            </p>
          )}

          {/* Réponse révélée */}
          {cardState === 'answer' && (
            <div style={{
              borderTop: '1px solid #1A1A1A',
              paddingTop: '2rem',
              marginTop: '1rem',
            }}>
              <p style={{
                fontSize: '0.65rem',
                color: '#333',
                letterSpacing: '0.1em',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}>
                {user?.nativeLanguage}
              </p>
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '2rem',
                color: '#52B788',
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}>
                {user ? getTranslation(currentWord as unknown as Record<string, string>, user.nativeLanguage) : ''}
              </p>
              {currentWord.exampleEn && (
                <p style={{
                  fontSize: '0.875rem',
                  color: '#333',
                  fontStyle: 'italic',
                  marginBottom: '2rem',
                }}>
                  &quot;{currentWord.exampleEn}&quot;
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ marginTop: '2rem' }}>
            {cardState === 'question' ? (
              <button
                onClick={() => setCardState('answer')}
                style={{
                  background: '#52B788',
                  color: '#0A0A0A',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '0.75rem 2rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Voir la traduction
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => handleAnswer(false)}
                  style={{
                    flex: 1,
                    maxWidth: '180px',
                    background: 'transparent',
                    color: '#E74C3C',
                    border: '1px solid rgba(231,76,60,0.3)',
                    borderRadius: '100px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  ✗ Je ne savais pas
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  style={{
                    flex: 1,
                    maxWidth: '180px',
                    background: '#52B788',
                    color: '#0A0A0A',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
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