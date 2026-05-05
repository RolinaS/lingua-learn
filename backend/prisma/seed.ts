import { PrismaClient, LanguageCode, Difficulty } from '@prisma/client'

const prisma = new PrismaClient()

// ─────────────────────────────────────────────
// SEED — Lingua-Learn
// Données de base : langues, catégories, mots
// ─────────────────────────────────────────────

async function main() {
  console.log('🌱 Démarrage du seed...')

  // ─────────────────────────────────────────────
  // 1. LANGUES
  // ─────────────────────────────────────────────

  console.log('📚 Création des langues...')

  await prisma.language.upsert({
    where: { code: LanguageCode.FR },
    update: {},
    create: { code: LanguageCode.FR, name: 'Français', nativeName: 'Français', flagEmoji: '🇫🇷', rtl: false },
  })
  await prisma.language.upsert({
    where: { code: LanguageCode.EN },
    update: {},
    create: { code: LanguageCode.EN, name: 'Anglais', nativeName: 'English', flagEmoji: '🇬🇧', rtl: false },
  })
  await prisma.language.upsert({
    where: { code: LanguageCode.AR },
    update: {},
    create: { code: LanguageCode.AR, name: 'Arabe', nativeName: 'العربية', flagEmoji: '🇸🇦', rtl: true },
  })
  await prisma.language.upsert({
    where: { code: LanguageCode.ES },
    update: {},
    create: { code: LanguageCode.ES, name: 'Espagnol', nativeName: 'Español', flagEmoji: '🇪🇸', rtl: false },
  })
  await prisma.language.upsert({
    where: { code: LanguageCode.RU },
    update: {},
    create: { code: LanguageCode.RU, name: 'Russe', nativeName: 'Русский', flagEmoji: '🇷🇺', rtl: false },
  })

  // ─────────────────────────────────────────────
  // 2. CATÉGORIES
  // ─────────────────────────────────────────────

  console.log('🗂️  Création des catégories...')

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'greetings' },
      update: {},
      create: { slug: 'greetings', emoji: '👋', orderIndex: 1, nameFr: 'Salutations', nameEn: 'Greetings', nameAr: 'تحيات', nameEs: 'Saludos', nameRu: 'Приветствия' },
    }),
    prisma.category.upsert({
      where: { slug: 'numbers' },
      update: {},
      create: { slug: 'numbers', emoji: '🔢', orderIndex: 2, nameFr: 'Chiffres', nameEn: 'Numbers', nameAr: 'أرقام', nameEs: 'Números', nameRu: 'Числа' },
    }),
    prisma.category.upsert({
      where: { slug: 'colors' },
      update: {},
      create: { slug: 'colors', emoji: '🎨', orderIndex: 3, nameFr: 'Couleurs', nameEn: 'Colours', nameAr: 'ألوان', nameEs: 'Colores', nameRu: 'Цвета' },
    }),
    prisma.category.upsert({
      where: { slug: 'family' },
      update: {},
      create: { slug: 'family', emoji: '👨‍👩‍👧', orderIndex: 4, nameFr: 'Famille', nameEn: 'Family', nameAr: 'عائلة', nameEs: 'Familia', nameRu: 'Семья' },
    }),
    prisma.category.upsert({
      where: { slug: 'food' },
      update: {},
      create: { slug: 'food', emoji: '🍎', orderIndex: 5, nameFr: 'Nourriture', nameEn: 'Food', nameAr: 'طعام', nameEs: 'Comida', nameRu: 'Еда' },
    }),
    prisma.category.upsert({
      where: { slug: 'animals' },
      update: {},
      create: { slug: 'animals', emoji: '🐾', orderIndex: 6, nameFr: 'Animaux', nameEn: 'Animals', nameAr: 'حيوانات', nameEs: 'Animales', nameRu: 'Животные' },
    }),
    prisma.category.upsert({
      where: { slug: 'school' },
      update: {},
      create: { slug: 'school', emoji: '📚', orderIndex: 7, nameFr: 'École', nameEn: 'School', nameAr: 'مدرسة', nameEs: 'Escuela', nameRu: 'Школа' },
    }),
    prisma.category.upsert({
      where: { slug: 'weather' },
      update: {},
      create: { slug: 'weather', emoji: '☀️', orderIndex: 8, nameFr: 'Météo', nameEn: 'Weather', nameAr: 'طقس', nameEs: 'Tiempo', nameRu: 'Погода' },
    }),
  ])

  const [greetings, numbers, colors, family, food, animals, school, weather] = categories

  // ─────────────────────────────────────────────
  // 3. MOTS — Salutations (EN)
  // ─────────────────────────────────────────────

  console.log('💬 Création des mots — Salutations...')

  const greetingWords = [
    {
      term: 'Hello',
      phonetic: '/həˈloʊ/',
      difficulty: Difficulty.BEGINNER,
      translationFr: 'Bonjour',
      translationEn: 'Hello',
      translationAr: 'مرحبا',
      translationEs: 'Hola',
      translationRu: 'Привет',
      exampleEn: 'Hello, how are you?',
      exampleFr: 'Bonjour, comment allez-vous ?',
    },
    {
      term: 'Goodbye',
      phonetic: '/ɡʊdˈbaɪ/',
      difficulty: Difficulty.BEGINNER,
      translationFr: 'Au revoir',
      translationEn: 'Goodbye',
      translationAr: 'وداعا',
      translationEs: 'Adiós',
      translationRu: 'До свидания',
      exampleEn: 'Goodbye, see you tomorrow!',
      exampleFr: 'Au revoir, à demain !',
    },
    {
      term: 'Thank you',
      phonetic: '/θæŋk juː/',
      difficulty: Difficulty.BEGINNER,
      translationFr: 'Merci',
      translationEn: 'Thank you',
      translationAr: 'شكرا',
      translationEs: 'Gracias',
      translationRu: 'Спасибо',
      exampleEn: 'Thank you very much!',
      exampleFr: 'Merci beaucoup !',
    },
    {
      term: 'Please',
      phonetic: '/pliːz/',
      difficulty: Difficulty.BEGINNER,
      translationFr: 'S\'il vous plaît',
      translationEn: 'Please',
      translationAr: 'من فضلك',
      translationEs: 'Por favor',
      translationRu: 'Пожалуйста',
      exampleEn: 'Can you help me, please?',
      exampleFr: 'Pouvez-vous m\'aider, s\'il vous plaît ?',
    },
    {
      term: 'Sorry',
      phonetic: '/ˈsɒri/',
      difficulty: Difficulty.BEGINNER,
      translationFr: 'Désolé',
      translationEn: 'Sorry',
      translationAr: 'آسف',
      translationEs: 'Lo siento',
      translationRu: 'Извините',
      exampleEn: 'Sorry, I didn\'t mean that.',
      exampleFr: 'Désolé, je ne voulais pas dire ça.',
    },
    {
      term: 'Good morning',
      phonetic: '/ɡʊd ˈmɔːnɪŋ/',
      difficulty: Difficulty.BEGINNER,
      translationFr: 'Bonjour (matin)',
      translationEn: 'Good morning',
      translationAr: 'صباح الخير',
      translationEs: 'Buenos días',
      translationRu: 'Доброе утро',
      exampleEn: 'Good morning! Did you sleep well?',
      exampleFr: 'Bonjour ! Avez-vous bien dormi ?',
    },
    {
      term: 'Good night',
      phonetic: '/ɡʊd naɪt/',
      difficulty: Difficulty.BEGINNER,
      translationFr: 'Bonne nuit',
      translationEn: 'Good night',
      translationAr: 'تصبح على خير',
      translationEs: 'Buenas noches',
      translationRu: 'Спокойной ночи',
      exampleEn: 'Good night, sweet dreams!',
      exampleFr: 'Bonne nuit, fais de beaux rêves !',
    },
  ]

  for (const word of greetingWords) {
    await prisma.word.upsert({
      where: { languageCode_term: { languageCode: LanguageCode.EN, term: word.term } },
      update: {},
      create: { ...word, languageCode: LanguageCode.EN, categoryId: greetings.id },
    })
  }

  // ─────────────────────────────────────────────
  // 4. MOTS — Chiffres (EN)
  // ─────────────────────────────────────────────

  console.log('🔢 Création des mots — Chiffres...')

  const numberWords = [
    { term: 'One',   phonetic: '/wʌn/',   translationFr: 'Un',   translationAr: 'واحد',  translationEs: 'Uno',   translationRu: 'Один' },
    { term: 'Two',   phonetic: '/tuː/',   translationFr: 'Deux', translationAr: 'اثنان', translationEs: 'Dos',   translationRu: 'Два' },
    { term: 'Three', phonetic: '/θriː/', translationFr: 'Trois', translationAr: 'ثلاثة', translationEs: 'Tres',  translationRu: 'Три' },
    { term: 'Four',  phonetic: '/fɔːr/', translationFr: 'Quatre',translationAr: 'أربعة', translationEs: 'Cuatro',translationRu: 'Четыре' },
    { term: 'Five',  phonetic: '/faɪv/', translationFr: 'Cinq',  translationAr: 'خمسة',  translationEs: 'Cinco', translationRu: 'Пять' },
    { term: 'Six',   phonetic: '/sɪks/', translationFr: 'Six',   translationAr: 'ستة',   translationEs: 'Seis',  translationRu: 'Шесть' },
    { term: 'Seven', phonetic: '/ˈsɛvən/',translationFr: 'Sept', translationAr: 'سبعة',  translationEs: 'Siete', translationRu: 'Семь' },
    { term: 'Eight', phonetic: '/eɪt/',  translationFr: 'Huit',  translationAr: 'ثمانية',translationEs: 'Ocho',  translationRu: 'Восемь' },
    { term: 'Nine',  phonetic: '/naɪn/', translationFr: 'Neuf',  translationAr: 'تسعة',  translationEs: 'Nueve', translationRu: 'Девять' },
    { term: 'Ten',   phonetic: '/tɛn/',  translationFr: 'Dix',   translationAr: 'عشرة',  translationEs: 'Diez',  translationRu: 'Десять' },
  ]

  for (const word of numberWords) {
    await prisma.word.upsert({
      where: { languageCode_term: { languageCode: LanguageCode.EN, term: word.term } },
      update: {},
      create: {
        ...word,
        languageCode: LanguageCode.EN,
        categoryId: numbers.id,
        difficulty: Difficulty.BEGINNER,
        translationEn: word.term,
      },
    })
  }

  // ─────────────────────────────────────────────
  // 5. MOTS — Couleurs (EN)
  // ─────────────────────────────────────────────

  console.log('🎨 Création des mots — Couleurs...')

  const colorWords = [
    { term: 'Red',    phonetic: '/rɛd/',   translationFr: 'Rouge',  translationAr: 'أحمر',  translationEs: 'Rojo',     translationRu: 'Красный' },
    { term: 'Blue',   phonetic: '/bluː/',  translationFr: 'Bleu',   translationAr: 'أزرق',  translationEs: 'Azul',     translationRu: 'Синий' },
    { term: 'Green',  phonetic: '/ɡriːn/', translationFr: 'Vert',   translationAr: 'أخضر',  translationEs: 'Verde',    translationRu: 'Зелёный' },
    { term: 'Yellow', phonetic: '/ˈjɛloʊ/',translationFr: 'Jaune', translationAr: 'أصفر',  translationEs: 'Amarillo', translationRu: 'Жёлтый' },
    { term: 'Black',  phonetic: '/blæk/',  translationFr: 'Noir',   translationAr: 'أسود',  translationEs: 'Negro',    translationRu: 'Чёрный' },
    { term: 'White',  phonetic: '/waɪt/',  translationFr: 'Blanc',  translationAr: 'أبيض',  translationEs: 'Blanco',   translationRu: 'Белый' },
    { term: 'Orange', phonetic: '/ˈɒrɪndʒ/',translationFr: 'Orange',translationAr: 'برتقالي',translationEs: 'Naranja', translationRu: 'Оранжевый' },
    { term: 'Purple', phonetic: '/ˈpɜːpəl/',translationFr: 'Violet',translationAr: 'بنفسجي',translationEs: 'Morado',  translationRu: 'Фиолетовый' },
  ]

  for (const word of colorWords) {
    await prisma.word.upsert({
      where: { languageCode_term: { languageCode: LanguageCode.EN, term: word.term } },
      update: {},
      create: {
        ...word,
        languageCode: LanguageCode.EN,
        categoryId: colors.id,
        difficulty: Difficulty.BEGINNER,
        translationEn: word.term,
      },
    })
  }

  // ─────────────────────────────────────────────
  // 6. MOTS — Famille (EN)
  // ─────────────────────────────────────────────

  console.log('👨‍👩‍👧 Création des mots — Famille...')

  const familyWords = [
    { term: 'Mother',      phonetic: '/ˈmʌðər/',   translationFr: 'Mère',        translationAr: 'أم',      translationEs: 'Madre',    translationRu: 'Мать' },
    { term: 'Father',      phonetic: '/ˈfɑːðər/',  translationFr: 'Père',        translationAr: 'أب',      translationEs: 'Padre',    translationRu: 'Отец' },
    { term: 'Brother',     phonetic: '/ˈbrʌðər/',  translationFr: 'Frère',       translationAr: 'أخ',      translationEs: 'Hermano',  translationRu: 'Брат' },
    { term: 'Sister',      phonetic: '/ˈsɪstər/',  translationFr: 'Sœur',        translationAr: 'أخت',     translationEs: 'Hermana',  translationRu: 'Сестра' },
    { term: 'Grandmother', phonetic: '/ˈɡrænmʌðər/',translationFr: 'Grand-mère', translationAr: 'جدة',     translationEs: 'Abuela',   translationRu: 'Бабушка' },
    { term: 'Grandfather', phonetic: '/ˈɡrænfɑːðər/',translationFr: 'Grand-père',translationAr: 'جد',      translationEs: 'Abuelo',   translationRu: 'Дедушка' },
    { term: 'Son',         phonetic: '/sʌn/',      translationFr: 'Fils',        translationAr: 'ابن',     translationEs: 'Hijo',     translationRu: 'Сын' },
    { term: 'Daughter',    phonetic: '/ˈdɔːtər/',  translationFr: 'Fille',       translationAr: 'ابنة',    translationEs: 'Hija',     translationRu: 'Дочь' },
  ]

  for (const word of familyWords) {
    await prisma.word.upsert({
      where: { languageCode_term: { languageCode: LanguageCode.EN, term: word.term } },
      update: {},
      create: {
        ...word,
        languageCode: LanguageCode.EN,
        categoryId: family.id,
        difficulty: Difficulty.BEGINNER,
        translationEn: word.term,
      },
    })
  }

  // ─────────────────────────────────────────────
  // 7. MOTS — Nourriture (EN)
  // ─────────────────────────────────────────────

  console.log('🍎 Création des mots — Nourriture...')

  const foodWords = [
    { term: 'Apple',  phonetic: '/ˈæpəl/',  translationFr: 'Pomme',   translationAr: 'تفاحة',  translationEs: 'Manzana', translationRu: 'Яблоко' },
    { term: 'Bread',  phonetic: '/brɛd/',   translationFr: 'Pain',    translationAr: 'خبز',    translationEs: 'Pan',     translationRu: 'Хлеб' },
    { term: 'Water',  phonetic: '/ˈwɔːtər/',translationFr: 'Eau',     translationAr: 'ماء',    translationEs: 'Agua',    translationRu: 'Вода' },
    { term: 'Milk',   phonetic: '/mɪlk/',   translationFr: 'Lait',    translationAr: 'حليب',   translationEs: 'Leche',   translationRu: 'Молоко' },
    { term: 'Egg',    phonetic: '/ɛɡ/',     translationFr: 'Œuf',     translationAr: 'بيضة',   translationEs: 'Huevo',   translationRu: 'Яйцо' },
    { term: 'Rice',   phonetic: '/raɪs/',   translationFr: 'Riz',     translationAr: 'أرز',    translationEs: 'Arroz',   translationRu: 'Рис' },
    { term: 'Cheese', phonetic: '/tʃiːz/',  translationFr: 'Fromage', translationAr: 'جبن',    translationEs: 'Queso',   translationRu: 'Сыр' },
    { term: 'Chicken',phonetic: '/ˈtʃɪkɪn/',translationFr: 'Poulet', translationAr: 'دجاج',   translationEs: 'Pollo',   translationRu: 'Курица' },
  ]

  for (const word of foodWords) {
    await prisma.word.upsert({
      where: { languageCode_term: { languageCode: LanguageCode.EN, term: word.term } },
      update: {},
      create: {
        ...word,
        languageCode: LanguageCode.EN,
        categoryId: food.id,
        difficulty: Difficulty.BEGINNER,
        translationEn: word.term,
      },
    })
  }

  // ─────────────────────────────────────────────
  // 8. MOTS — Animaux (EN)
  // ─────────────────────────────────────────────

  console.log('🐾 Création des mots — Animaux...')

  const animalWords = [
    { term: 'Dog',      phonetic: '/dɒɡ/',    translationFr: 'Chien',   translationAr: 'كلب',   translationEs: 'Perro',   translationRu: 'Собака' },
    { term: 'Cat',      phonetic: '/kæt/',    translationFr: 'Chat',    translationAr: 'قطة',   translationEs: 'Gato',    translationRu: 'Кошка' },
    { term: 'Bird',     phonetic: '/bɜːrd/',  translationFr: 'Oiseau',  translationAr: 'طائر',  translationEs: 'Pájaro',  translationRu: 'Птица' },
    { term: 'Fish',     phonetic: '/fɪʃ/',    translationFr: 'Poisson', translationAr: 'سمكة',  translationEs: 'Pez',     translationRu: 'Рыба' },
    { term: 'Horse',    phonetic: '/hɔːrs/',  translationFr: 'Cheval',  translationAr: 'حصان',  translationEs: 'Caballo', translationRu: 'Лошадь' },
    { term: 'Rabbit',   phonetic: '/ˈræbɪt/', translationFr: 'Lapin',   translationAr: 'أرنب',  translationEs: 'Conejo',  translationRu: 'Кролик' },
    { term: 'Lion',     phonetic: '/ˈlaɪən/', translationFr: 'Lion',    translationAr: 'أسد',   translationEs: 'León',    translationRu: 'Лев' },
    { term: 'Elephant', phonetic: '/ˈɛlɪfənt/',translationFr: 'Éléphant',translationAr: 'فيل', translationEs: 'Elefante',translationRu: 'Слон' },
  ]

  for (const word of animalWords) {
    await prisma.word.upsert({
      where: { languageCode_term: { languageCode: LanguageCode.EN, term: word.term } },
      update: {},
      create: {
        ...word,
        languageCode: LanguageCode.EN,
        categoryId: animals.id,
        difficulty: Difficulty.BEGINNER,
        translationEn: word.term,
      },
    })
  }

  // ─────────────────────────────────────────────
  // 9. MOTS — École (EN)
  // ─────────────────────────────────────────────

  console.log('📚 Création des mots — École...')

  const schoolWords = [
    { term: 'Book',     phonetic: '/bʊk/',    translationFr: 'Livre',    translationAr: 'كتاب',  translationEs: 'Libro',    translationRu: 'Книга' },
    { term: 'Pencil',   phonetic: '/ˈpɛnsəl/',translationFr: 'Crayon',   translationAr: 'قلم',   translationEs: 'Lápiz',    translationRu: 'Карандаш' },
    { term: 'Teacher',  phonetic: '/ˈtiːtʃər/',translationFr: 'Professeur',translationAr: 'معلم', translationEs: 'Profesor', translationRu: 'Учитель' },
    { term: 'Student',  phonetic: '/ˈstjuːdənt/',translationFr: 'Élève', translationAr: 'طالب',  translationEs: 'Estudiante',translationRu: 'Студент' },
    { term: 'Class',    phonetic: '/klɑːs/',  translationFr: 'Classe',   translationAr: 'فصل',   translationEs: 'Clase',    translationRu: 'Класс' },
    { term: 'School',   phonetic: '/skuːl/',  translationFr: 'École',    translationAr: 'مدرسة', translationEs: 'Escuela',  translationRu: 'Школа' },
    { term: 'Homework', phonetic: '/ˈhoʊmwɜːrk/',translationFr: 'Devoir',translationAr: 'واجب',  translationEs: 'Tarea',    translationRu: 'Домашнее задание' },
  ]

  for (const word of schoolWords) {
    await prisma.word.upsert({
      where: { languageCode_term: { languageCode: LanguageCode.EN, term: word.term } },
      update: {},
      create: {
        ...word,
        languageCode: LanguageCode.EN,
        categoryId: school.id,
        difficulty: Difficulty.BEGINNER,
        translationEn: word.term,
      },
    })
  }

  // ─────────────────────────────────────────────
  // 10. MOTS — Météo (EN)
  // ─────────────────────────────────────────────

  console.log('☀️  Création des mots — Météo...')

  const weatherWords = [
    { term: 'Sun',    phonetic: '/sʌn/',    translationFr: 'Soleil',  translationAr: 'شمس',  translationEs: 'Sol',     translationRu: 'Солнце' },
    { term: 'Rain',   phonetic: '/reɪn/',  translationFr: 'Pluie',   translationAr: 'مطر',  translationEs: 'Lluvia',  translationRu: 'Дождь' },
    { term: 'Snow',   phonetic: '/snoʊ/',  translationFr: 'Neige',   translationAr: 'ثلج',  translationEs: 'Nieve',   translationRu: 'Снег' },
    { term: 'Wind',   phonetic: '/wɪnd/',  translationFr: 'Vent',    translationAr: 'رياح', translationEs: 'Viento',  translationRu: 'Ветер' },
    { term: 'Cloud',  phonetic: '/klaʊd/', translationFr: 'Nuage',   translationAr: 'سحابة',translationEs: 'Nube',    translationRu: 'Облако' },
    { term: 'Storm',  phonetic: '/stɔːrm/',translationFr: 'Tempête', translationAr: 'عاصفة',translationEs: 'Tormenta',translationRu: 'Буря' },
    { term: 'Hot',    phonetic: '/hɒt/',   translationFr: 'Chaud',   translationAr: 'حار',  translationEs: 'Caliente',translationRu: 'Жарко' },
    { term: 'Cold',   phonetic: '/koʊld/', translationFr: 'Froid',   translationAr: 'بارد', translationEs: 'Frío',    translationRu: 'Холодно' },
  ]

  for (const word of weatherWords) {
    await prisma.word.upsert({
      where: { languageCode_term: { languageCode: LanguageCode.EN, term: word.term } },
      update: {},
      create: {
        ...word,
        languageCode: LanguageCode.EN,
        categoryId: weather.id,
        difficulty: Difficulty.BEGINNER,
        translationEn: word.term,
      },
    })
  }

  // ─────────────────────────────────────────────
  // Résumé
  // ─────────────────────────────────────────────

  const wordCount = await prisma.word.count()
  console.log('')
  console.log('✅ Seed terminé avec succès !')
  console.log(`   📖 ${wordCount} mots insérés en base`)
  console.log(`   🌍 5 langues disponibles`)
  console.log(`   🗂️  8 catégories créées`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })