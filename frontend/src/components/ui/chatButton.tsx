'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useChatStore, SCENARIOS, Scenario } from '@/store/chat.store'
import { useAuthStore } from '@/store/auth.store'

// ─────────────────────────────────────────────
// Mapping langue → code BCP-47 pour Web Speech API
// ─────────────────────────────────────────────

const LANG_TO_BCP47: Record<string, string> = {
  FR: 'fr-FR',
  EN: 'en-US',
  ES: 'es-ES',
  RU: 'ru-RU',
  AR: 'ar-SA',
}

// ─────────────────────────────────────────────
// Hook : synthèse vocale (TTS)
// ─────────────────────────────────────────────

function useTTS(langCode: string) {
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = LANG_TO_BCP47[langCode] ?? 'fr-FR'
    utt.rate = 0.9
    window.speechSynthesis.speak(utt)
  }, [langCode])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, stop }
}

// ─────────────────────────────────────────────
// Hook : reconnaissance vocale (STT)
// ─────────────────────────────────────────────

function useSTT(langCode: string, onResult: (text: string) => void) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [isListening, setIsListening] = useState(false)

  const getSR = () => {
    const SR = (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      ?? (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition
    return SR ?? null
  }

  const start = useCallback(() => {
    const SR = getSR()
    if (!SR) { alert('Reconnaissance vocale non supportée sur ce navigateur.'); return }
    const rec = new SR()
    rec.lang = LANG_TO_BCP47[langCode] ?? 'fr-FR'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript ?? ''
      if (transcript) onResult(transcript)
    }
    rec.onend = () => setIsListening(false)
    rec.onerror = () => setIsListening(false)
    rec.start()
    recognitionRef.current = rec
    setIsListening(true)
  }, [langCode, onResult])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  return { isListening, start, stop }
}

// ─────────────────────────────────────────────
// Panel de chat
// ─────────────────────────────────────────────

