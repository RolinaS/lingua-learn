import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { LanguageCode, Theme } from '@/types'

// ─────────────────────────────────────────────
// Fusion classes Tailwind (shadcn/ui pattern)
// ─────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─────────────────────────────────────────────
// Langues
// ─────────────────────────────────────────────

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  FR: '🇫🇷 Français',
  EN: '🇬🇧 Anglais',
  AR: '🇸🇦 Arabe',
  ES: '🇪🇸 Espagnol',
  RU: '🇷🇺 Russe',
}

export const LANGUAGE_CODES = Object.keys(LANGUAGE_LABELS) as LanguageCode[]

// ─────────────────────────────────────────────
// Thèmes
// ─────────────────────────────────────────────

export const THEME_LABELS: Record<Theme, string> = {
  LIGHT: '☀️ Clair',
  DARK:  '🌙 Sombre',
  OCEAN: '🌊 Bleu océan',
}

export const THEME_CLASSES: Record<Theme, string> = {
  LIGHT: 'theme-light',
  DARK:  'theme-dark',
  OCEAN: 'theme-ocean',
}

// ─────────────────────────────────────────────
// Formatage
// ─────────────────────────────────────────────

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date(date))
}

export const formatDuration = (secs: number): string => {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

// ─────────────────────────────────────────────
// Traduction selon langue native
// ─────────────────────────────────────────────

export const getTranslation = (
  word: Record<string, string>,
  lang: LanguageCode
): string => {
  const map: Record<LanguageCode, string> = {
    FR: word.translationFr,
    EN: word.translationEn,
    AR: word.translationAr,
    ES: word.translationEs,
    RU: word.translationRu,
  }
  return map[lang] ?? word.translationEn
}