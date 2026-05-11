import { computeSm2 } from '@/utils/sm2'

describe('computeSm2', () => {
  describe('première révision (sans historique)', () => {
    it('réponse correcte → easeFactor 2.6, interval 3', () => {
      const result = computeSm2(true)
      // ease: max(1.3, 2.5 + 0.1) = 2.6 | interval: round(1 * 2.6) = 3
      expect(result.newEaseFactor).toBeCloseTo(2.6, 5)
      expect(result.newInterval).toBe(3)
    })

    it('réponse incorrecte → easeFactor 2.3, interval 1', () => {
      const result = computeSm2(false)
      // ease: max(1.3, 2.5 - 0.2) = 2.3 | interval: 1
      expect(result.newEaseFactor).toBeCloseTo(2.3, 5)
      expect(result.newInterval).toBe(1)
    })
  })

  describe('révisions successives correctes', () => {
    it("l'intervalle augmente à chaque bonne réponse", () => {
      const first = computeSm2(true)
      const second = computeSm2(true, { easeFactor: first.newEaseFactor, interval: first.newInterval })
      expect(second.newInterval).toBeGreaterThan(first.newInterval)
    })

    it('le easeFactor augmente après une bonne réponse', () => {
      const result = computeSm2(true, { easeFactor: 2.0, interval: 5 })
      expect(result.newEaseFactor).toBeCloseTo(2.1, 5)
    })
  })

  describe('gestion du easeFactor minimum (plancher 1.3)', () => {
    it('easeFactor ne descend pas sous 1.3 même avec une mauvaise réponse', () => {
      const result = computeSm2(false, { easeFactor: 1.3, interval: 5 })
      expect(result.newEaseFactor).toBeGreaterThanOrEqual(1.3)
    })

    it('easeFactor à 1.4 avec réponse incorrecte → bloqué à 1.3', () => {
      const result = computeSm2(false, { easeFactor: 1.4, interval: 5 })
      expect(result.newEaseFactor).toBeCloseTo(1.3, 5)
    })
  })

  describe('réponse incorrecte après plusieurs bonnes révisions', () => {
    it("remet l'interval à 1", () => {
      const result = computeSm2(false, { easeFactor: 2.8, interval: 20 })
      expect(result.newInterval).toBe(1)
    })
  })

  describe('nextReviewAt', () => {
    it('est dans le futur', () => {
      const before = Date.now()
      const result = computeSm2(true)
      expect(result.nextReviewAt.getTime()).toBeGreaterThan(before)
    })

    it('est à newInterval jours dans le futur (±1 seconde)', () => {
      const result = computeSm2(true, { easeFactor: 2.5, interval: 5 })
      const expected = new Date()
      expected.setDate(expected.getDate() + result.newInterval)
      const diffMs = Math.abs(result.nextReviewAt.getTime() - expected.getTime())
      expect(diffMs).toBeLessThan(1000)
    })
  })
})