function ChatPanel() {
  const { messages, isLoading, error, activeScenario, sendMessage, resetChat, closeChat } = useChatStore()
  const user = useAuthStore((s) => s.user)
  const [input, setInput] = useState('')
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [holdActive, setHoldActive] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const learningLang = user?.learningLanguage ?? 'FR'
  const { speak, stop: stopTTS } = useTTS(learningLang)

  const handleVoiceResult = useCallback((text: string) => {
    setInput(text)
  }, [])

  const { isListening, start: startSTT, stop: stopSTT } = useSTT(learningLang, handleVoiceResult)

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Auto-focus
  useEffect(() => {
    inputRef.current?.focus()
  }, [activeScenario])

  // Auto-lecture de la dernière réponse IA
  useEffect(() => {
    if (!autoSpeak) return
    const last = messages[messages.length - 1]
    if (last?.role === 'assistant') speak(last.content)
  }, [messages, autoSpeak, speak])

  // Nettoyage TTS à la fermeture
  useEffect(() => () => stopTTS(), [stopTTS])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading || !user) return
    setInput('')
    stopTTS()
    await sendMessage(trimmed, user.learningLanguage, user.nativeLanguage)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // Appui maintenu : démarrage après 200ms pour éviter les clics accidentels
  const handleMicMouseDown = () => {
    holdTimerRef.current = setTimeout(() => {
      setHoldActive(true)
      startSTT()
    }, 200)
  }

  const handleMicMouseUp = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    if (holdActive) {
      stopSTT()
      setHoldActive(false)
    }
  }

  // Clic simple : toggle écoute
  const handleMicClick = () => {
    if (holdActive) return
    if (isListening) stopSTT()
    else startSTT()
  }

  const micColor = isListening ? '#E74C3C' : holdActive ? '#E74C3C' : '#52B788'

  return (
    <div style={{
      position: 'fixed', bottom: '5rem', right: '2rem',
      width: '420px', maxHeight: '580px',
      background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 24px 64px rgba(0,0,0,0.6)', zIndex: 9999,
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: '0.875rem 1.25rem', borderBottom: '1px solid #1A1A1A',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{ fontSize: '1.25rem' }}>{activeScenario?.emoji}</span>
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#F0F0EE', margin: 0 }}>
              {activeScenario?.label}
            </p>
            <p style={{ fontSize: '0.7rem', color: '#444', margin: 0 }}>
              <code style={{ color: '#52B788' }}>/aide</code> pour aide en français
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Toggle auto-lecture */}
          <button
            onClick={() => setAutoSpeak(p => !p)}
            title={autoSpeak ? 'Désactiver la lecture auto' : 'Activer la lecture auto'}
            style={{
              background: autoSpeak ? '#52B78820' : 'transparent',
              border: `1px solid ${autoSpeak ? '#52B788' : '#1A1A1A'}`,
              borderRadius: '8px', color: autoSpeak ? '#52B788' : '#444',
              padding: '0.375rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem',
            }}
          >
            {autoSpeak ? '🔊' : '🔇'}
          </button>
          <button onClick={resetChat} title="Recommencer" style={{
            background: 'transparent', border: '1px solid #1A1A1A', borderRadius: '8px',
            color: '#666', padding: '0.375rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem',
          }}>↺</button>
          <button onClick={() => { stopTTS(); closeChat() }} title="Fermer" style={{
            background: 'transparent', border: '1px solid #1A1A1A', borderRadius: '8px',
            color: '#666', padding: '0.375rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem',
          }}>✕</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '1rem 1.25rem',
        display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: '#333', fontSize: '0.875rem' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>{activeScenario?.emoji}</p>
            <p style={{ margin: '0 0 0.375rem', color: '#555' }}>{activeScenario?.description}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#333' }}>
              Écrivez ou appuyez sur 🎤 pour parler
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '0.375rem', alignItems: 'flex-end' }}>
            {/* Bouton réécouter (messages IA) */}
            {msg.role === 'assistant' && (
              <button
                onClick={() => speak(msg.content)}
                title="Réécouter"
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '0.75rem', color: '#444', padding: '0.25rem', flexShrink: 0,
                }}
              >🔊</button>
            )}
            <div style={{
              maxWidth: '80%', padding: '0.625rem 0.875rem',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: msg.role === 'user' ? '#52B788' : '#161616',
              border: msg.role === 'assistant' ? '1px solid #1E1E1E' : 'none',
              color: msg.role === 'user' ? '#0A0A0A' : '#D0D0CE',
              fontSize: '0.875rem', lineHeight: 1.55, whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isListening && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              padding: '0.5rem 0.875rem', borderRadius: '14px 14px 4px 14px',
              background: '#1A0A0A', border: '1px solid #E74C3C40',
              color: '#E74C3C', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#E74C3C', animation: 'pulse 1s infinite' }} />
              Écoute en cours...
            </div>
          </div>
        )}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '0.625rem 0.875rem', borderRadius: '14px 14px 14px 4px',
              background: '#161616', border: '1px solid #1E1E1E', color: '#444', fontSize: '0.875rem',
            }}>
              <span style={{ letterSpacing: '0.15em' }}>···</span>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '0.625rem', borderRadius: '10px',
            background: '#1A0D0D', border: '1px solid #3A1A1A', color: '#E74C3C', fontSize: '0.8rem',
          }}>{error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '0.875rem 1.25rem', borderTop: '1px solid #1A1A1A',
        display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center',
      }}>
        {/* Bouton micro (clic = toggle, appui maintenu = push-to-talk) */}
        <button
          onClick={handleMicClick}
          onMouseDown={handleMicMouseDown}
          onMouseUp={handleMicMouseUp}
          onMouseLeave={handleMicMouseUp}
          onTouchStart={handleMicMouseDown}
          onTouchEnd={handleMicMouseUp}
          title="Clic : démarrer/arrêter · Maintenir : parler"
          style={{
            background: isListening ? '#E74C3C20' : '#111',
            border: `1px solid ${micColor}`,
            borderRadius: '10px', padding: '0.625rem 0.75rem',
            color: micColor, cursor: 'pointer', fontSize: '1rem',
            flexShrink: 0, transition: 'all 0.15s',
            boxShadow: isListening ? `0 0 8px ${micColor}40` : 'none',
          }}
        >
          🎤
        </button>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Parlez maintenant...' : 'Écrivez ou utilisez le micro...'}
          disabled={isLoading}
          suppressHydrationWarning
          style={{
            flex: 1, background: '#111', border: '1px solid #1E1E1E', borderRadius: '10px',
            padding: '0.625rem 0.875rem', color: '#F0F0EE', fontSize: '0.875rem',
            fontFamily: "'DM Sans', sans-serif", outline: 'none',
          }}
        />

        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{
            background: input.trim() && !isLoading ? '#52B788' : '#1A1A1A',
            border: 'none', borderRadius: '10px', padding: '0.625rem 1rem',
            color: input.trim() && !isLoading ? '#0A0A0A' : '#333',
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            fontSize: '1rem', transition: 'all 0.2s', flexShrink: 0,
          }}
        >→</button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────
