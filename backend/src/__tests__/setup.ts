// Variables d'environnement injectées avant tout chargement de module
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.JWT_SECRET = 'test_jwt_secret_suffisamment_long_pour_hs256!!'
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_suffisamment_long_pour_hs256!!'
process.env.JWT_EXPIRES_IN = '15m'
process.env.JWT_REFRESH_EXPIRES_IN = '7d'
process.env.CORS_ORIGIN = 'http://localhost:3000'
process.env.PORT = '5001'
