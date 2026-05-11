'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'

// ─────────────────────────────────────────────
// Données alphabets
// ─────────────────────────────────────────────

const ALPHABETS = {
  RU: {
    label: 'Alphabet russe (Cyrillique)',
    flag: '🇷🇺',
    description: '33 lettres · Se lit phonétiquement',
    letters: [
      { char: 'А', lower: 'а', name: 'A',   phonetic: '/a/',    example: 'аптека', exampleFr: 'pharmacie' },
      { char: 'Б', lower: 'б', name: 'Bé',  phonetic: '/b/',    example: 'банан',  exampleFr: 'banane' },
      { char: 'В', lower: 'в', name: 'Vé',  phonetic: '/v/',    example: 'вода',   exampleFr: 'eau' },
      { char: 'Г', lower: 'г', name: 'Gué', phonetic: '/ɡ/',    example: 'город',  exampleFr: 'ville' },
      { char: 'Д', lower: 'д', name: 'Dé',  phonetic: '/d/',    example: 'дом',    exampleFr: 'maison' },
      { char: 'Е', lower: 'е', name: 'Yé',  phonetic: '/jɛ/',   example: 'еда',    exampleFr: 'nourriture' },
      { char: 'Ё', lower: 'ё', name: 'Yo',  phonetic: '/jo/',   example: 'ёж',     exampleFr: 'hérisson' },
      { char: 'Ж', lower: 'ж', name: 'Jé',  phonetic: '/ʒ/',    example: 'жара',   exampleFr: 'chaleur' },
      { char: 'З', lower: 'з', name: 'Zé',  phonetic: '/z/',    example: 'зима',   exampleFr: 'hiver' },
      { char: 'И', lower: 'и', name: 'I',   phonetic: '/i/',    example: 'имя',    exampleFr: 'prénom' },
      { char: 'Й', lower: 'й', name: 'I court', phonetic: '/j/', example: 'йога', exampleFr: 'yoga' },
      { char: 'К', lower: 'к', name: 'Ka',  phonetic: '/k/',    example: 'кот',    exampleFr: 'chat' },
      { char: 'Л', lower: 'л', name: 'El',  phonetic: '/l/',    example: 'луна',   exampleFr: 'lune' },
      { char: 'М', lower: 'м', name: 'Em',  phonetic: '/m/',    example: 'мама',   exampleFr: 'maman' },
      { char: 'Н', lower: 'н', name: 'En',  phonetic: '/n/',    example: 'нос',    exampleFr: 'nez' },
      { char: 'О', lower: 'о', name: 'O',   phonetic: '/o/',    example: 'окно',   exampleFr: 'fenêtre' },
      { char: 'П', lower: 'п', name: 'Pé',  phonetic: '/p/',    example: 'папа',   exampleFr: 'papa' },
      { char: 'Р', lower: 'р', name: 'Er',  phonetic: '/r/',    example: 'рука',   exampleFr: 'main' },
      { char: 'С', lower: 'с', name: 'Es',  phonetic: '/s/',    example: 'сон',    exampleFr: 'rêve' },
      { char: 'Т', lower: 'т', name: 'Té',  phonetic: '/t/',    example: 'торт',   exampleFr: 'gâteau' },
      { char: 'У', lower: 'у', name: 'Ou',  phonetic: '/u/',    example: 'утро',   exampleFr: 'matin' },
      { char: 'Ф', lower: 'ф', name: 'Ef',  phonetic: '/f/',    example: 'фото',   exampleFr: 'photo' },
      { char: 'Х', lower: 'х', name: 'Kha', phonetic: '/x/',    example: 'хлеб',   exampleFr: 'pain' },
      { char: 'Ц', lower: 'ц', name: 'Tsé', phonetic: '/ts/',   example: 'цвет',   exampleFr: 'couleur' },
      { char: 'Ч', lower: 'ч', name: 'Tché', phonetic: '/tʃ/', example: 'чай',    exampleFr: 'thé' },
      { char: 'Ш', lower: 'ш', name: 'Cha', phonetic: '/ʃ/',    example: 'школа',  exampleFr: 'école' },
      { char: 'Щ', lower: 'щ', name: 'Chtcha', phonetic: '/ɕɕ/', example: 'щи',   exampleFr: 'soupe' },
      { char: 'Ъ', lower: 'ъ', name: 'Signe dur', phonetic: '—', example: 'объект', exampleFr: 'objet' },
      { char: 'Ы', lower: 'ы', name: 'Yeru', phonetic: '/ɨ/',  example: 'рыба',   exampleFr: 'poisson' },
      { char: 'Ь', lower: 'ь', name: 'Signe mou', phonetic: 'ʲ', example: 'соль', exampleFr: 'sel' },
      { char: 'Э', lower: 'э', name: 'É',   phonetic: '/ɛ/',    example: 'этот',   exampleFr: 'ce/cet' },
      { char: 'Ю', lower: 'ю', name: 'You', phonetic: '/ju/',   example: 'юг',     exampleFr: 'sud' },
      { char: 'Я', lower: 'я', name: 'Ya',  phonetic: '/ja/',   example: 'яблоко', exampleFr: 'pomme' },
    ]
  },
  AR: {
    label: 'Alphabet arabe',
    flag: '🇸🇦',
    description: '28 lettres · S\'écrit de droite à gauche',
    letters: [
      { char: 'ا', lower: 'ا', name: 'Alif',  phonetic: '/ʔ/ ou /a/', example: 'أب',    exampleFr: 'père' },
      { char: 'ب', lower: 'ب', name: 'Ba',    phonetic: '/b/',         example: 'بيت',   exampleFr: 'maison' },
      { char: 'ت', lower: 'ت', name: 'Ta',    phonetic: '/t/',         example: 'تفاح',  exampleFr: 'pomme' },
      { char: 'ث', lower: 'ث', name: 'Tha',   phonetic: '/θ/',         example: 'ثلج',   exampleFr: 'neige' },
      { char: 'ج', lower: 'ج', name: 'Djem',  phonetic: '/dʒ/',        example: 'جبل',   exampleFr: 'montagne' },
      { char: 'ح', lower: 'ح', name: 'Ha',    phonetic: '/ħ/',         example: 'حليب',  exampleFr: 'lait' },
      { char: 'خ', lower: 'خ', name: 'Kha',   phonetic: '/x/',         example: 'خبز',   exampleFr: 'pain' },
      { char: 'د', lower: 'د', name: 'Dal',   phonetic: '/d/',         example: 'دم',    exampleFr: 'sang' },
      { char: 'ذ', lower: 'ذ', name: 'Dhal',  phonetic: '/ð/',         example: 'ذهب',   exampleFr: 'or' },
      { char: 'ر', lower: 'ر', name: 'Ra',    phonetic: '/r/',         example: 'رأس',   exampleFr: 'tête' },
      { char: 'ز', lower: 'ز', name: 'Zay',   phonetic: '/z/',         example: 'زيت',   exampleFr: 'huile' },
      { char: 'س', lower: 'س', name: 'Sine',  phonetic: '/s/',         example: 'سمك',   exampleFr: 'poisson' },
      { char: 'ش', lower: 'ش', name: 'Chine', phonetic: '/ʃ/',         example: 'شمس',   exampleFr: 'soleil' },
      { char: 'ص', lower: 'ص', name: 'Sad',   phonetic: '/sˤ/',        example: 'صبر',   exampleFr: 'patience' },
      { char: 'ض', lower: 'ض', name: 'Dad',   phonetic: '/dˤ/',        example: 'ضوء',   exampleFr: 'lumière' },
      { char: 'ط', lower: 'ط', name: 'Ta',    phonetic: '/tˤ/',        example: 'طائر',  exampleFr: 'oiseau' },
      { char: 'ظ', lower: 'ظ', name: 'Dha',   phonetic: '/ðˤ/',        example: 'ظل',    exampleFr: 'ombre' },
      { char: 'ع', lower: 'ع', name: 'Ain',   phonetic: '/ʕ/',         example: 'عين',   exampleFr: 'œil' },
      { char: 'غ', lower: 'غ', name: 'Ghain', phonetic: '/ɣ/',         example: 'غرفة',  exampleFr: 'chambre' },
      { char: 'ف', lower: 'ف', name: 'Fa',    phonetic: '/f/',         example: 'فم',    exampleFr: 'bouche' },
      { char: 'ق', lower: 'ق', name: 'Qaf',   phonetic: '/q/',         example: 'قلب',   exampleFr: 'cœur' },
      { char: 'ك', lower: 'ك', name: 'Kaf',   phonetic: '/k/',         example: 'كتاب',  exampleFr: 'livre' },
      { char: 'ل', lower: 'ل', name: 'Lam',   phonetic: '/l/',         example: 'لون',   exampleFr: 'couleur' },
      { char: 'م', lower: 'م', name: 'Mime',  phonetic: '/m/',         example: 'ماء',   exampleFr: 'eau' },
      { char: 'ن', lower: 'ن', name: 'Noune', phonetic: '/n/',         example: 'نار',   exampleFr: 'feu' },
      { char: 'ه', lower: 'ه', name: 'Ha',    phonetic: '/h/',         example: 'هواء',  exampleFr: 'air' },
      { char: 'و', lower: 'و', name: 'Waw',   phonetic: '/w/ ou /uː/', example: 'ورد',   exampleFr: 'rose' },
      { char: 'ي', lower: 'ي', name: 'Ya',    phonetic: '/j/ ou /iː/', example: 'يد',    exampleFr: 'main' },
    ]
  },
  ES: {
    label: 'Alphabet espagnol',
    flag: '🇪🇸',
    description: '27 lettres · Très phonétique',
    letters: [
      { char: 'A', lower: 'a', name: 'A',   phonetic: '/a/',   example: 'agua',    exampleFr: 'eau' },
      { char: 'B', lower: 'b', name: 'Bé',  phonetic: '/b/',   example: 'banco',   exampleFr: 'banque' },
      { char: 'C', lower: 'c', name: 'Cé',  phonetic: '/k/ ou /θ/', example: 'casa', exampleFr: 'maison' },
      { char: 'D', lower: 'd', name: 'Dé',  phonetic: '/d/',   example: 'día',     exampleFr: 'jour' },
      { char: 'E', lower: 'e', name: 'E',   phonetic: '/e/',   example: 'escuela', exampleFr: 'école' },
      { char: 'F', lower: 'f', name: 'Efe', phonetic: '/f/',   example: 'flor',    exampleFr: 'fleur' },
      { char: 'G', lower: 'g', name: 'Gé',  phonetic: '/ɡ/ ou /x/', example: 'gato', exampleFr: 'chat' },
      { char: 'H', lower: 'h', name: 'Hache', phonetic: '(muet)', example: 'hola', exampleFr: 'bonjour' },
      { char: 'I', lower: 'i', name: 'I',   phonetic: '/i/',   example: 'isla',    exampleFr: 'île' },
      { char: 'J', lower: 'j', name: 'Jota', phonetic: '/x/',  example: 'jardín',  exampleFr: 'jardin' },
      { char: 'K', lower: 'k', name: 'Ka',  phonetic: '/k/',   example: 'kilo',    exampleFr: 'kilo' },
      { char: 'L', lower: 'l', name: 'Ele', phonetic: '/l/',   example: 'luna',    exampleFr: 'lune' },
      { char: 'M', lower: 'm', name: 'Eme', phonetic: '/m/',   example: 'madre',   exampleFr: 'mère' },
      { char: 'N', lower: 'n', name: 'Ene', phonetic: '/n/',   example: 'noche',   exampleFr: 'nuit' },
      { char: 'Ñ', lower: 'ñ', name: 'Eñe', phonetic: '/ɲ/',  example: 'niño',    exampleFr: 'enfant' },
      { char: 'O', lower: 'o', name: 'O',   phonetic: '/o/',   example: 'ojo',     exampleFr: 'œil' },
      { char: 'P', lower: 'p', name: 'Pé',  phonetic: '/p/',   example: 'padre',   exampleFr: 'père' },
      { char: 'Q', lower: 'q', name: 'Cu',  phonetic: '/k/',   example: 'queso',   exampleFr: 'fromage' },
      { char: 'R', lower: 'r', name: 'Erre', phonetic: '/r/',  example: 'rosa',    exampleFr: 'rose' },
      { char: 'S', lower: 's', name: 'Ese', phonetic: '/s/',   example: 'sol',     exampleFr: 'soleil' },
      { char: 'T', lower: 't', name: 'Té',  phonetic: '/t/',   example: 'tren',    exampleFr: 'train' },
      { char: 'U', lower: 'u', name: 'U',   phonetic: '/u/',   example: 'uva',     exampleFr: 'raisin' },
      { char: 'V', lower: 'v', name: 'Uvé', phonetic: '/b/',   example: 'vino',    exampleFr: 'vin' },
      { char: 'W', lower: 'w', name: 'Doble uvé', phonetic: '/w/', example: 'wifi', exampleFr: 'wifi' },
      { char: 'X', lower: 'x', name: 'Equis', phonetic: '/ks/ ou /x/', example: 'taxi', exampleFr: 'taxi' },
      { char: 'Y', lower: 'y', name: 'Ye',  phonetic: '/ʝ/',   example: 'yo',      exampleFr: 'je' },
      { char: 'Z', lower: 'z', name: 'Zeta', phonetic: '/θ/',  example: 'zapato',  exampleFr: 'chaussure' },
    ]
  },
  EN: {
    label: 'Alphabet anglais',
    flag: '🇬🇧',
    description: '26 lettres · Prononciation irrégulière',
    letters: [
      { char: 'A', lower: 'a', name: 'Ay',  phonetic: '/eɪ/',  example: 'apple',   exampleFr: 'pomme' },
      { char: 'B', lower: 'b', name: 'Bee', phonetic: '/biː/', example: 'book',    exampleFr: 'livre' },
      { char: 'C', lower: 'c', name: 'See', phonetic: '/siː/', example: 'cat',     exampleFr: 'chat' },
      { char: 'D', lower: 'd', name: 'Dee', phonetic: '/diː/', example: 'dog',     exampleFr: 'chien' },
      { char: 'E', lower: 'e', name: 'Ee',  phonetic: '/iː/',  example: 'egg',     exampleFr: 'œuf' },
      { char: 'F', lower: 'f', name: 'Ef',  phonetic: '/ɛf/',  example: 'fish',    exampleFr: 'poisson' },
      { char: 'G', lower: 'g', name: 'Gee', phonetic: '/dʒiː/', example: 'girl',  exampleFr: 'fille' },
      { char: 'H', lower: 'h', name: 'Aitch', phonetic: '/eɪtʃ/', example: 'house', exampleFr: 'maison' },
      { char: 'I', lower: 'i', name: 'Eye', phonetic: '/aɪ/',  example: 'ice',     exampleFr: 'glace' },
      { char: 'J', lower: 'j', name: 'Jay', phonetic: '/dʒeɪ/', example: 'juice', exampleFr: 'jus' },
      { char: 'K', lower: 'k', name: 'Kay', phonetic: '/keɪ/', example: 'king',    exampleFr: 'roi' },
      { char: 'L', lower: 'l', name: 'El',  phonetic: '/ɛl/',  example: 'lion',    exampleFr: 'lion' },
      { char: 'M', lower: 'm', name: 'Em',  phonetic: '/ɛm/',  example: 'moon',    exampleFr: 'lune' },
      { char: 'N', lower: 'n', name: 'En',  phonetic: '/ɛn/',  example: 'night',   exampleFr: 'nuit' },
      { char: 'O', lower: 'o', name: 'Oh',  phonetic: '/oʊ/',  example: 'orange',  exampleFr: 'orange' },
      { char: 'P', lower: 'p', name: 'Pee', phonetic: '/piː/', example: 'park',    exampleFr: 'parc' },
      { char: 'Q', lower: 'q', name: 'Cue', phonetic: '/kjuː/', example: 'queen', exampleFr: 'reine' },
      { char: 'R', lower: 'r', name: 'Ar',  phonetic: '/ɑːr/', example: 'rain',    exampleFr: 'pluie' },
      { char: 'S', lower: 's', name: 'Ess', phonetic: '/ɛs/',  example: 'sun',     exampleFr: 'soleil' },
      { char: 'T', lower: 't', name: 'Tee', phonetic: '/tiː/', example: 'tree',    exampleFr: 'arbre' },
      { char: 'U', lower: 'u', name: 'You', phonetic: '/juː/', example: 'umbrella', exampleFr: 'parapluie' },
      { char: 'V', lower: 'v', name: 'Vee', phonetic: '/viː/', example: 'voice',   exampleFr: 'voix' },
      { char: 'W', lower: 'w', name: 'Double-U', phonetic: '/ˈdʌbəl juː/', example: 'water', exampleFr: 'eau' },
      { char: 'X', lower: 'x', name: 'Ex',  phonetic: '/ɛks/', example: 'fox',     exampleFr: 'renard' },
      { char: 'Y', lower: 'y', name: 'Why', phonetic: '/waɪ/', example: 'year',    exampleFr: 'année' },
      { char: 'Z', lower: 'z', name: 'Zed', phonetic: '/zɛd/', example: 'zero',    exampleFr: 'zéro' },
    ]
  }
}