// Sélecteur de scénario
// ─────────────────────────────────────────────

function ScenarioSelector({ onSelect }: { onSelect: (s: Scenario) => void }) {
  const DIFFICULTY_COLORS: Record<string, string> = {
    'Débutant': '#52B788',
    'Intermédiaire': '#74A9E8',
    'Avancé': '#E8A074',
  }

  return (
    <div style={{
      position: 'fixed', bottom: '5rem', right: '2rem', width: '340px',
      background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: '20px',
      padding: '1.25rem', boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      zIndex: 9999, fontFamily: "'DM Sans', sans-serif",
    }}>
      <p style={{ fontSize: '0.75rem', color: '#444', margin: '0 0 0.875rem', letterSpacing: '0.05em' }}>
        CHOISIR UN SCÉNARIO
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            style={{
              background: '#111', border: '1px solid #1E1E1E', borderRadius: '12px',
              padding: '0.625rem 0.875rem', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '0.625rem', textAlign: 'left',
              transition: 'border-color 0.2s', width: '100%',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#52B788')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1E1E1E')}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{scenario.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#F0F0EE' }}>
                  {scenario.label}
                </span>
                <span style={{
                  fontSize: '0.6rem', color: DIFFICULTY_COLORS[scenario.difficulty],
                  border: `1px solid ${DIFFICULTY_COLORS[scenario.difficulty]}40`,
                  borderRadius: '4px', padding: '0.1rem 0.35rem',
                }}>{scenario.difficulty}</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#444', margin: 0 }}>{scenario.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Bouton flottant + Portal
// ─────────────────────────────────────────────

export default function ChatButton() {
  const { isOpen, activeScenario, openChat, closeChat } = useChatStore()
  const [showSelector, setShowSelector] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleToggle = () => {
    if (isOpen) { closeChat(); setShowSelector(false) }
    else setShowSelector((prev) => !prev)
  }

  const handleSelectScenario = (scenario: Scenario) => {
    setShowSelector(false)
    openChat(scenario)
  }

  if (!mounted) return null

  return createPortal(
    <>
      <button
        onClick={handleToggle}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          background: isOpen || showSelector ? '#1A1A1A' : '#52B788',
          border: isOpen || showSelector ? '1px solid #2A2A2A' : 'none',
          borderRadius: '50px', padding: '0.75rem 1.25rem',
          color: isOpen || showSelector ? '#F0F0EE' : '#0A0A0A',
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)', transition: 'all 0.2s', zIndex: 9999,
        }}
      >
        {isOpen ? <>✕ Fermer</> : showSelector ? <>✕ Annuler</> : <>💬 Pratiquer</>}
      </button>

      {showSelector && !isOpen && <ScenarioSelector onSelect={handleSelectScenario} />}
      {isOpen && activeScenario && <ChatPanel />}
    </>,
    document.body
  )
}