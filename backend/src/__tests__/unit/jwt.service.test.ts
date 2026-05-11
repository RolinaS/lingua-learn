import jwt from 'jsonwebtoken'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from '@/services/jwt.service'

const USER_ID = 'abc-123-uuid'
const EMAIL = 'test@example.com'

describe('jwt.service', () => {
  describe('generateAccessToken', () => {
    it('génère un token contenant le bon payload', () => {
      const token = generateAccessToken(USER_ID, EMAIL)
      const decoded = jwt.decode(token) as { sub: string; email: string }
      expect(decoded.sub).toBe(USER_ID)
      expect(decoded.email).toBe(EMAIL)
    })

    it('produit un token différent du refresh token', () => {
      const access = generateAccessToken(USER_ID, EMAIL)
      const refresh = generateRefreshToken(USER_ID, EMAIL)
      expect(access).not.toBe(refresh)
    })
  })

  describe('verifyAccessToken', () => {
    it('retourne le payload pour un token access valide', () => {
      const token = generateAccessToken(USER_ID, EMAIL)
      const payload = verifyAccessToken(token)
      expect(payload.sub).toBe(USER_ID)
      expect(payload.email).toBe(EMAIL)
    })

    it('lève une erreur si le token est signé avec un mauvais secret', () => {
      const fakeToken = jwt.sign({ sub: USER_ID, email: EMAIL }, 'wrong_secret')
      expect(() => verifyAccessToken(fakeToken)).toThrow()
    })

    it('lève une erreur pour un token malformé', () => {
      expect(() => verifyAccessToken('pas.un.token')).toThrow()
    })

    it('lève une erreur pour un token expiré', () => {
      const expired = jwt.sign(
        { sub: USER_ID, email: EMAIL },
        process.env.JWT_SECRET!,
        { expiresIn: -1 }
      )
      expect(() => verifyAccessToken(expired)).toThrow()
    })
  })

  describe('verifyRefreshToken', () => {
    it('retourne le payload pour un refresh token valide', () => {
      const token = generateRefreshToken(USER_ID, EMAIL)
      const payload = verifyRefreshToken(token)
      expect(payload.sub).toBe(USER_ID)
      expect(payload.email).toBe(EMAIL)
    })

    it('lève une erreur si le token est signé avec le secret access (mauvais secret)', () => {
      const accessToken = generateAccessToken(USER_ID, EMAIL)
      expect(() => verifyRefreshToken(accessToken)).toThrow()
    })
  })

  describe('getRefreshTokenExpiry', () => {
    it('retourne une date dans le futur', () => {
      const expiry = getRefreshTokenExpiry()
      expect(expiry.getTime()).toBeGreaterThan(Date.now())
    })

    it('retourne une date à environ 7 jours dans le futur', () => {
      const now = new Date()
      const expiry = getRefreshTokenExpiry()
      const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      expect(diffDays).toBeCloseTo(7, 0)
    })
  })
})
