import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ── Standalone output pour Docker production ──
  // Génère un serveur Node.js autonome dans .next/standalone
  // sans avoir besoin de node_modules complets
  output: 'standalone',

  // ── Sécurité : headers HTTP ───────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },

  // ── Variables d'environnement exposées au client ──
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'LinguaLearn',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
  },
}

export default nextConfig