export default function AlphabetPage() {
  const user = useAuthStore((s) => s.user)
  const lang = user?.learningLanguage as keyof typeof ALPHABETS
  const [selected, setSelected] = useState<keyof typeof ALPHABETS>(
    lang && ALPHABETS[lang] ? lang : 'EN'
  )
  const [flipped, setFlipped] = useState<string | null>(null)

  const alphabet = ALPHABETS[selected]
  const isRTL = selected === 'AR'

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#F0F0EE', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
          Alphabet
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#444' }}>
          Apprenez les lettres et leur prononciation
        </p>
      </div>

      {/* Sélecteur de langue */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {(Object.keys(ALPHABETS) as (keyof typeof ALPHABETS)[]).map((code) => (
          <button
            key={code}
            onClick={() => { setSelected(code); setFlipped(null) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '100px',
              border: `1px solid ${selected === code ? 'rgba(82,183,136,0.4)' : '#1A1A1A'}`,
              background: selected === code ? 'rgba(82,183,136,0.08)' : '#0E0E0E',
              color: selected === code ? '#52B788' : '#666',
              fontSize: '0.875rem',
              fontWeight: selected === code ? 600 : 400,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            <span>{ALPHABETS[code].flag}</span>
            <span>{code}</span>
          </button>
        ))}
      </div>

      {/* Info langue */}
      <div style={{ background: 'rgba(82,183,136,0.06)', border: '1px solid rgba(82,183,136,0.15)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{alphabet.flag}</span>
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#52B788' }}>{alphabet.label}</p>
          <p style={{ fontSize: '0.75rem', color: '#444', marginTop: '0.15rem' }}>{alphabet.description}</p>
        </div>
        {isRTL && (
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#52B788', background: 'rgba(82,183,136,0.1)', border: '1px solid rgba(82,183,136,0.2)', padding: '0.25rem 0.625rem', borderRadius: '100px', fontWeight: 500 }}>
            ← Droite à gauche
          </span>
        )}
      </div>

      {/* Grille de lettres */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
        {alphabet.letters.map((letter) => {
          const isFlipped = flipped === letter.char
          return (
            <button
              key={letter.char}
              onClick={() => setFlipped(isFlipped ? null : letter.char)}
              style={{
                background: isFlipped ? 'rgba(82,183,136,0.08)' : '#0E0E0E',
                border: `1px solid ${isFlipped ? 'rgba(82,183,136,0.3)' : '#1A1A1A'}`,
                borderRadius: '14px',
                padding: '1.25rem 1rem',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                textAlign: 'center',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {!isFlipped ? (
                /* Face avant — lettre */
                <>
                  <span style={{
                    fontSize: isRTL ? '2.5rem' : '2rem',
                    color: '#F0F0EE',
                    fontFamily: isRTL ? 'serif' : "'DM Serif Display', serif",
                    lineHeight: 1,
                    direction: isRTL ? 'rtl' : 'ltr',
                  }}>
                    {letter.char}
                  </span>
                  {!isRTL && (
                    <span style={{ fontSize: '1.25rem', color: '#333' }}>{letter.lower}</span>
                  )}
                  <span style={{ fontSize: '0.7rem', color: '#52B788', fontWeight: 500 }}>{letter.name}</span>
                  <span style={{ fontSize: '0.65rem', color: '#2A2A2A' }}>Cliquez pour détails</span>
                </>
              ) : (
                /* Face arrière — détails */
                <>
                  <span style={{
                    fontSize: '1.5rem',
                    color: '#52B788',
                    fontFamily: isRTL ? 'serif' : "'DM Serif Display', serif",
                    direction: isRTL ? 'rtl' : 'ltr',
                  }}>
                    {letter.char}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>{letter.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#52B788', fontFamily: 'monospace' }}>{letter.phonetic}</span>
                  <div style={{ marginTop: '0.25rem', borderTop: '1px solid rgba(82,183,136,0.15)', paddingTop: '0.5rem', width: '100%' }}>
                    <p style={{ fontSize: '0.8rem', color: '#CCC', direction: isRTL ? 'rtl' : 'ltr' }}>{letter.example}</p>
                    <p style={{ fontSize: '0.7rem', color: '#444' }}>{letter.exampleFr}</p>
                  </div>
                </>
              )}
            </button>
          )
        })}
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#2A2A2A' }}>
        Cliquez sur une lettre pour voir sa prononciation et un exemple
      </p>
    </div>
  )
}