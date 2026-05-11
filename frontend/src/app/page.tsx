'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import HomeNavbar from '@/components/ui/HomeNavbar'

export default function HomePage() {
  const isAuth = useAuthStore((s) => s.isAuth)

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0A0A0A', color: '#F0F0EE', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-link { color: #888; text-decoration: none; font-size: 0.875rem; font-weight: 400; transition: color 0.2s; }
        .nav-link:hover { color: #F0F0EE; }
        .btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; background: #52B788; color: #0A0A0A; padding: 0.625rem 1.375rem; border-radius: 100px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { background: #74C69D; transform: translateY(-1px); }
        .btn-ghost { display: inline-flex; align-items: center; gap: 0.5rem; background: transparent; color: #F0F0EE; padding: 0.625rem 1.375rem; border-radius: 100px; font-size: 0.875rem; text-decoration: none; transition: all 0.2s; border: 1px solid #222; cursor: pointer; }
        .btn-ghost:hover { background: #141414; border-color: #333; }
        .bento-card { background: #111; border: 1px solid #1A1A1A; border-radius: 20px; padding: 2rem; transition: border-color 0.3s; }
        .bento-card:hover { border-color: #2A2A2A; }
        .badge { display: inline-flex; align-items: center; gap: 0.375rem; background: #111; border: 1px solid #1E3A2E; color: #52B788; padding: 0.375rem 0.875rem; border-radius: 100px; font-size: 0.75rem; font-weight: 500; }
        .gradient-text { background: linear-gradient(135deg, #52B788 0%, #95D5B2 60%, #B7E4C7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up   { animation: fadeUp 0.7s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.7s 0.45s ease forwards; opacity: 0; }
        .glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(82,183,136,0.06) 0%, transparent 70%); pointer-events: none; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #141414', backgroundColor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📖</span>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#F0F0EE' }}>
              Lingua<span style={{ color: '#52B788' }}>Learn</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#fonctionnalites" className="nav-link">Fonctionnalités</a>
            <a href="#langues"         className="nav-link">Langues</a>
            <a href="#comment"         className="nav-link">Comment ça marche</a>
          </div>
          {/* ← Navbar dynamique connecté / déconnecté */}
          <HomeNavbar />
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', maxWidth: '1100px', margin: '0 auto', padding: '7rem 1.5rem 5rem', textAlign: 'center' }}>
        <div className="glow" style={{ top: '-200px', left: '50%', transform: 'translateX(-50%)' }} />
        <div className="fade-up"><span className="badge">✦ Apprentissage adaptatif · Spaced Repetition</span></div>
        <h1 className="fade-up-2" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: '1.05', letterSpacing: '-0.03em', marginTop: '1.75rem', marginBottom: '1.5rem', color: '#F0F0EE' }}>
          Apprenez une langue,<br /><span className="gradient-text">mot par mot.</span>
        </h1>
        <p className="fade-up-3" style={{ fontSize: '1.125rem', color: '#666', lineHeight: '1.7', maxWidth: '520px', margin: '0 auto 2.5rem', fontWeight: 300 }}>
          Comparez les mots de votre langue maternelle avec la langue que vous apprenez. Un système de révision intelligent qui s&apos;adapte à votre rythme.
        </p>
        <div className="fade-up-4" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isAuth ? (
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}>
              Continuer à apprendre →
            </Link>
          ) : (
            <>
              <Link href="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}>Créer mon espace gratuit</Link>
              <Link href="/login"    className="btn-ghost"   style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}>Se connecter</Link>
            </>
          )}
        </div>
        <p style={{ marginTop: '2.5rem', fontSize: '0.8rem', color: '#444', letterSpacing: '0.03em' }}>
          Français · English · العربية · Español · Русский
        </p>
      </section>

      {/* ── BENTO GRID ── */}
      <section id="fonctionnalites" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem' }}>
          <div className="bento-card" style={{ gridColumn: 'span 7', background: 'linear-gradient(135deg, #111 60%, #0D1F15)', position: 'relative', overflow: 'hidden', minHeight: '280px' }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(82,183,136,0.12) 0%, transparent 70%)' }} />
            <span style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>Révision espacée</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.875rem', lineHeight: '1.2', marginTop: '0.75rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Mémorisez durablement avec l&apos;algorithme SM-2
            </h3>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '340px' }}>
              Notre système identifie les mots que vous maîtrisez et ceux qui nécessitent plus d&apos;attention, optimisant chaque session.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              {['Débutant', 'Intermédiaire', 'Avancé'].map((l) => (
                <span key={l} style={{ background: '#1A1A1A', border: '1px solid #222', color: '#666', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem' }}>{l}</span>
              ))}
            </div>
          </div>

          <div className="bento-card" id="langues" style={{ gridColumn: 'span 5', minHeight: '280px' }}>
            <span style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>5 Langues</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginTop: '0.75rem', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Votre langue,<br />votre choix</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['🇫🇷','Français'],['🇬🇧','English'],['🇸🇦','العربية'],['🇪🇸','Español'],['🇷🇺','Русский']].map(([f,n]) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', background: '#161616', borderRadius: '10px', border: '1px solid #1E1E1E' }}>
                  <span>{f}</span><span style={{ fontSize: '0.875rem', color: '#CCC' }}>{n}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card" style={{ gridColumn: 'span 4' }}>
            <span style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>Comparaison</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.375rem', marginTop: '0.75rem', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Votre langue natale,<br />en miroir</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[['Bonjour','Hello','/həˈloʊ/'],['Merci','Thank you','/θæŋk juː/'],['Chat','Cat','/kæt/']].map(([fr,en,ph]) => (
                <div key={fr} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#161616', borderRadius: '10px', border: '1px solid #1E1E1E' }}>
                  <span style={{ color: '#888', fontSize: '0.875rem' }}>{fr}</span>
                  <span style={{ color: '#333', fontSize: '0.75rem' }}>→</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', color: '#F0F0EE' }}>{en}</div>
                    <div style={{ fontSize: '0.7rem', color: '#52B788' }}>{ph}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card" style={{ gridColumn: 'span 4' }}>
            <span style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>Vocabulaire</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.375rem', marginTop: '0.75rem', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>18 catégories<br />thématiques</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {[['👋','Salutations'],['👨‍👩‍👧','Famille'],['🍎','Nourriture'],['🚗','Transports'],['🏠','Maison'],['😊','Émotions'],['🌿','Nature'],['🏥','Santé']].map(([e,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: '#161616', borderRadius: '8px', border: '1px solid #1E1E1E', fontSize: '0.8rem', color: '#888' }}>
                  <span>{e}</span><span>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card" style={{ gridColumn: 'span 4', background: 'linear-gradient(135deg, #0D1F15, #111)' }}>
            <span style={{ fontSize: '0.7rem', color: '#52B788', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>Accessibilité</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.375rem', marginTop: '0.75rem', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Conçu pour tous<br />les apprenants</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[['🌙','3 thèmes','Clair, sombre, océan'],['🔤','Taille du texte','14 à 20px ajustable'],['⚡','Moins de mouvements','Pour les sensibilités'],['🎯','Contraste élevé','WCAG AA compatible']].map(([i,l,d]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1rem', marginTop: '0.1rem' }}>{i}</span>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#CCC', fontWeight: 500 }}>{l}</div>
                    <div style={{ fontSize: '0.75rem', color: '#555' }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section id="comment" style={{ borderTop: '1px solid #141414', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge">✦ Simple et efficace</span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginTop: '1.25rem', color: '#F0F0EE' }}>Apprenez en 3 étapes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Créez votre espace',    desc: 'Choisissez votre langue maternelle et la langue à apprendre. Personnalisez votre expérience.', icon: '👤' },
              { step: '02', title: 'Apprenez les mots',     desc: 'Parcourez le vocabulaire par catégories. Comparez les mots dans votre langue et la langue cible.', icon: '📖' },
              { step: '03', title: 'Révisez et progressez', desc: 'Notre algorithme SM-2 planifie vos révisions au moment optimal pour une mémorisation durable.', icon: '🎯' },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="bento-card" style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#161616', border: '1px solid #1E3A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', margin: '0 auto 1rem' }}>{icon}</div>
                <span style={{ fontSize: '0.7rem', color: '#333', letterSpacing: '0.1em', fontWeight: 600 }}>ÉTAPE {step}</span>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem', marginTop: '0.5rem', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{title}</h3>
                <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ borderTop: '1px solid #141414', padding: '7rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ bottom: '-200px', left: '50%', transform: 'translateX(-50%)' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em', marginBottom: '1.25rem', color: '#F0F0EE' }}>Prêt à commencer ?</h2>
        <p style={{ color: '#555', fontSize: '1rem', marginBottom: '2.5rem', fontWeight: 300 }}>
          Rejoignez LinguaLearn et commencez à apprendre gratuitement dès aujourd&apos;hui.
        </p>
        {isAuth ? (
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
            Reprendre mon apprentissage →
          </Link>
        ) : (
          <Link href="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
            Créer mon compte gratuit →
          </Link>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #141414', padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '0.9rem', color: '#333' }}>Lingua<span style={{ color: '#52B788' }}>Learn</span></span>
        <span style={{ fontSize: '0.75rem', color: '#333' }}>© 2026 · Apprentissage des langues pour tous</span>
      </footer>
    </main>
  )
}
