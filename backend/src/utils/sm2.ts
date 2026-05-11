export interface Sm2State {
  easeFactor?: number | null
  interval?: number | null
}

export interface Sm2Result {
  newEaseFactor: number
  newInterval: number
  nextReviewAt: Date
}

export function computeSm2(correct: boolean, existing?: Sm2State | null): Sm2Result {
  const easeFactor = existing?.easeFactor ?? 2.5
  const currentInterval = existing?.interval ?? 1

  const newEaseFactor = correct
    ? Math.max(1.3, easeFactor + 0.1)
    : Math.max(1.3, easeFactor - 0.2)

  const newInterval = correct
    ? Math.round(currentInterval * newEaseFactor)
    : 1

  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval)

  return { newEaseFactor, newInterval, nextReviewAt }
}
