import bcrypt from 'bcryptjs'
import { prisma } from '@/config/database'
import { RegisterDto, LoginDto } from '@/types'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from '@/services/jwt.service'
import { AppError } from '@/middlewares/error.middleware'

// ─────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────

export const register = async (dto: RegisterDto) => {
  // Vérification email unique
  const existingEmail = await prisma.user.findUnique({ where: { email: dto.email } })
  if (existingEmail) throw new AppError('Cet email est déjà utilisé.', 409)

  // Vérification username unique
  const existingUsername = await prisma.user.findUnique({ where: { username: dto.username } })
  if (existingUsername) throw new AppError('Ce nom d\'utilisateur est déjà pris.', 409)

  // Hash du mot de passe
  const passwordHash = await bcrypt.hash(dto.password, 12)

  // Création de l'utilisateur
  const user = await prisma.user.create({
    data: {
      email:            dto.email,
      username:         dto.username,
      passwordHash,
      nativeLanguage:   dto.nativeLanguage,
      learningLanguage: dto.learningLanguage,
    },
    select: {
      id:               true,
      email:            true,
      username:         true,
      nativeLanguage:   true,
      learningLanguage: true,
      theme:            true,
      createdAt:        true,
    },
  })

  // Génération des tokens
  const accessToken  = generateAccessToken(user.id, user.email)
  const refreshToken = generateRefreshToken(user.id, user.email)

  // Sauvegarde du refresh token en base
  await prisma.refreshToken.create({
    data: {
      token:     refreshToken,
      userId:    user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  })

  return { user, accessToken, refreshToken }
}

// ─────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────

export const login = async (dto: LoginDto) => {
  const user = await prisma.user.findUnique({ where: { email: dto.email } })
  if (!user) throw new AppError('Email ou mot de passe incorrect.', 401)

  const isValid = await bcrypt.compare(dto.password, user.passwordHash)
  if (!isValid) throw new AppError('Email ou mot de passe incorrect.', 401)

  // Mise à jour last_login_at
  await prisma.user.update({
    where: { id: user.id },
    data:  { lastLoginAt: new Date() },
  })

  const accessToken  = generateAccessToken(user.id, user.email)
  const refreshToken = generateRefreshToken(user.id, user.email)

  await prisma.refreshToken.create({
    data: {
      token:     refreshToken,
      userId:    user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  })

  const { passwordHash: _, ...userWithoutPassword } = user
  return { user: userWithoutPassword, accessToken, refreshToken }
}

// ─────────────────────────────────────────────
// Refresh token
// ─────────────────────────────────────────────

export const refresh = async (token: string) => {
  // Vérification signature JWT
  const payload = verifyRefreshToken(token)

  // Vérification en base (rotation des tokens)
  const stored = await prisma.refreshToken.findUnique({ where: { token } })
  if (!stored) throw new AppError('Token invalide ou révoqué.', 401)
  if (stored.expiresAt < new Date()) throw new AppError('Token expiré.', 401)

  // Suppression de l'ancien token (rotation)
  await prisma.refreshToken.delete({ where: { token } })

  // Nouveaux tokens
  const accessToken     = generateAccessToken(payload.sub, payload.email)
  const newRefreshToken = generateRefreshToken(payload.sub, payload.email)

  await prisma.refreshToken.create({
    data: {
      token:     newRefreshToken,
      userId:    payload.sub,
      expiresAt: getRefreshTokenExpiry(),
    },
  })

  return { accessToken, refreshToken: newRefreshToken }
}

// ─────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────

export const logout = async (token: string) => {
  await prisma.refreshToken.deleteMany({ where: { token } })
}