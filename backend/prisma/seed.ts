import { PrismaClient, LanguageCode, Difficulty } from '@prisma/client'

const prisma = new PrismaClient()

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface WordData {
  term: string
  phonetic?: string
  difficulty: Difficulty
  translationFr: string
  translationAr: string
  translationEs: string
  translationRu: string
  exampleEn?: string
  exampleFr?: string
}

interface CategoryData {
  slug: string
  emoji: string
  orderIndex: number
  nameFr: string
  nameEn: string
  nameAr: string
  nameEs: string
  nameRu: string
  words: WordData[]
}

// ─────────────────────────────────────────────
// DONNÉES — 18 catégories, mots EN avec traductions
// ─────────────────────────────────────────────

const CATEGORIES: CategoryData[] = [

  {
    slug: 'greetings', emoji: '👋', orderIndex: 1,
    nameFr: 'Salutations', nameEn: 'Greetings', nameAr: 'تحيات', nameEs: 'Saludos', nameRu: 'Приветствия',
    words: [
      { term: 'Hello',             phonetic: '/həˈloʊ/',           difficulty: Difficulty.BEGINNER,     translationFr: 'Bonjour',                translationAr: 'مرحبا',              translationEs: 'Hola',              translationRu: 'Привет' },
      { term: 'Good morning',      phonetic: '/ɡʊd ˈmɔːnɪŋ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Bonjour',                translationAr: 'صباح الخير',         translationEs: 'Buenos días',       translationRu: 'Доброе утро' },
      { term: 'Good evening',      phonetic: '/ɡʊd ˈiːvnɪŋ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Bonsoir',                translationAr: 'مساء الخير',         translationEs: 'Buenas noches',     translationRu: 'Добрый вечер' },
      { term: 'Good night',        phonetic: '/ɡʊd naɪt/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Bonne nuit',             translationAr: 'تصبح على خير',       translationEs: 'Buenas noches',     translationRu: 'Спокойной ночи' },
      { term: 'Goodbye',           phonetic: '/ɡʊdˈbaɪ/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Au revoir',              translationAr: 'وداعا',              translationEs: 'Adiós',             translationRu: 'До свидания' },
      { term: 'See you later',     phonetic: '/siː juː ˈleɪtər/',  difficulty: Difficulty.BEGINNER,     translationFr: 'À plus tard',            translationAr: 'إلى اللقاء',         translationEs: 'Hasta luego',       translationRu: 'До скорого' },
      { term: 'Thank you',         phonetic: '/θæŋk juː/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Merci',                  translationAr: 'شكرا',               translationEs: 'Gracias',           translationRu: 'Спасибо' },
      { term: 'Please',            phonetic: '/pliːz/',             difficulty: Difficulty.BEGINNER,     translationFr: 'S\'il vous plaît',       translationAr: 'من فضلك',            translationEs: 'Por favor',         translationRu: 'Пожалуйста' },
      { term: 'Sorry',             phonetic: '/ˈsɒri/',             difficulty: Difficulty.BEGINNER,     translationFr: 'Désolé',                 translationAr: 'آسف',                translationEs: 'Lo siento',         translationRu: 'Извините' },
      { term: 'Excuse me',         phonetic: '/ɪkˈskjuːz miː/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Excusez-moi',            translationAr: 'عفوا',               translationEs: 'Disculpe',          translationRu: 'Простите' },
      { term: 'You\'re welcome',   phonetic: '/jɔːr ˈwɛlkəm/',     difficulty: Difficulty.BEGINNER,     translationFr: 'De rien',                translationAr: 'عفوا',               translationEs: 'De nada',           translationRu: 'Пожалуйста' },
      { term: 'How are you?',      phonetic: '/haʊ ɑːr juː/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Comment allez-vous ?',   translationAr: 'كيف حالك؟',          translationEs: '¿Cómo estás?',     translationRu: 'Как дела?' },
      { term: 'I\'m fine',         phonetic: '/aɪm faɪn/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Je vais bien',           translationAr: 'أنا بخير',           translationEs: 'Estoy bien',        translationRu: 'Я в порядке' },
      { term: 'Nice to meet you',  phonetic: '/naɪs tə miːt juː/', difficulty: Difficulty.BEGINNER,     translationFr: 'Enchanté',               translationAr: 'يسعدني لقاؤك',      translationEs: 'Encantado',         translationRu: 'Приятно познакомиться' },
      { term: 'My name is',        phonetic: '/maɪ neɪm ɪz/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Je m\'appelle',          translationAr: 'اسمي',               translationEs: 'Me llamo',          translationRu: 'Меня зовут' },
      { term: 'Welcome',           phonetic: '/ˈwɛlkəm/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Bienvenue',              translationAr: 'أهلا وسهلا',         translationEs: 'Bienvenido',        translationRu: 'Добро пожаловать' },
      { term: 'Happy birthday',    phonetic: '/ˈhæpi ˈbɜːrθdeɪ/', difficulty: Difficulty.BEGINNER,     translationFr: 'Joyeux anniversaire',    translationAr: 'عيد ميلاد سعيد',    translationEs: 'Feliz cumpleaños', translationRu: 'С днём рождения' },
      { term: 'Congratulations',   phonetic: '/kənˌɡrætʃʊˈleɪʃənz/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Félicitations',       translationAr: 'مبروك',              translationEs: 'Felicitaciones',    translationRu: 'Поздравляю' },
      { term: 'Yes',               phonetic: '/jɛs/',               difficulty: Difficulty.BEGINNER,     translationFr: 'Oui',                    translationAr: 'نعم',                translationEs: 'Sí',                translationRu: 'Да' },
      { term: 'No',                phonetic: '/noʊ/',               difficulty: Difficulty.BEGINNER,     translationFr: 'Non',                    translationAr: 'لا',                 translationEs: 'No',                translationRu: 'Нет' },
      { term: 'Maybe',             phonetic: '/ˈmeɪbi/',            difficulty: Difficulty.BEGINNER,     translationFr: 'Peut-être',              translationAr: 'ربما',               translationEs: 'Quizás',            translationRu: 'Может быть' },
      { term: 'Of course',         phonetic: '/əv kɔːrs/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Bien sûr',               translationAr: 'بالطبع',             translationEs: 'Por supuesto',      translationRu: 'Конечно' },
      { term: 'I don\'t know',     phonetic: '/aɪ doʊnt noʊ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Je ne sais pas',         translationAr: 'لا أعلم',            translationEs: 'No lo sé',          translationRu: 'Я не знаю' },
      { term: 'I understand',      phonetic: '/aɪ ˌʌndəˈstænd/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Je comprends',           translationAr: 'أفهم',               translationEs: 'Entiendo',          translationRu: 'Я понимаю' },
      { term: 'Can you help me?',  phonetic: '/kæn juː hɛlp miː/', difficulty: Difficulty.BEGINNER,     translationFr: 'Pouvez-vous m\'aider ?', translationAr: 'هل يمكنك مساعدتي؟', translationEs: '¿Puede ayudarme?',  translationRu: 'Можете помочь?' },
      { term: 'I\'m lost',         phonetic: '/aɪm lɒst/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Je suis perdu',          translationAr: 'أنا ضائع',           translationEs: 'Estoy perdido',     translationRu: 'Я заблудился' },
      { term: 'Where is...?',      phonetic: '/wɛər ɪz/',           difficulty: Difficulty.BEGINNER,     translationFr: 'Où est... ?',            translationAr: 'أين يوجد...؟',       translationEs: '¿Dónde está...?',   translationRu: 'Где находится...?' },
      { term: 'How much?',         phonetic: '/haʊ mʌtʃ/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Combien ?',              translationAr: 'بكم؟',               translationEs: '¿Cuánto cuesta?',   translationRu: 'Сколько стоит?' },
      { term: 'I don\'t speak...',  phonetic: '/aɪ doʊnt spiːk/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Je ne parle pas...',     translationAr: 'لا أتكلم...',        translationEs: 'No hablo...',       translationRu: 'Я не говорю...' },
      { term: 'Speak slowly please', phonetic: '/spiːk ˈsloʊli pliːz/', difficulty: Difficulty.BEGINNER, translationFr: 'Parlez lentement SVP',  translationAr: 'تكلم ببطء من فضلك', translationEs: 'Habla despacio',    translationRu: 'Говорите медленнее' },
    ]
  },

  {
    slug: 'family', emoji: '👨‍👩‍👧', orderIndex: 2,
    nameFr: 'Famille', nameEn: 'Family', nameAr: 'عائلة', nameEs: 'Familia', nameRu: 'Семья',
    words: [
      { term: 'Mother',        phonetic: '/ˈmʌðər/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Mère',           translationAr: 'أم',         translationEs: 'Madre',       translationRu: 'Мать' },
      { term: 'Father',        phonetic: '/ˈfɑːðər/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Père',           translationAr: 'أب',         translationEs: 'Padre',       translationRu: 'Отец' },
      { term: 'Brother',       phonetic: '/ˈbrʌðər/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Frère',          translationAr: 'أخ',         translationEs: 'Hermano',     translationRu: 'Брат' },
      { term: 'Sister',        phonetic: '/ˈsɪstər/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Sœur',           translationAr: 'أخت',        translationEs: 'Hermana',     translationRu: 'Сестра' },
      { term: 'Grandmother',   phonetic: '/ˈɡrænmʌðər/', difficulty: Difficulty.BEGINNER,    translationFr: 'Grand-mère',     translationAr: 'جدة',        translationEs: 'Abuela',      translationRu: 'Бабушка' },
      { term: 'Grandfather',   phonetic: '/ˈɡrænfɑːðər/', difficulty: Difficulty.BEGINNER,   translationFr: 'Grand-père',     translationAr: 'جد',         translationEs: 'Abuelo',      translationRu: 'Дедушка' },
      { term: 'Son',           phonetic: '/sʌn/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Fils',           translationAr: 'ابن',        translationEs: 'Hijo',        translationRu: 'Сын' },
      { term: 'Daughter',      phonetic: '/ˈdɔːtər/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Fille',          translationAr: 'ابنة',       translationEs: 'Hija',        translationRu: 'Дочь' },
      { term: 'Uncle',         phonetic: '/ˈʌŋkəl/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Oncle',          translationAr: 'عم',         translationEs: 'Tío',         translationRu: 'Дядя' },
      { term: 'Aunt',          phonetic: '/ɑːnt/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Tante',          translationAr: 'عمة',        translationEs: 'Tía',         translationRu: 'Тётя' },
      { term: 'Cousin',        phonetic: '/ˈkʌzən/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Cousin',         translationAr: 'ابن عم',     translationEs: 'Primo',       translationRu: 'Двоюродный брат' },
      { term: 'Husband',       phonetic: '/ˈhʌzbənd/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Mari',           translationAr: 'زوج',        translationEs: 'Marido',      translationRu: 'Муж' },
      { term: 'Wife',          phonetic: '/waɪf/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Femme',          translationAr: 'زوجة',       translationEs: 'Esposa',      translationRu: 'Жена' },
      { term: 'Baby',          phonetic: '/ˈbeɪbi/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Bébé',           translationAr: 'طفل رضيع',  translationEs: 'Bebé',        translationRu: 'Малыш' },
      { term: 'Child',         phonetic: '/tʃaɪld/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Enfant',         translationAr: 'طفل',        translationEs: 'Niño',        translationRu: 'Ребёнок' },
      { term: 'Parents',       phonetic: '/ˈpɛərənts/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Parents',        translationAr: 'والدان',     translationEs: 'Padres',      translationRu: 'Родители' },
      { term: 'Family',        phonetic: '/ˈfæməli/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Famille',        translationAr: 'عائلة',      translationEs: 'Familia',     translationRu: 'Семья' },
      { term: 'Nephew',        phonetic: '/ˈnɛfjuː/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Neveu',          translationAr: 'ابن الأخ',  translationEs: 'Sobrino',     translationRu: 'Племянник' },
      { term: 'Niece',         phonetic: '/niːs/',        difficulty: Difficulty.INTERMEDIATE, translationFr: 'Nièce',          translationAr: 'ابنة الأخ', translationEs: 'Sobrina',     translationRu: 'Племянница' },
      { term: 'Twins',         phonetic: '/twɪnz/',       difficulty: Difficulty.INTERMEDIATE, translationFr: 'Jumeaux',        translationAr: 'توأم',       translationEs: 'Gemelos',     translationRu: 'Близнецы' },
      { term: 'Godfather',     phonetic: '/ˈɡɒdfɑːðər/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Parrain',        translationAr: 'عراب',       translationEs: 'Padrino',     translationRu: 'Крёстный отец' },
      { term: 'Godmother',     phonetic: '/ˈɡɒdmʌðər/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Marraine',       translationAr: 'عرابة',      translationEs: 'Madrina',     translationRu: 'Крёстная мать' },
      { term: 'Stepfather',    phonetic: '/ˈstɛpfɑːðər/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Beau-père',     translationAr: 'زوج الأم',  translationEs: 'Padrastro',   translationRu: 'Отчим' },
      { term: 'Stepmother',    phonetic: '/ˈstɛpmʌðər/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Belle-mère',     translationAr: 'زوجة الأب', translationEs: 'Madrastra',   translationRu: 'Мачеха' },
      { term: 'Father-in-law', phonetic: '/ˈfɑːðər ɪn lɔː/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Beau-père', translationAr: 'حما',        translationEs: 'Suegro',      translationRu: 'Свёкор' },
      { term: 'Mother-in-law', phonetic: '/ˈmʌðər ɪn lɔː/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Belle-mère', translationAr: 'حماة',      translationEs: 'Suegra',      translationRu: 'Свекровь' },
      { term: 'Relative',      phonetic: '/ˈrɛlətɪv/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Parent',         translationAr: 'قريب',       translationEs: 'Pariente',    translationRu: 'Родственник' },
      { term: 'Only child',    phonetic: '/ˈoʊnli tʃaɪld/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Enfant unique', translationAr: 'طفل وحيد', translationEs: 'Hijo único',  translationRu: 'Единственный ребёнок' },
      { term: 'Eldest',        phonetic: '/ˈɛldɪst/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Aîné',           translationAr: 'الأكبر',    translationEs: 'El mayor',    translationRu: 'Старший' },
      { term: 'Youngest',      phonetic: '/ˈjʌŋɡɪst/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Cadet',          translationAr: 'الأصغر',    translationEs: 'El menor',    translationRu: 'Младший' },
    ]
  },

  {
    slug: 'food', emoji: '🍎', orderIndex: 3,
    nameFr: 'Nourriture', nameEn: 'Food', nameAr: 'طعام', nameEs: 'Comida', nameRu: 'Еда',
    words: [
      { term: 'Bread',       phonetic: '/brɛd/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Pain',          translationAr: 'خبز',     translationEs: 'Pan',        translationRu: 'Хлеб' },
      { term: 'Rice',        phonetic: '/raɪs/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Riz',           translationAr: 'أرز',     translationEs: 'Arroz',      translationRu: 'Рис' },
      { term: 'Meat',        phonetic: '/miːt/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Viande',        translationAr: 'لحم',     translationEs: 'Carne',      translationRu: 'Мясо' },
      { term: 'Chicken',     phonetic: '/ˈtʃɪkɪn/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Poulet',        translationAr: 'دجاج',    translationEs: 'Pollo',      translationRu: 'Курица' },
      { term: 'Fish',        phonetic: '/fɪʃ/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Poisson',       translationAr: 'سمك',     translationEs: 'Pescado',    translationRu: 'Рыба' },
      { term: 'Egg',         phonetic: '/ɛɡ/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Œuf',           translationAr: 'بيضة',    translationEs: 'Huevo',      translationRu: 'Яйцо' },
      { term: 'Cheese',      phonetic: '/tʃiːz/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Fromage',       translationAr: 'جبن',     translationEs: 'Queso',      translationRu: 'Сыр' },
      { term: 'Butter',      phonetic: '/ˈbʌtər/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Beurre',        translationAr: 'زبدة',    translationEs: 'Mantequilla', translationRu: 'Масло' },
      { term: 'Apple',       phonetic: '/ˈæpəl/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Pomme',         translationAr: 'تفاحة',   translationEs: 'Manzana',    translationRu: 'Яблоко' },
      { term: 'Banana',      phonetic: '/bəˈnɑːnə/', difficulty: Difficulty.BEGINNER,     translationFr: 'Banane',        translationAr: 'موزة',    translationEs: 'Plátano',    translationRu: 'Банан' },
      { term: 'Orange',      phonetic: '/ˈɒrɪndʒ/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Orange',        translationAr: 'برتقالة', translationEs: 'Naranja',    translationRu: 'Апельсин' },
      { term: 'Tomato',      phonetic: '/təˈmeɪtoʊ/', difficulty: Difficulty.BEGINNER,    translationFr: 'Tomate',        translationAr: 'طماطم',   translationEs: 'Tomate',     translationRu: 'Помидор' },
      { term: 'Potato',      phonetic: '/pəˈteɪtoʊ/', difficulty: Difficulty.BEGINNER,    translationFr: 'Pomme de terre', translationAr: 'بطاطا',  translationEs: 'Patata',     translationRu: 'Картофель' },
      { term: 'Onion',       phonetic: '/ˈʌnjən/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Oignon',        translationAr: 'بصل',     translationEs: 'Cebolla',    translationRu: 'Лук' },
      { term: 'Garlic',      phonetic: '/ˈɡɑːrlɪk/', difficulty: Difficulty.BEGINNER,     translationFr: 'Ail',           translationAr: 'ثوم',     translationEs: 'Ajo',        translationRu: 'Чеснок' },
      { term: 'Salt',        phonetic: '/sɔːlt/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Sel',           translationAr: 'ملح',     translationEs: 'Sal',        translationRu: 'Соль' },
      { term: 'Sugar',       phonetic: '/ˈʃʊɡər/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Sucre',         translationAr: 'سكر',     translationEs: 'Azúcar',     translationRu: 'Сахар' },
      { term: 'Soup',        phonetic: '/suːp/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Soupe',         translationAr: 'حساء',    translationEs: 'Sopa',       translationRu: 'Суп' },
      { term: 'Salad',       phonetic: '/ˈsæləd/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Salade',        translationAr: 'سلطة',    translationEs: 'Ensalada',   translationRu: 'Салат' },
      { term: 'Pasta',       phonetic: '/ˈpæstə/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Pâtes',         translationAr: 'معكرونة', translationEs: 'Pasta',      translationRu: 'Паста' },
      { term: 'Pizza',       phonetic: '/ˈpiːtsə/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Pizza',         translationAr: 'بيتزا',   translationEs: 'Pizza',      translationRu: 'Пицца' },
      { term: 'Cake',        phonetic: '/keɪk/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Gâteau',        translationAr: 'كعكة',    translationEs: 'Pastel',     translationRu: 'Торт' },
      { term: 'Chocolate',   phonetic: '/ˈtʃɒklət/', difficulty: Difficulty.BEGINNER,     translationFr: 'Chocolat',      translationAr: 'شوكولاتة', translationEs: 'Chocolate', translationRu: 'Шоколад' },
      { term: 'Ice cream',   phonetic: '/ˈaɪs kriːm/', difficulty: Difficulty.BEGINNER,   translationFr: 'Glace',         translationAr: 'آيس كريم', translationEs: 'Helado',    translationRu: 'Мороженое' },
      { term: 'Sandwich',    phonetic: '/ˈsænwɪdʒ/', difficulty: Difficulty.BEGINNER,     translationFr: 'Sandwich',      translationAr: 'ساندويش', translationEs: 'Sándwich',   translationRu: 'Бутерброд' },
      { term: 'Mushroom',    phonetic: '/ˈmʌʃruːm/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Champignon',    translationAr: 'فطر',     translationEs: 'Champiñón', translationRu: 'Гриб' },
      { term: 'Strawberry',  phonetic: '/ˈstrɔːbəri/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Fraise',      translationAr: 'فراولة',  translationEs: 'Fresa',      translationRu: 'Клубника' },
      { term: 'Lemon',       phonetic: '/ˈlɛmən/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Citron',        translationAr: 'ليمون',   translationEs: 'Limón',      translationRu: 'Лимон' },
      { term: 'Honey',       phonetic: '/ˈhʌni/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Miel',          translationAr: 'عسل',     translationEs: 'Miel',       translationRu: 'Мёд' },
      { term: 'Yogurt',      phonetic: '/ˈjoʊɡərt/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Yaourt',        translationAr: 'زبادي',   translationEs: 'Yogur',      translationRu: 'Йогурт' },
    ]
  },

  {
    slug: 'drinks', emoji: '🥤', orderIndex: 4,
    nameFr: 'Boissons', nameEn: 'Drinks', nameAr: 'مشروبات', nameEs: 'Bebidas', nameRu: 'Напитки',
    words: [
      { term: 'Water',         phonetic: '/ˈwɔːtər/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Eau',                translationAr: 'ماء',          translationEs: 'Agua',            translationRu: 'Вода' },
      { term: 'Coffee',        phonetic: '/ˈkɒfi/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Café',               translationAr: 'قهوة',         translationEs: 'Café',            translationRu: 'Кофе' },
      { term: 'Tea',           phonetic: '/tiː/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Thé',                translationAr: 'شاي',          translationEs: 'Té',              translationRu: 'Чай' },
      { term: 'Milk',          phonetic: '/mɪlk/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Lait',               translationAr: 'حليب',         translationEs: 'Leche',           translationRu: 'Молоко' },
      { term: 'Juice',         phonetic: '/dʒuːs/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Jus',                translationAr: 'عصير',         translationEs: 'Jugo',            translationRu: 'Сок' },
      { term: 'Beer',          phonetic: '/bɪər/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Bière',              translationAr: 'بيرة',         translationEs: 'Cerveza',         translationRu: 'Пиво' },
      { term: 'Wine',          phonetic: '/waɪn/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Vin',                translationAr: 'نبيذ',         translationEs: 'Vino',            translationRu: 'Вино' },
      { term: 'Sparkling water', phonetic: '/ˈspɑːklɪŋ ˈwɔːtər/', difficulty: Difficulty.BEGINNER, translationFr: 'Eau pétillante', translationAr: 'ماء فوار',    translationEs: 'Agua con gas',    translationRu: 'Газированная вода' },
      { term: 'Hot chocolate', phonetic: '/hɒt ˈtʃɒklət/', difficulty: Difficulty.BEGINNER,   translationFr: 'Chocolat chaud',     translationAr: 'شوكولاتة ساخنة', translationEs: 'Chocolate caliente', translationRu: 'Горячий шоколад' },
      { term: 'Lemonade',      phonetic: '/ˌlɛməˈneɪd/', difficulty: Difficulty.BEGINNER,     translationFr: 'Limonade',           translationAr: 'ليموناضة',     translationEs: 'Limonada',        translationRu: 'Лимонад' },
      { term: 'Soda',          phonetic: '/ˈsoʊdə/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Soda',               translationAr: 'مياه غازية',   translationEs: 'Refresco',        translationRu: 'Газировка' },
      { term: 'Smoothie',      phonetic: '/ˈsmuːði/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Smoothie',           translationAr: 'عصير مثلج',    translationEs: 'Batido',          translationRu: 'Смузи' },
      { term: 'Espresso',      phonetic: '/ɛˈsprɛsoʊ/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Expresso',           translationAr: 'إسبريسو',      translationEs: 'Espresso',        translationRu: 'Эспрессо' },
      { term: 'Cappuccino',    phonetic: '/ˌkæpʊˈtʃiːnoʊ/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Cappuccino',      translationAr: 'كابتشينو',     translationEs: 'Capuchino',       translationRu: 'Капучино' },
      { term: 'Herbal tea',    phonetic: '/ˈhɜːrbəl tiː/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Tisane',            translationAr: 'شاي أعشاب',    translationEs: 'Infusión',        translationRu: 'Травяной чай' },
      { term: 'Milkshake',     phonetic: '/ˈmɪlkʃeɪk/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Milkshake',          translationAr: 'ميلك شيك',     translationEs: 'Batido de leche', translationRu: 'Молочный коктейль' },
      { term: 'Champagne',     phonetic: '/ʃæmˈpeɪn/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Champagne',          translationAr: 'شمبانيا',      translationEs: 'Champán',         translationRu: 'Шампанское' },
      { term: 'Whisky',        phonetic: '/ˈwɪski/',      difficulty: Difficulty.INTERMEDIATE, translationFr: 'Whisky',             translationAr: 'ويسكي',        translationEs: 'Whisky',          translationRu: 'Виски' },
      { term: 'Vodka',         phonetic: '/ˈvɒdkə/',      difficulty: Difficulty.INTERMEDIATE, translationFr: 'Vodka',              translationAr: 'فودكا',        translationEs: 'Vodka',           translationRu: 'Водка' },
      { term: 'Rum',           phonetic: '/rʌm/',         difficulty: Difficulty.INTERMEDIATE, translationFr: 'Rhum',               translationAr: 'روم',          translationEs: 'Ron',             translationRu: 'Ром' },
      { term: 'Iced tea',      phonetic: '/ˈaɪst tiː/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Thé glacé',          translationAr: 'شاي مثلج',     translationEs: 'Té helado',       translationRu: 'Холодный чай' },
      { term: 'Green tea',     phonetic: '/ɡriːn tiː/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Thé vert',           translationAr: 'شاي أخضر',     translationEs: 'Té verde',        translationRu: 'Зелёный чай' },
      { term: 'Black tea',     phonetic: '/blæk tiː/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Thé noir',           translationAr: 'شاي أسود',     translationEs: 'Té negro',        translationRu: 'Чёрный чай' },
      { term: 'Apple juice',   phonetic: '/ˈæpəl dʒuːs/', difficulty: Difficulty.BEGINNER,    translationFr: 'Jus de pomme',       translationAr: 'عصير تفاح',    translationEs: 'Zumo de manzana', translationRu: 'Яблочный сок' },
      { term: 'Mineral water', phonetic: '/ˈmɪnərəl ˈwɔːtər/', difficulty: Difficulty.BEGINNER, translationFr: 'Eau minérale',     translationAr: 'مياه معدنية',  translationEs: 'Agua mineral',    translationRu: 'Минеральная вода' },
      { term: 'Coconut water', phonetic: '/ˈkoʊkənʌt ˈwɔːtər/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Eau de coco', translationAr: 'ماء جوز الهند', translationEs: 'Agua de coco',  translationRu: 'Кокосовая вода' },
      { term: 'Energy drink',  phonetic: '/ˈɛnərʤi drɪŋk/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Boisson énergisante', translationAr: 'مشروب طاقة', translationEs: 'Bebida energética', translationRu: 'Энергетик' },
      { term: 'Cocktail',      phonetic: '/ˈkɒkteɪl/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Cocktail',           translationAr: 'كوكتيل',       translationEs: 'Cóctel',          translationRu: 'Коктейль' },
      { term: 'Gin',           phonetic: '/dʒɪn/',        difficulty: Difficulty.INTERMEDIATE, translationFr: 'Gin',                translationAr: 'جن',           translationEs: 'Ginebra',         translationRu: 'Джин' },
      { term: 'Tomato juice',  phonetic: '/təˈmeɪtoʊ dʒuːs/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Jus de tomate',  translationAr: 'عصير طماطم',  translationEs: 'Zumo de tomate',  translationRu: 'Томатный сок' },
    ]
  },

  {
    slug: 'home', emoji: '🏠', orderIndex: 5,
    nameFr: 'Maison', nameEn: 'Home', nameAr: 'المنزل', nameEs: 'Hogar', nameRu: 'Дом',
    words: [
      { term: 'House',          phonetic: '/haʊs/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Maison',           translationAr: 'منزل',         translationEs: 'Casa',          translationRu: 'Дом' },
      { term: 'Apartment',      phonetic: '/əˈpɑːrtmənt/', difficulty: Difficulty.BEGINNER,     translationFr: 'Appartement',      translationAr: 'شقة',          translationEs: 'Apartamento',   translationRu: 'Квартира' },
      { term: 'Kitchen',        phonetic: '/ˈkɪtʃɪn/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Cuisine',          translationAr: 'مطبخ',         translationEs: 'Cocina',        translationRu: 'Кухня' },
      { term: 'Bedroom',        phonetic: '/ˈbɛdruːm/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Chambre',          translationAr: 'غرفة نوم',     translationEs: 'Dormitorio',    translationRu: 'Спальня' },
      { term: 'Bathroom',       phonetic: '/ˈbɑːθruːm/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Salle de bain',    translationAr: 'حمام',         translationEs: 'Cuarto de baño', translationRu: 'Ванная' },
      { term: 'Living room',    phonetic: '/ˈlɪvɪŋ ruːm/', difficulty: Difficulty.BEGINNER,     translationFr: 'Salon',            translationAr: 'غرفة المعيشة', translationEs: 'Sala de estar', translationRu: 'Гостиная' },
      { term: 'Door',           phonetic: '/dɔːr/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Porte',            translationAr: 'باب',          translationEs: 'Puerta',        translationRu: 'Дверь' },
      { term: 'Window',         phonetic: '/ˈwɪndoʊ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Fenêtre',          translationAr: 'نافذة',        translationEs: 'Ventana',       translationRu: 'Окно' },
      { term: 'Table',          phonetic: '/ˈteɪbəl/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Table',            translationAr: 'طاولة',        translationEs: 'Mesa',          translationRu: 'Стол' },
      { term: 'Chair',          phonetic: '/tʃɛər/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Chaise',           translationAr: 'كرسي',         translationEs: 'Silla',         translationRu: 'Стул' },
      { term: 'Bed',            phonetic: '/bɛd/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Lit',              translationAr: 'سرير',         translationEs: 'Cama',          translationRu: 'Кровать' },
      { term: 'Sofa',           phonetic: '/ˈsoʊfə/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Canapé',           translationAr: 'أريكة',        translationEs: 'Sofá',          translationRu: 'Диван' },
      { term: 'Fridge',         phonetic: '/frɪdʒ/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Réfrigérateur',    translationAr: 'ثلاجة',        translationEs: 'Nevera',        translationRu: 'Холодильник' },
      { term: 'Oven',           phonetic: '/ˈʌvən/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Four',             translationAr: 'فرن',          translationEs: 'Horno',         translationRu: 'Духовка' },
      { term: 'Television',     phonetic: '/ˈtɛlɪvɪʒən/', difficulty: Difficulty.BEGINNER,     translationFr: 'Télévision',       translationAr: 'تلفزيون',      translationEs: 'Televisión',    translationRu: 'Телевизор' },
      { term: 'Lamp',           phonetic: '/læmp/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Lampe',            translationAr: 'مصباح',        translationEs: 'Lámpara',       translationRu: 'Лампа' },
      { term: 'Mirror',         phonetic: '/ˈmɪrər/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Miroir',           translationAr: 'مرآة',         translationEs: 'Espejo',        translationRu: 'Зеркало' },
      { term: 'Curtain',        phonetic: '/ˈkɜːrtən/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Rideau',           translationAr: 'ستارة',        translationEs: 'Cortina',       translationRu: 'Занавеска' },
      { term: 'Carpet',         phonetic: '/ˈkɑːrpɪt/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Tapis',            translationAr: 'سجادة',        translationEs: 'Alfombra',      translationRu: 'Ковёр' },
      { term: 'Key',            phonetic: '/kiː/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Clé',              translationAr: 'مفتاح',        translationEs: 'Llave',         translationRu: 'Ключ' },
      { term: 'Stairs',         phonetic: '/stɛərz/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Escaliers',        translationAr: 'درج',          translationEs: 'Escaleras',     translationRu: 'Лестница' },
      { term: 'Garden',         phonetic: '/ˈɡɑːrdən/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Jardin',           translationAr: 'حديقة',        translationEs: 'Jardín',        translationRu: 'Сад' },
      { term: 'Garage',         phonetic: '/ˈɡærɑːʒ/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Garage',           translationAr: 'كراج',         translationEs: 'Garaje',        translationRu: 'Гараж' },
      { term: 'Balcony',        phonetic: '/ˈbælkəni/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Balcon',           translationAr: 'شرفة',         translationEs: 'Balcón',        translationRu: 'Балкон' },
      { term: 'Washing machine', phonetic: '/ˈwɒʃɪŋ məˈʃiːn/', difficulty: Difficulty.BEGINNER, translationFr: 'Machine à laver',  translationAr: 'غسالة',       translationEs: 'Lavadora',      translationRu: 'Стиральная машина' },
      { term: 'Microwave',      phonetic: '/ˈmaɪkrəweɪv/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Micro-ondes',     translationAr: 'ميكروويف',     translationEs: 'Microondas',    translationRu: 'Микроволновка' },
      { term: 'Dishwasher',     phonetic: '/ˈdɪʃwɒʃər/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Lave-vaisselle',   translationAr: 'غسالة أطباق', translationEs: 'Lavavajillas',  translationRu: 'Посудомоечная машина' },
      { term: 'Wardrobe',       phonetic: '/ˈwɔːrdroʊb/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Armoire',          translationAr: 'خزانة ملابس', translationEs: 'Armario',       translationRu: 'Шкаф' },
      { term: 'Shelf',          phonetic: '/ʃɛlf/',        difficulty: Difficulty.INTERMEDIATE, translationFr: 'Étagère',          translationAr: 'رف',           translationEs: 'Estante',       translationRu: 'Полка' },
      { term: 'Toilet',         phonetic: '/ˈtɔɪlɪt/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Toilettes',        translationAr: 'مرحاض',        translationEs: 'Inodoro',       translationRu: 'Туалет' },
    ]
  },

  {
    slug: 'body', emoji: '🫀', orderIndex: 6,
    nameFr: 'Corps humain', nameEn: 'Human body', nameAr: 'جسم الإنسان', nameEs: 'Cuerpo humano', nameRu: 'Тело человека',
    words: [
      { term: 'Head',      phonetic: '/hɛd/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Tête',       translationAr: 'رأس',   translationEs: 'Cabeza',   translationRu: 'Голова' },
      { term: 'Hair',      phonetic: '/hɛər/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Cheveux',    translationAr: 'شعر',   translationEs: 'Cabello',  translationRu: 'Волосы' },
      { term: 'Eye',       phonetic: '/aɪ/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Œil',        translationAr: 'عين',   translationEs: 'Ojo',      translationRu: 'Глаз' },
      { term: 'Ear',       phonetic: '/ɪər/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Oreille',    translationAr: 'أذن',   translationEs: 'Oreja',    translationRu: 'Ухо' },
      { term: 'Nose',      phonetic: '/noʊz/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Nez',        translationAr: 'أنف',   translationEs: 'Nariz',    translationRu: 'Нос' },
      { term: 'Mouth',     phonetic: '/maʊθ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Bouche',     translationAr: 'فم',    translationEs: 'Boca',     translationRu: 'Рот' },
      { term: 'Teeth',     phonetic: '/tiːθ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Dents',      translationAr: 'أسنان', translationEs: 'Dientes',  translationRu: 'Зубы' },
      { term: 'Hand',      phonetic: '/hænd/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Main',       translationAr: 'يد',    translationEs: 'Mano',     translationRu: 'Рука' },
      { term: 'Finger',    phonetic: '/ˈfɪŋɡər/', difficulty: Difficulty.BEGINNER,     translationFr: 'Doigt',      translationAr: 'إصبع',  translationEs: 'Dedo',     translationRu: 'Палец' },
      { term: 'Foot',      phonetic: '/fʊt/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Pied',       translationAr: 'قدم',   translationEs: 'Pie',      translationRu: 'Стопа' },
      { term: 'Leg',       phonetic: '/lɛɡ/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Jambe',      translationAr: 'ساق',   translationEs: 'Pierna',   translationRu: 'Нога' },
      { term: 'Arm',       phonetic: '/ɑːrm/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Bras',       translationAr: 'ذراع',  translationEs: 'Brazo',    translationRu: 'Рука' },
      { term: 'Shoulder',  phonetic: '/ˈʃoʊldər/', difficulty: Difficulty.BEGINNER,    translationFr: 'Épaule',     translationAr: 'كتف',   translationEs: 'Hombro',   translationRu: 'Плечо' },
      { term: 'Chest',     phonetic: '/tʃɛst/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Poitrine',   translationAr: 'صدر',   translationEs: 'Pecho',    translationRu: 'Грудь' },
      { term: 'Back',      phonetic: '/bæk/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Dos',        translationAr: 'ظهر',   translationEs: 'Espalda',  translationRu: 'Спина' },
      { term: 'Heart',     phonetic: '/hɑːrt/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Cœur',       translationAr: 'قلب',   translationEs: 'Corazón',  translationRu: 'Сердце' },
      { term: 'Brain',     phonetic: '/breɪn/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Cerveau',    translationAr: 'دماغ',  translationEs: 'Cerebro',  translationRu: 'Мозг' },
      { term: 'Knee',      phonetic: '/niː/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Genou',      translationAr: 'ركبة',  translationEs: 'Rodilla',  translationRu: 'Колено' },
      { term: 'Elbow',     phonetic: '/ˈɛlboʊ/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Coude',      translationAr: 'كوع',   translationEs: 'Codo',     translationRu: 'Локоть' },
      { term: 'Throat',    phonetic: '/θroʊt/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Gorge',      translationAr: 'حلق',   translationEs: 'Garganta', translationRu: 'Горло' },
      { term: 'Stomach',   phonetic: '/ˈstʌmək/', difficulty: Difficulty.BEGINNER,     translationFr: 'Estomac',    translationAr: 'معدة',  translationEs: 'Estómago', translationRu: 'Желудок' },
      { term: 'Skin',      phonetic: '/skɪn/',     difficulty: Difficulty.INTERMEDIATE, translationFr: 'Peau',       translationAr: 'جلد',   translationEs: 'Piel',     translationRu: 'Кожа' },
      { term: 'Bone',      phonetic: '/boʊn/',     difficulty: Difficulty.INTERMEDIATE, translationFr: 'Os',         translationAr: 'عظم',   translationEs: 'Hueso',    translationRu: 'Кость' },
      { term: 'Blood',     phonetic: '/blʌd/',     difficulty: Difficulty.INTERMEDIATE, translationFr: 'Sang',       translationAr: 'دم',    translationEs: 'Sangre',   translationRu: 'Кровь' },
      { term: 'Lung',      phonetic: '/lʌŋ/',      difficulty: Difficulty.INTERMEDIATE, translationFr: 'Poumon',     translationAr: 'رئة',   translationEs: 'Pulmón',   translationRu: 'Лёгкое' },
      { term: 'Liver',     phonetic: '/ˈlɪvər/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Foie',       translationAr: 'كبد',   translationEs: 'Hígado',   translationRu: 'Печень' },
      { term: 'Kidney',    phonetic: '/ˈkɪdni/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Rein',       translationAr: 'كلية',  translationEs: 'Riñón',    translationRu: 'Почка' },
      { term: 'Neck',      phonetic: '/nɛk/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Cou',        translationAr: 'رقبة',  translationEs: 'Cuello',   translationRu: 'Шея' },
      { term: 'Chin',      phonetic: '/tʃɪn/',     difficulty: Difficulty.INTERMEDIATE, translationFr: 'Menton',     translationAr: 'ذقن',   translationEs: 'Barbilla', translationRu: 'Подбородок' },
      { term: 'Forehead',  phonetic: '/ˈfɔːrhɛd/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Front',     translationAr: 'جبهة',  translationEs: 'Frente',   translationRu: 'Лоб' },
    ]
  },

  {
    slug: 'clothes', emoji: '👕', orderIndex: 7,
    nameFr: 'Vêtements', nameEn: 'Clothes', nameAr: 'ملابس', nameEs: 'Ropa', nameRu: 'Одежда',
    words: [
      { term: 'Shirt',      phonetic: '/ʃɜːrt/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Chemise',        translationAr: 'قميص',       translationEs: 'Camisa',        translationRu: 'Рубашка' },
      { term: 'T-shirt',    phonetic: '/ˈtiːʃɜːrt/', difficulty: Difficulty.BEGINNER,   translationFr: 'T-shirt',        translationAr: 'تيشيرت',     translationEs: 'Camiseta',      translationRu: 'Футболка' },
      { term: 'Trousers',   phonetic: '/ˈtraʊzərz/', difficulty: Difficulty.BEGINNER,   translationFr: 'Pantalon',       translationAr: 'بنطلون',     translationEs: 'Pantalones',    translationRu: 'Брюки' },
      { term: 'Jeans',      phonetic: '/dʒiːnz/',    difficulty: Difficulty.BEGINNER,   translationFr: 'Jean',           translationAr: 'جينز',       translationEs: 'Vaqueros',      translationRu: 'Джинсы' },
      { term: 'Dress',      phonetic: '/drɛs/',      difficulty: Difficulty.BEGINNER,   translationFr: 'Robe',           translationAr: 'فستان',      translationEs: 'Vestido',       translationRu: 'Платье' },
      { term: 'Skirt',      phonetic: '/skɜːrt/',    difficulty: Difficulty.BEGINNER,   translationFr: 'Jupe',           translationAr: 'تنورة',      translationEs: 'Falda',         translationRu: 'Юбка' },
      { term: 'Jacket',     phonetic: '/ˈdʒækɪt/',  difficulty: Difficulty.BEGINNER,   translationFr: 'Veste',          translationAr: 'جاكيت',      translationEs: 'Chaqueta',      translationRu: 'Куртка' },
      { term: 'Coat',       phonetic: '/koʊt/',      difficulty: Difficulty.BEGINNER,   translationFr: 'Manteau',        translationAr: 'معطف',       translationEs: 'Abrigo',        translationRu: 'Пальто' },
      { term: 'Shoes',      phonetic: '/ʃuːz/',      difficulty: Difficulty.BEGINNER,   translationFr: 'Chaussures',     translationAr: 'حذاء',       translationEs: 'Zapatos',       translationRu: 'Обувь' },
      { term: 'Boots',      phonetic: '/buːts/',     difficulty: Difficulty.BEGINNER,   translationFr: 'Bottes',         translationAr: 'أحذية طويلة', translationEs: 'Botas',        translationRu: 'Сапоги' },
      { term: 'Socks',      phonetic: '/sɒks/',      difficulty: Difficulty.BEGINNER,   translationFr: 'Chaussettes',    translationAr: 'جوارب',      translationEs: 'Calcetines',    translationRu: 'Носки' },
      { term: 'Hat',        phonetic: '/hæt/',       difficulty: Difficulty.BEGINNER,   translationFr: 'Chapeau',        translationAr: 'قبعة',       translationEs: 'Sombrero',      translationRu: 'Шляпа' },
      { term: 'Scarf',      phonetic: '/skɑːrf/',    difficulty: Difficulty.BEGINNER,   translationFr: 'Écharpe',        translationAr: 'وشاح',       translationEs: 'Bufanda',       translationRu: 'Шарф' },
      { term: 'Gloves',     phonetic: '/ɡlʌvz/',     difficulty: Difficulty.BEGINNER,   translationFr: 'Gants',          translationAr: 'قفازات',     translationEs: 'Guantes',       translationRu: 'Перчатки' },
      { term: 'Suit',       phonetic: '/suːt/',      difficulty: Difficulty.INTERMEDIATE, translationFr: 'Costume',       translationAr: 'بدلة',       translationEs: 'Traje',         translationRu: 'Костюм' },
      { term: 'Tie',        phonetic: '/taɪ/',       difficulty: Difficulty.BEGINNER,   translationFr: 'Cravate',        translationAr: 'ربطة عنق',   translationEs: 'Corbata',       translationRu: 'Галстук' },
      { term: 'Belt',       phonetic: '/bɛlt/',      difficulty: Difficulty.BEGINNER,   translationFr: 'Ceinture',       translationAr: 'حزام',       translationEs: 'Cinturón',      translationRu: 'Ремень' },
      { term: 'Underwear',  phonetic: '/ˈʌndərwɛər/', difficulty: Difficulty.BEGINNER, translationFr: 'Sous-vêtements', translationAr: 'ملابس داخلية', translationEs: 'Ropa interior', translationRu: 'Нижнее бельё' },
      { term: 'Pyjamas',    phonetic: '/pəˈdʒɑːməz/', difficulty: Difficulty.BEGINNER, translationFr: 'Pyjama',         translationAr: 'بيجامة',     translationEs: 'Pijama',        translationRu: 'Пижама' },
      { term: 'Raincoat',   phonetic: '/ˈreɪnkoʊt/', difficulty: Difficulty.BEGINNER,  translationFr: 'Imperméable',    translationAr: 'معطف مطر',   translationEs: 'Impermeable',   translationRu: 'Плащ' },
      { term: 'Swimsuit',   phonetic: '/ˈswɪmsuːt/', difficulty: Difficulty.BEGINNER,  translationFr: 'Maillot de bain', translationAr: 'لباس سباحة', translationEs: 'Bañador',      translationRu: 'Купальник' },
      { term: 'Trainers',   phonetic: '/ˈtreɪnərz/', difficulty: Difficulty.BEGINNER,  translationFr: 'Baskets',        translationAr: 'حذاء رياضي', translationEs: 'Zapatillas',   translationRu: 'Кроссовки' },
      { term: 'Jumper',     phonetic: '/ˈdʒʌmpər/',  difficulty: Difficulty.BEGINNER,  translationFr: 'Pull',           translationAr: 'بلوزة',      translationEs: 'Suéter',        translationRu: 'Свитер' },
      { term: 'Hoodie',     phonetic: '/ˈhʊdi/',     difficulty: Difficulty.BEGINNER,  translationFr: 'Sweat à capuche', translationAr: 'هودي',      translationEs: 'Sudadera',      translationRu: 'Худи' },
      { term: 'Sandals',    phonetic: '/ˈsændəlz/',  difficulty: Difficulty.BEGINNER,  translationFr: 'Sandales',       translationAr: 'صندل',       translationEs: 'Sandalias',     translationRu: 'Сандалии' },
      { term: 'Cap',        phonetic: '/kæp/',        difficulty: Difficulty.BEGINNER,  translationFr: 'Casquette',      translationAr: 'كاب',        translationEs: 'Gorra',         translationRu: 'Кепка' },
      { term: 'Sunglasses', phonetic: '/ˈsʌnɡlæsɪz/', difficulty: Difficulty.BEGINNER, translationFr: 'Lunettes de soleil', translationAr: 'نظارات شمسية', translationEs: 'Gafas de sol', translationRu: 'Солнечные очки' },
      { term: 'Handbag',    phonetic: '/ˈhændbæɡ/',  difficulty: Difficulty.BEGINNER,  translationFr: 'Sac à main',     translationAr: 'حقيبة يد',  translationEs: 'Bolso',         translationRu: 'Сумочка' },
      { term: 'Cardigan',   phonetic: '/ˈkɑːrdɪɡən/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Gilet',       translationAr: 'كارديجان',   translationEs: 'Cárdigan',      translationRu: 'Кардиган' },
      { term: 'Leggings',   phonetic: '/ˈlɛɡɪŋz/',   difficulty: Difficulty.BEGINNER,  translationFr: 'Leggings',       translationAr: 'لغنز',       translationEs: 'Mallas',        translationRu: 'Леггинсы' },
    ]
  },

  {
    slug: 'transport', emoji: '🚗', orderIndex: 8,
    nameFr: 'Transports', nameEn: 'Transport', nameAr: 'المواصلات', nameEs: 'Transporte', nameRu: 'Транспорт',
    words: [
      { term: 'Car',           phonetic: '/kɑːr/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Voiture',            translationAr: 'سيارة',       translationEs: 'Coche',         translationRu: 'Машина' },
      { term: 'Bus',           phonetic: '/bʌs/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Bus',                translationAr: 'حافلة',       translationEs: 'Autobús',       translationRu: 'Автобус' },
      { term: 'Train',         phonetic: '/treɪn/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Train',              translationAr: 'قطار',        translationEs: 'Tren',          translationRu: 'Поезд' },
      { term: 'Aeroplane',     phonetic: '/ˈɛərəpleɪn/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Avion',              translationAr: 'طائرة',       translationEs: 'Avión',         translationRu: 'Самолёт' },
      { term: 'Bicycle',       phonetic: '/ˈbaɪsɪkəl/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Vélo',               translationAr: 'دراجة',       translationEs: 'Bicicleta',     translationRu: 'Велосипед' },
      { term: 'Motorcycle',    phonetic: '/ˈmoʊtərˌsaɪkəl/', difficulty: Difficulty.BEGINNER, translationFr: 'Moto',               translationAr: 'دراجة نارية', translationEs: 'Moto',          translationRu: 'Мотоцикл' },
      { term: 'Taxi',          phonetic: '/ˈtæksi/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Taxi',               translationAr: 'تاكسي',       translationEs: 'Taxi',          translationRu: 'Такси' },
      { term: 'Boat',          phonetic: '/boʊt/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Bateau',             translationAr: 'قارب',        translationEs: 'Barco',         translationRu: 'Лодка' },
      { term: 'Subway',        phonetic: '/ˈsʌbweɪ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Métro',              translationAr: 'مترو',        translationEs: 'Metro',         translationRu: 'Метро' },
      { term: 'Lorry',         phonetic: '/ˈlɒri/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Camion',             translationAr: 'شاحنة',       translationEs: 'Camión',        translationRu: 'Грузовик' },
      { term: 'Helicopter',    phonetic: '/ˈhɛlɪkɒptər/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Hélicoptère',        translationAr: 'طائرة مروحية', translationEs: 'Helicóptero',  translationRu: 'Вертолёт' },
      { term: 'Ship',          phonetic: '/ʃɪp/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Navire',             translationAr: 'سفينة',       translationEs: 'Buque',         translationRu: 'Корабль' },
      { term: 'Tram',          phonetic: '/træm/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Tramway',            translationAr: 'ترام',        translationEs: 'Tranvía',       translationRu: 'Трамвай' },
      { term: 'Ambulance',     phonetic: '/ˈæmbjʊləns/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Ambulance',          translationAr: 'سيارة إسعاف', translationEs: 'Ambulancia',   translationRu: 'Скорая помощь' },
      { term: 'Scooter',       phonetic: '/ˈskuːtər/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Scooter',            translationAr: 'سكوتر',       translationEs: 'Scooter',       translationRu: 'Скутер' },
      { term: 'Van',           phonetic: '/væn/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Fourgonnette',       translationAr: 'فان',         translationEs: 'Furgoneta',     translationRu: 'Фургон' },
      { term: 'Station',       phonetic: '/ˈsteɪʃən/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Gare',               translationAr: 'محطة',        translationEs: 'Estación',      translationRu: 'Вокзал' },
      { term: 'Airport',       phonetic: '/ˈɛərpɔːrt/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Aéroport',           translationAr: 'مطار',        translationEs: 'Aeropuerto',    translationRu: 'Аэропорт' },
      { term: 'Ticket',        phonetic: '/ˈtɪkɪt/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Billet',             translationAr: 'تذكرة',       translationEs: 'Billete',       translationRu: 'Билет' },
      { term: 'Petrol',        phonetic: '/ˈpɛtrəl/',     difficulty: Difficulty.INTERMEDIATE, translationFr: 'Essence',            translationAr: 'بنزين',       translationEs: 'Gasolina',      translationRu: 'Бензин' },
      { term: 'Road',          phonetic: '/roʊd/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Route',              translationAr: 'طريق',        translationEs: 'Carretera',     translationRu: 'Дорога' },
      { term: 'Traffic jam',   phonetic: '/ˈtræfɪk dʒæm/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Embouteillage',     translationAr: 'ازدحام مروري', translationEs: 'Atasco',       translationRu: 'Пробка' },
      { term: 'Seatbelt',      phonetic: '/ˈsiːtbɛlt/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Ceinture de sécurité', translationAr: 'حزام الأمان', translationEs: 'Cinturón de seguridad', translationRu: 'Ремень безопасности' },
      { term: 'Parking',       phonetic: '/ˈpɑːrkɪŋ/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Parking',            translationAr: 'موقف سيارات', translationEs: 'Aparcamiento',  translationRu: 'Парковка' },
      { term: 'Motorway',      phonetic: '/ˈmoʊtərweɪ/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Autoroute',          translationAr: 'طريق سريع',  translationEs: 'Autopista',     translationRu: 'Автострада' },
      { term: 'Traffic light', phonetic: '/ˈtræfɪk laɪt/', difficulty: Difficulty.BEGINNER,  translationFr: 'Feu tricolore',      translationAr: 'إشارة مرور', translationEs: 'Semáforo',      translationRu: 'Светофор' },
      { term: 'Roundabout',    phonetic: '/ˈraʊndəbaʊt/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Rond-point',         translationAr: 'دوار',        translationEs: 'Rotonda',       translationRu: 'Кольцевая дорога' },
      { term: 'Crossroads',    phonetic: '/ˈkrɒsroʊdz/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Carrefour',          translationAr: 'تقاطع طرق',  translationEs: 'Cruce',         translationRu: 'Перекрёсток' },
      { term: 'Petrol station', phonetic: '/ˈpɛtrəl ˈsteɪʃən/', difficulty: Difficulty.BEGINNER, translationFr: 'Station-service', translationAr: 'محطة وقود',  translationEs: 'Gasolinera',    translationRu: 'Заправка' },
      { term: 'Driving licence', phonetic: '/ˈdraɪvɪŋ ˈlaɪsəns/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Permis de conduire', translationAr: 'رخصة قيادة', translationEs: 'Carnet de conducir', translationRu: 'Права' },
    ]
  },

  {
    slug: 'weather', emoji: '☀️', orderIndex: 9,
    nameFr: 'Météo', nameEn: 'Weather', nameAr: 'الطقس', nameEs: 'Tiempo', nameRu: 'Погода',
    words: [
      { term: 'Sun',         phonetic: '/sʌn/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Soleil',        translationAr: 'شمس',      translationEs: 'Sol',         translationRu: 'Солнце' },
      { term: 'Rain',        phonetic: '/reɪn/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Pluie',         translationAr: 'مطر',      translationEs: 'Lluvia',      translationRu: 'Дождь' },
      { term: 'Snow',        phonetic: '/snoʊ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Neige',         translationAr: 'ثلج',      translationEs: 'Nieve',       translationRu: 'Снег' },
      { term: 'Wind',        phonetic: '/wɪnd/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Vent',          translationAr: 'رياح',     translationEs: 'Viento',      translationRu: 'Ветер' },
      { term: 'Cloud',       phonetic: '/klaʊd/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Nuage',         translationAr: 'سحابة',    translationEs: 'Nube',        translationRu: 'Облако' },
      { term: 'Storm',       phonetic: '/stɔːrm/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Tempête',       translationAr: 'عاصفة',    translationEs: 'Tormenta',    translationRu: 'Буря' },
      { term: 'Thunder',     phonetic: '/ˈθʌndər/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Tonnerre',      translationAr: 'رعد',      translationEs: 'Trueno',      translationRu: 'Гром' },
      { term: 'Lightning',   phonetic: '/ˈlaɪtnɪŋ/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Éclair',        translationAr: 'برق',      translationEs: 'Relámpago',   translationRu: 'Молния' },
      { term: 'Fog',         phonetic: '/fɒɡ/',      difficulty: Difficulty.INTERMEDIATE, translationFr: 'Brouillard',    translationAr: 'ضباب',     translationEs: 'Niebla',      translationRu: 'Туман' },
      { term: 'Hot',         phonetic: '/hɒt/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Chaud',         translationAr: 'حار',      translationEs: 'Caliente',    translationRu: 'Жарко' },
      { term: 'Cold',        phonetic: '/koʊld/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Froid',         translationAr: 'بارد',     translationEs: 'Frío',        translationRu: 'Холодно' },
      { term: 'Warm',        phonetic: '/wɔːrm/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Tiède/Chaud',   translationAr: 'دافئ',     translationEs: 'Cálido',      translationRu: 'Тепло' },
      { term: 'Cloudy',      phonetic: '/ˈklaʊdi/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Nuageux',       translationAr: 'غائم',     translationEs: 'Nublado',     translationRu: 'Облачно' },
      { term: 'Sunny',       phonetic: '/ˈsʌni/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Ensoleillé',    translationAr: 'مشمس',     translationEs: 'Soleado',     translationRu: 'Солнечно' },
      { term: 'Rainbow',     phonetic: '/ˈreɪnboʊ/', difficulty: Difficulty.BEGINNER,     translationFr: 'Arc-en-ciel',   translationAr: 'قوس قزح',  translationEs: 'Arcoíris',    translationRu: 'Радуга' },
      { term: 'Hail',        phonetic: '/heɪl/',     difficulty: Difficulty.INTERMEDIATE, translationFr: 'Grêle',         translationAr: 'بَرَد',    translationEs: 'Granizo',     translationRu: 'Град' },
      { term: 'Frost',       phonetic: '/frɒst/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Givre',         translationAr: 'صقيع',     translationEs: 'Escarcha',    translationRu: 'Мороз' },
      { term: 'Ice',         phonetic: '/aɪs/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Glace',         translationAr: 'جليد',     translationEs: 'Hielo',       translationRu: 'Лёд' },
      { term: 'Flood',       phonetic: '/flʌd/',     difficulty: Difficulty.INTERMEDIATE, translationFr: 'Inondation',    translationAr: 'فيضان',    translationEs: 'Inundación',  translationRu: 'Наводнение' },
      { term: 'Dry',         phonetic: '/draɪ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Sec',           translationAr: 'جاف',      translationEs: 'Seco',        translationRu: 'Сухо' },
      { term: 'Humid',       phonetic: '/ˈhjuːmɪd/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Humide',        translationAr: 'رطب',      translationEs: 'Húmedo',      translationRu: 'Влажно' },
      { term: 'Breeze',      phonetic: '/briːz/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Brise',         translationAr: 'نسيم',     translationEs: 'Brisa',       translationRu: 'Бриз' },
      { term: 'Temperature', phonetic: '/ˈtɛmprɪtʃər/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Température', translationAr: 'درجة حرارة', translationEs: 'Temperatura', translationRu: 'Температура' },
      { term: 'Spring',      phonetic: '/sprɪŋ/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Printemps',     translationAr: 'ربيع',     translationEs: 'Primavera',   translationRu: 'Весна' },
      { term: 'Summer',      phonetic: '/ˈsʌmər/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Été',           translationAr: 'صيف',      translationEs: 'Verano',      translationRu: 'Лето' },
      { term: 'Autumn',      phonetic: '/ˈɔːtəm/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Automne',       translationAr: 'خريف',     translationEs: 'Otoño',       translationRu: 'Осень' },
      { term: 'Winter',      phonetic: '/ˈwɪntər/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Hiver',         translationAr: 'شتاء',     translationEs: 'Invierno',    translationRu: 'Зима' },
      { term: 'Forecast',    phonetic: '/ˈfɔːrkæst/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Prévisions',   translationAr: 'توقعات',   translationEs: 'Pronóstico',  translationRu: 'Прогноз' },
      { term: 'Climate',     phonetic: '/ˈklaɪmɪt/', difficulty: Difficulty.ADVANCED,     translationFr: 'Climat',        translationAr: 'مناخ',     translationEs: 'Clima',       translationRu: 'Климат' },
      { term: 'Drought',     phonetic: '/draʊt/',    difficulty: Difficulty.ADVANCED,     translationFr: 'Sécheresse',    translationAr: 'جفاف',     translationEs: 'Sequía',      translationRu: 'Засуха' },
    ]
  },

  {
    slug: 'colors', emoji: '🎨', orderIndex: 10,
    nameFr: 'Couleurs', nameEn: 'Colours', nameAr: 'ألوان', nameEs: 'Colores', nameRu: 'Цвета',
    words: [
      { term: 'Red',          phonetic: '/rɛd/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Rouge',          translationAr: 'أحمر',     translationEs: 'Rojo',         translationRu: 'Красный' },
      { term: 'Blue',         phonetic: '/bluː/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Bleu',           translationAr: 'أزرق',     translationEs: 'Azul',         translationRu: 'Синий' },
      { term: 'Green',        phonetic: '/ɡriːn/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Vert',           translationAr: 'أخضر',     translationEs: 'Verde',        translationRu: 'Зелёный' },
      { term: 'Yellow',       phonetic: '/ˈjɛloʊ/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Jaune',          translationAr: 'أصفر',     translationEs: 'Amarillo',     translationRu: 'Жёлтый' },
      { term: 'Black',        phonetic: '/blæk/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Noir',           translationAr: 'أسود',     translationEs: 'Negro',        translationRu: 'Чёрный' },
      { term: 'White',        phonetic: '/waɪt/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Blanc',          translationAr: 'أبيض',     translationEs: 'Blanco',       translationRu: 'Белый' },
      { term: 'Orange',       phonetic: '/ˈɒrɪndʒ/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Orange',         translationAr: 'برتقالي',  translationEs: 'Naranja',      translationRu: 'Оранжевый' },
      { term: 'Purple',       phonetic: '/ˈpɜːpəl/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Violet',         translationAr: 'بنفسجي',   translationEs: 'Morado',       translationRu: 'Фиолетовый' },
      { term: 'Pink',         phonetic: '/pɪŋk/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Rose',           translationAr: 'وردي',     translationEs: 'Rosa',         translationRu: 'Розовый' },
      { term: 'Brown',        phonetic: '/braʊn/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Marron',         translationAr: 'بني',      translationEs: 'Marrón',       translationRu: 'Коричневый' },
      { term: 'Grey',         phonetic: '/ɡreɪ/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Gris',           translationAr: 'رمادي',    translationEs: 'Gris',         translationRu: 'Серый' },
      { term: 'Gold',         phonetic: '/ɡoʊld/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Or/Doré',        translationAr: 'ذهبي',     translationEs: 'Dorado',       translationRu: 'Золотой' },
      { term: 'Silver',       phonetic: '/ˈsɪlvər/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Argenté',        translationAr: 'فضي',      translationEs: 'Plateado',     translationRu: 'Серебряный' },
      { term: 'Beige',        phonetic: '/beɪʒ/',      difficulty: Difficulty.INTERMEDIATE, translationFr: 'Beige',          translationAr: 'بيج',      translationEs: 'Beige',        translationRu: 'Бежевый' },
      { term: 'Turquoise',    phonetic: '/ˈtɜːrkwɔɪz/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Turquoise',     translationAr: 'فيروزي',   translationEs: 'Turquesa',     translationRu: 'Бирюзовый' },
      { term: 'Navy blue',    phonetic: '/ˈneɪvi bluː/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Bleu marine',   translationAr: 'أزرق داكن', translationEs: 'Azul marino', translationRu: 'Тёмно-синий' },
      { term: 'Cream',        phonetic: '/kriːm/',     difficulty: Difficulty.INTERMEDIATE, translationFr: 'Crème',          translationAr: 'كريمي',    translationEs: 'Crema',        translationRu: 'Кремовый' },
      { term: 'Olive',        phonetic: '/ˈɒlɪv/',     difficulty: Difficulty.INTERMEDIATE, translationFr: 'Olive',          translationAr: 'زيتوني',   translationEs: 'Verde oliva',  translationRu: 'Оливковый' },
      { term: 'Maroon',       phonetic: '/məˈruːn/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Bordeaux',       translationAr: 'كستنائي',  translationEs: 'Granate',      translationRu: 'Тёмно-бордовый' },
      { term: 'Teal',         phonetic: '/tiːl/',      difficulty: Difficulty.INTERMEDIATE, translationFr: 'Bleu sarcelle',  translationAr: 'أزرق مخضر', translationEs: 'Verde azulado', translationRu: 'Сине-зелёный' },
      { term: 'Lilac',        phonetic: '/ˈlaɪlək/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Lilas',          translationAr: 'ليلكي',    translationEs: 'Lila',         translationRu: 'Сиреневый' },
      { term: 'Dark',         phonetic: '/dɑːrk/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Sombre/Foncé',   translationAr: 'داكن',     translationEs: 'Oscuro',       translationRu: 'Тёмный' },
      { term: 'Light',        phonetic: '/laɪt/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Clair',          translationAr: 'فاتح',     translationEs: 'Claro',        translationRu: 'Светлый' },
      { term: 'Bright',       phonetic: '/braɪt/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Vif/Brillant',   translationAr: 'زاهٍ',     translationEs: 'Brillante',    translationRu: 'Яркий' },
      { term: 'Pale',         phonetic: '/peɪl/',      difficulty: Difficulty.INTERMEDIATE, translationFr: 'Pâle',           translationAr: 'شاحب',     translationEs: 'Pálido',       translationRu: 'Бледный' },
      { term: 'Transparent',  phonetic: '/trænsˈpærənt/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Transparent',  translationAr: 'شفاف',     translationEs: 'Transparente', translationRu: 'Прозрачный' },
      { term: 'Colourful',    phonetic: '/ˈkʌlərfʊl/', difficulty: Difficulty.BEGINNER,     translationFr: 'Coloré',         translationAr: 'ملوّن',    translationEs: 'Colorido',     translationRu: 'Красочный' },
      { term: 'Scarlet',      phonetic: '/ˈskɑːrlɪt/', difficulty: Difficulty.ADVANCED,     translationFr: 'Écarlate',       translationAr: 'أحمر قانٍ', translationEs: 'Escarlata',   translationRu: 'Алый' },
      { term: 'Ivory',        phonetic: '/ˈaɪvəri/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Ivoire',         translationAr: 'عاجي',     translationEs: 'Marfil',       translationRu: 'Слоновая кость' },
      { term: 'Crimson',      phonetic: '/ˈkrɪmzən/',  difficulty: Difficulty.ADVANCED,     translationFr: 'Cramoisi',       translationAr: 'قرمزي',    translationEs: 'Carmesí',      translationRu: 'Малиновый' },
    ]
  },

  {
    slug: 'numbers', emoji: '🔢', orderIndex: 11,
    nameFr: 'Chiffres', nameEn: 'Numbers', nameAr: 'الأرقام', nameEs: 'Números', nameRu: 'Числа',
    words: [
      { term: 'Zero',     phonetic: '/ˈzɪəroʊ/',  difficulty: Difficulty.BEGINNER, translationFr: 'Zéro',      translationAr: 'صفر',      translationEs: 'Cero',        translationRu: 'Ноль' },
      { term: 'One',      phonetic: '/wʌn/',       difficulty: Difficulty.BEGINNER, translationFr: 'Un',        translationAr: 'واحد',     translationEs: 'Uno',         translationRu: 'Один' },
      { term: 'Two',      phonetic: '/tuː/',       difficulty: Difficulty.BEGINNER, translationFr: 'Deux',      translationAr: 'اثنان',    translationEs: 'Dos',         translationRu: 'Два' },
      { term: 'Three',    phonetic: '/θriː/',      difficulty: Difficulty.BEGINNER, translationFr: 'Trois',     translationAr: 'ثلاثة',    translationEs: 'Tres',        translationRu: 'Три' },
      { term: 'Four',     phonetic: '/fɔːr/',      difficulty: Difficulty.BEGINNER, translationFr: 'Quatre',    translationAr: 'أربعة',    translationEs: 'Cuatro',      translationRu: 'Четыре' },
      { term: 'Five',     phonetic: '/faɪv/',      difficulty: Difficulty.BEGINNER, translationFr: 'Cinq',      translationAr: 'خمسة',     translationEs: 'Cinco',       translationRu: 'Пять' },
      { term: 'Six',      phonetic: '/sɪks/',      difficulty: Difficulty.BEGINNER, translationFr: 'Six',       translationAr: 'ستة',      translationEs: 'Seis',        translationRu: 'Шесть' },
      { term: 'Seven',    phonetic: '/ˈsɛvən/',    difficulty: Difficulty.BEGINNER, translationFr: 'Sept',      translationAr: 'سبعة',     translationEs: 'Siete',       translationRu: 'Семь' },
      { term: 'Eight',    phonetic: '/eɪt/',       difficulty: Difficulty.BEGINNER, translationFr: 'Huit',      translationAr: 'ثمانية',   translationEs: 'Ocho',        translationRu: 'Восемь' },
      { term: 'Nine',     phonetic: '/naɪn/',      difficulty: Difficulty.BEGINNER, translationFr: 'Neuf',      translationAr: 'تسعة',     translationEs: 'Nueve',       translationRu: 'Девять' },
      { term: 'Ten',      phonetic: '/tɛn/',       difficulty: Difficulty.BEGINNER, translationFr: 'Dix',       translationAr: 'عشرة',     translationEs: 'Diez',        translationRu: 'Десять' },
      { term: 'Eleven',   phonetic: '/ɪˈlɛvən/',  difficulty: Difficulty.BEGINNER, translationFr: 'Onze',      translationAr: 'أحد عشر',  translationEs: 'Once',        translationRu: 'Одиннадцать' },
      { term: 'Twelve',   phonetic: '/twɛlv/',     difficulty: Difficulty.BEGINNER, translationFr: 'Douze',     translationAr: 'اثنا عشر', translationEs: 'Doce',        translationRu: 'Двенадцать' },
      { term: 'Twenty',   phonetic: '/ˈtwɛnti/',   difficulty: Difficulty.BEGINNER, translationFr: 'Vingt',     translationAr: 'عشرون',    translationEs: 'Veinte',      translationRu: 'Двадцать' },
      { term: 'Thirty',   phonetic: '/ˈθɜːrti/',   difficulty: Difficulty.BEGINNER, translationFr: 'Trente',    translationAr: 'ثلاثون',   translationEs: 'Treinta',     translationRu: 'Тридцать' },
      { term: 'Forty',    phonetic: '/ˈfɔːrti/',   difficulty: Difficulty.BEGINNER, translationFr: 'Quarante',  translationAr: 'أربعون',   translationEs: 'Cuarenta',    translationRu: 'Сорок' },
      { term: 'Fifty',    phonetic: '/ˈfɪfti/',    difficulty: Difficulty.BEGINNER, translationFr: 'Cinquante', translationAr: 'خمسون',    translationEs: 'Cincuenta',   translationRu: 'Пятьдесят' },
      { term: 'Hundred',  phonetic: '/ˈhʌndrɪd/', difficulty: Difficulty.BEGINNER, translationFr: 'Cent',      translationAr: 'مئة',      translationEs: 'Cien',        translationRu: 'Сто' },
      { term: 'Thousand', phonetic: '/ˈθaʊzənd/', difficulty: Difficulty.BEGINNER, translationFr: 'Mille',     translationAr: 'ألف',      translationEs: 'Mil',         translationRu: 'Тысяча' },
      { term: 'Million',  phonetic: '/ˈmɪljən/',  difficulty: Difficulty.BEGINNER, translationFr: 'Million',   translationAr: 'مليون',    translationEs: 'Millón',      translationRu: 'Миллион' },
      { term: 'First',    phonetic: '/fɜːrst/',    difficulty: Difficulty.BEGINNER, translationFr: 'Premier',   translationAr: 'أول',      translationEs: 'Primero',     translationRu: 'Первый' },
      { term: 'Second',   phonetic: '/ˈsɛkənd/',  difficulty: Difficulty.BEGINNER, translationFr: 'Deuxième',  translationAr: 'ثانٍ',     translationEs: 'Segundo',     translationRu: 'Второй' },
      { term: 'Third',    phonetic: '/θɜːrd/',     difficulty: Difficulty.BEGINNER, translationFr: 'Troisième', translationAr: 'ثالث',     translationEs: 'Tercero',     translationRu: 'Третий' },
      { term: 'Half',     phonetic: '/hɑːf/',      difficulty: Difficulty.BEGINNER, translationFr: 'Moitié',    translationAr: 'نصف',      translationEs: 'Mitad',       translationRu: 'Половина' },
      { term: 'Quarter',  phonetic: '/ˈkwɔːrtər/', difficulty: Difficulty.BEGINNER, translationFr: 'Quart',     translationAr: 'ربع',      translationEs: 'Cuarto',      translationRu: 'Четверть' },
      { term: 'Double',   phonetic: '/ˈdʌbəl/',   difficulty: Difficulty.BEGINNER, translationFr: 'Double',    translationAr: 'ضعف',      translationEs: 'Doble',       translationRu: 'Двойной' },
      { term: 'Pair',     phonetic: '/pɛər/',      difficulty: Difficulty.BEGINNER, translationFr: 'Paire',     translationAr: 'زوج',      translationEs: 'Par',         translationRu: 'Пара' },
      { term: 'Dozen',    phonetic: '/ˈdʌzən/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Douzaine', translationAr: 'دزينة',  translationEs: 'Docena',      translationRu: 'Дюжина' },
      { term: 'Triple',   phonetic: '/ˈtrɪpəl/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Triple',  translationAr: 'ثلاثي',   translationEs: 'Triple',      translationRu: 'Тройной' },
      { term: 'Last',     phonetic: '/læst/',      difficulty: Difficulty.BEGINNER, translationFr: 'Dernier',   translationAr: 'أخير',     translationEs: 'Último',      translationRu: 'Последний' },
    ]
  },

  {
    slug: 'days-months', emoji: '📅', orderIndex: 12,
    nameFr: 'Jours & Mois', nameEn: 'Days & Months', nameAr: 'أيام وأشهر', nameEs: 'Días y Meses', nameRu: 'Дни и месяцы',
    words: [
      { term: 'Monday',    phonetic: '/ˈmʌndeɪ/',   difficulty: Difficulty.BEGINNER, translationFr: 'Lundi',      translationAr: 'الاثنين',  translationEs: 'Lunes',       translationRu: 'Понедельник' },
      { term: 'Tuesday',   phonetic: '/ˈtjuːzdeɪ/', difficulty: Difficulty.BEGINNER, translationFr: 'Mardi',      translationAr: 'الثلاثاء', translationEs: 'Martes',      translationRu: 'Вторник' },
      { term: 'Wednesday', phonetic: '/ˈwɛnzdeɪ/',  difficulty: Difficulty.BEGINNER, translationFr: 'Mercredi',   translationAr: 'الأربعاء', translationEs: 'Miércoles',   translationRu: 'Среда' },
      { term: 'Thursday',  phonetic: '/ˈθɜːrzdeɪ/', difficulty: Difficulty.BEGINNER, translationFr: 'Jeudi',      translationAr: 'الخميس',   translationEs: 'Jueves',      translationRu: 'Четверг' },
      { term: 'Friday',    phonetic: '/ˈfraɪdeɪ/',  difficulty: Difficulty.BEGINNER, translationFr: 'Vendredi',   translationAr: 'الجمعة',   translationEs: 'Viernes',     translationRu: 'Пятница' },
      { term: 'Saturday',  phonetic: '/ˈsætərdeɪ/', difficulty: Difficulty.BEGINNER, translationFr: 'Samedi',     translationAr: 'السبت',    translationEs: 'Sábado',      translationRu: 'Суббота' },
      { term: 'Sunday',    phonetic: '/ˈsʌndeɪ/',   difficulty: Difficulty.BEGINNER, translationFr: 'Dimanche',   translationAr: 'الأحد',    translationEs: 'Domingo',     translationRu: 'Воскресенье' },
      { term: 'January',   phonetic: '/ˈdʒænjʊɛri/', difficulty: Difficulty.BEGINNER, translationFr: 'Janvier',   translationAr: 'يناير',    translationEs: 'Enero',       translationRu: 'Январь' },
      { term: 'February',  phonetic: '/ˈfɛbrʊɛri/', difficulty: Difficulty.BEGINNER, translationFr: 'Février',    translationAr: 'فبراير',   translationEs: 'Febrero',     translationRu: 'Февраль' },
      { term: 'March',     phonetic: '/mɑːrtʃ/',    difficulty: Difficulty.BEGINNER, translationFr: 'Mars',       translationAr: 'مارس',     translationEs: 'Marzo',       translationRu: 'Март' },
      { term: 'April',     phonetic: '/ˈeɪprəl/',   difficulty: Difficulty.BEGINNER, translationFr: 'Avril',      translationAr: 'أبريل',    translationEs: 'Abril',       translationRu: 'Апрель' },
      { term: 'May',       phonetic: '/meɪ/',        difficulty: Difficulty.BEGINNER, translationFr: 'Mai',        translationAr: 'مايو',     translationEs: 'Mayo',        translationRu: 'Май' },
      { term: 'June',      phonetic: '/dʒuːn/',      difficulty: Difficulty.BEGINNER, translationFr: 'Juin',       translationAr: 'يونيو',    translationEs: 'Junio',       translationRu: 'Июнь' },
      { term: 'July',      phonetic: '/dʒʊˈlaɪ/',   difficulty: Difficulty.BEGINNER, translationFr: 'Juillet',    translationAr: 'يوليو',    translationEs: 'Julio',       translationRu: 'Июль' },
      { term: 'August',    phonetic: '/ˈɔːɡəst/',   difficulty: Difficulty.BEGINNER, translationFr: 'Août',       translationAr: 'أغسطس',   translationEs: 'Agosto',      translationRu: 'Август' },
      { term: 'September', phonetic: '/sɛpˈtɛmbər/', difficulty: Difficulty.BEGINNER, translationFr: 'Septembre',  translationAr: 'سبتمبر',   translationEs: 'Septiembre',  translationRu: 'Сентябрь' },
      { term: 'October',   phonetic: '/ɒkˈtoʊbər/', difficulty: Difficulty.BEGINNER, translationFr: 'Octobre',    translationAr: 'أكتوبر',   translationEs: 'Octubre',     translationRu: 'Октябрь' },
      { term: 'November',  phonetic: '/noʊˈvɛmbər/', difficulty: Difficulty.BEGINNER, translationFr: 'Novembre',  translationAr: 'نوفمبر',   translationEs: 'Novembre',    translationRu: 'Ноябрь' },
      { term: 'December',  phonetic: '/dɪˈsɛmbər/', difficulty: Difficulty.BEGINNER, translationFr: 'Décembre',   translationAr: 'ديسمبر',   translationEs: 'Diciembre',   translationRu: 'Декабрь' },
      { term: 'Today',     phonetic: '/təˈdeɪ/',     difficulty: Difficulty.BEGINNER, translationFr: 'Aujourd\'hui', translationAr: 'اليوم',  translationEs: 'Hoy',         translationRu: 'Сегодня' },
      { term: 'Tomorrow',  phonetic: '/təˈmɒroʊ/',  difficulty: Difficulty.BEGINNER, translationFr: 'Demain',     translationAr: 'غدا',      translationEs: 'Mañana',      translationRu: 'Завтра' },
      { term: 'Yesterday', phonetic: '/ˈjɛstərdeɪ/', difficulty: Difficulty.BEGINNER, translationFr: 'Hier',      translationAr: 'أمس',      translationEs: 'Ayer',        translationRu: 'Вчера' },
      { term: 'Week',      phonetic: '/wiːk/',       difficulty: Difficulty.BEGINNER, translationFr: 'Semaine',    translationAr: 'أسبوع',    translationEs: 'Semana',      translationRu: 'Неделя' },
      { term: 'Month',     phonetic: '/mʌnθ/',       difficulty: Difficulty.BEGINNER, translationFr: 'Mois',       translationAr: 'شهر',      translationEs: 'Mes',         translationRu: 'Месяц' },
      { term: 'Year',      phonetic: '/jɪər/',       difficulty: Difficulty.BEGINNER, translationFr: 'Année',      translationAr: 'سنة',      translationEs: 'Año',         translationRu: 'Год' },
      { term: 'Morning',   phonetic: '/ˈmɔːrnɪŋ/',  difficulty: Difficulty.BEGINNER, translationFr: 'Matin',      translationAr: 'صباح',     translationEs: 'Mañana',      translationRu: 'Утро' },
      { term: 'Afternoon', phonetic: '/ˌæftərˈnuːn/', difficulty: Difficulty.BEGINNER, translationFr: 'Après-midi', translationAr: 'ظهر',     translationEs: 'Tarde',       translationRu: 'День' },
      { term: 'Evening',   phonetic: '/ˈiːvnɪŋ/',   difficulty: Difficulty.BEGINNER, translationFr: 'Soirée',     translationAr: 'مساء',     translationEs: 'Tarde/Noche', translationRu: 'Вечер' },
      { term: 'Night',     phonetic: '/naɪt/',       difficulty: Difficulty.BEGINNER, translationFr: 'Nuit',       translationAr: 'ليل',      translationEs: 'Noche',       translationRu: 'Ночь' },
      { term: 'Weekend',   phonetic: '/ˈwiːkɛnd/',  difficulty: Difficulty.BEGINNER, translationFr: 'Week-end',   translationAr: 'عطلة الأسبوع', translationEs: 'Fin de semana', translationRu: 'Выходные' },
    ]
  },

  {
    slug: 'school', emoji: '📚', orderIndex: 13,
    nameFr: 'École', nameEn: 'School', nameAr: 'المدرسة', nameEs: 'Escuela', nameRu: 'Школа',
    words: [
      { term: 'School',      phonetic: '/skuːl/',       difficulty: Difficulty.BEGINNER,     translationFr: 'École',           translationAr: 'مدرسة',      translationEs: 'Escuela',       translationRu: 'Школа' },
      { term: 'Teacher',     phonetic: '/ˈtiːtʃər/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Professeur',      translationAr: 'معلم',       translationEs: 'Profesor',      translationRu: 'Учитель' },
      { term: 'Student',     phonetic: '/ˈstjuːdənt/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Élève',           translationAr: 'طالب',       translationEs: 'Estudiante',    translationRu: 'Студент' },
      { term: 'Book',        phonetic: '/bʊk/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Livre',           translationAr: 'كتاب',       translationEs: 'Libro',         translationRu: 'Книга' },
      { term: 'Pencil',      phonetic: '/ˈpɛnsəl/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Crayon',          translationAr: 'قلم رصاص',   translationEs: 'Lápiz',         translationRu: 'Карандаш' },
      { term: 'Pen',         phonetic: '/pɛn/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Stylo',           translationAr: 'قلم',        translationEs: 'Bolígrafo',     translationRu: 'Ручка' },
      { term: 'Notebook',    phonetic: '/ˈnoʊtbʊk/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Cahier',          translationAr: 'دفتر',       translationEs: 'Cuaderno',      translationRu: 'Тетрадь' },
      { term: 'Classroom',   phonetic: '/ˈklɑːsruːm/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Salle de classe', translationAr: 'فصل دراسي',  translationEs: 'Aula',          translationRu: 'Класс' },
      { term: 'Blackboard',  phonetic: '/ˈblækbɔːrd/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Tableau',         translationAr: 'سبورة',      translationEs: 'Pizarra',       translationRu: 'Доска' },
      { term: 'Homework',    phonetic: '/ˈhoʊmwɜːrk/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Devoirs',         translationAr: 'واجب منزلي', translationEs: 'Tarea',         translationRu: 'Домашнее задание' },
      { term: 'Exam',        phonetic: '/ɪɡˈzæm/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Examen',          translationAr: 'امتحان',     translationEs: 'Examen',        translationRu: 'Экзамен' },
      { term: 'Grade',       phonetic: '/ɡreɪd/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Note',            translationAr: 'علامة',      translationEs: 'Nota',          translationRu: 'Оценка' },
      { term: 'Mathematics', phonetic: '/ˌmæθəˈmætɪks/', difficulty: Difficulty.BEGINNER,  translationFr: 'Mathématiques',   translationAr: 'رياضيات',    translationEs: 'Matemáticas',   translationRu: 'Математика' },
      { term: 'Science',     phonetic: '/ˈsaɪəns/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Sciences',        translationAr: 'علوم',       translationEs: 'Ciencias',      translationRu: 'Наука' },
      { term: 'History',     phonetic: '/ˈhɪstəri/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Histoire',        translationAr: 'تاريخ',      translationEs: 'Historia',      translationRu: 'История' },
      { term: 'Language',    phonetic: '/ˈlæŋɡwɪdʒ/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Langue',          translationAr: 'لغة',        translationEs: 'Idioma',        translationRu: 'Язык' },
      { term: 'Dictionary',  phonetic: '/ˈdɪkʃənəri/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Dictionnaire',    translationAr: 'قاموس',      translationEs: 'Diccionario',   translationRu: 'Словарь' },
      { term: 'Library',     phonetic: '/ˈlaɪbrəri/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Bibliothèque',    translationAr: 'مكتبة',      translationEs: 'Biblioteca',    translationRu: 'Библиотека' },
      { term: 'University',  phonetic: '/ˌjuːnɪˈvɜːrsɪti/', difficulty: Difficulty.BEGINNER, translationFr: 'Université',     translationAr: 'جامعة',      translationEs: 'Universidad',   translationRu: 'Университет' },
      { term: 'Diploma',     phonetic: '/dɪˈploʊmə/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Diplôme',         translationAr: 'شهادة',      translationEs: 'Diploma',       translationRu: 'Диплом' },
      { term: 'Ruler',       phonetic: '/ˈruːlər/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Règle',           translationAr: 'مسطرة',      translationEs: 'Regla',         translationRu: 'Линейка' },
      { term: 'Eraser',      phonetic: '/ɪˈreɪzər/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Gomme',           translationAr: 'ممحاة',      translationEs: 'Goma',          translationRu: 'Ластик' },
      { term: 'Scissors',    phonetic: '/ˈsɪzərz/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Ciseaux',         translationAr: 'مقص',        translationEs: 'Tijeras',       translationRu: 'Ножницы' },
      { term: 'Art',         phonetic: '/ɑːrt/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Art',             translationAr: 'فن',         translationEs: 'Arte',          translationRu: 'Искусство' },
      { term: 'Music',       phonetic: '/ˈmjuːzɪk/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Musique',         translationAr: 'موسيقى',     translationEs: 'Música',        translationRu: 'Музыка' },
      { term: 'Geography',   phonetic: '/dʒiˈɒɡrəfi/',  difficulty: Difficulty.BEGINNER,    translationFr: 'Géographie',      translationAr: 'جغرافيا',    translationEs: 'Geografía',     translationRu: 'География' },
      { term: 'Break',       phonetic: '/breɪk/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Récréation',      translationAr: 'استراحة',    translationEs: 'Recreo',        translationRu: 'Перемена' },
      { term: 'Timetable',   phonetic: '/ˈtaɪmteɪbəl/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Emploi du temps',  translationAr: 'جدول زمني', translationEs: 'Horario',       translationRu: 'Расписание' },
      { term: 'Glue',        phonetic: '/ɡluː/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Colle',           translationAr: 'غراء',       translationEs: 'Pegamento',     translationRu: 'Клей' },
      { term: 'Backpack',    phonetic: '/ˈbækpæk/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Sac à dos',       translationAr: 'حقيبة ظهر', translationEs: 'Mochila',       translationRu: 'Рюкзак' },
    ]
  },

  {
    slug: 'work', emoji: '💼', orderIndex: 14,
    nameFr: 'Travail', nameEn: 'Work', nameAr: 'العمل', nameEs: 'Trabajo', nameRu: 'Работа',
    words: [
      { term: 'Job',          phonetic: '/dʒɒb/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Emploi',           translationAr: 'وظيفة',     translationEs: 'Trabajo',       translationRu: 'Работа' },
      { term: 'Office',       phonetic: '/ˈɒfɪs/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Bureau',           translationAr: 'مكتب',      translationEs: 'Oficina',       translationRu: 'Офис' },
      { term: 'Meeting',      phonetic: '/ˈmiːtɪŋ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Réunion',          translationAr: 'اجتماع',    translationEs: 'Reunión',       translationRu: 'Встреча' },
      { term: 'Salary',       phonetic: '/ˈsæləri/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Salaire',          translationAr: 'راتب',      translationEs: 'Salario',       translationRu: 'Зарплата' },
      { term: 'Boss',         phonetic: '/bɒs/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Chef/Patron',      translationAr: 'رئيس',      translationEs: 'Jefe',          translationRu: 'Начальник' },
      { term: 'Colleague',    phonetic: '/ˈkɒliːɡ/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Collègue',         translationAr: 'زميل',      translationEs: 'Compañero',     translationRu: 'Коллега' },
      { term: 'Contract',     phonetic: '/ˈkɒntrækt/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Contrat',          translationAr: 'عقد',       translationEs: 'Contrato',      translationRu: 'Контракт' },
      { term: 'Interview',    phonetic: '/ˈɪntəvjuː/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Entretien',        translationAr: 'مقابلة',    translationEs: 'Entrevista',    translationRu: 'Собеседование' },
      { term: 'Holiday',      phonetic: '/ˈhɒlɪdeɪ/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Congé',            translationAr: 'إجازة',     translationEs: 'Vacaciones',    translationRu: 'Отпуск' },
      { term: 'Deadline',     phonetic: '/ˈdɛdlaɪn/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Délai',            translationAr: 'موعد نهائي', translationEs: 'Plazo',        translationRu: 'Дедлайн' },
      { term: 'Project',      phonetic: '/ˈprɒdʒɛkt/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Projet',           translationAr: 'مشروع',     translationEs: 'Proyecto',      translationRu: 'Проект' },
      { term: 'Computer',     phonetic: '/kəmˈpjuːtər/', difficulty: Difficulty.BEGINNER,    translationFr: 'Ordinateur',       translationAr: 'حاسوب',     translationEs: 'Ordenador',     translationRu: 'Компьютер' },
      { term: 'Email',        phonetic: '/ˈiːmeɪl/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Email',            translationAr: 'بريد إلكتروني', translationEs: 'Correo',   translationRu: 'Электронная почта' },
      { term: 'Report',       phonetic: '/rɪˈpɔːrt/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Rapport',          translationAr: 'تقرير',     translationEs: 'Informe',       translationRu: 'Отчёт' },
      { term: 'Presentation', phonetic: '/ˌprɛzənˈteɪʃən/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Présentation',  translationAr: 'عرض',       translationEs: 'Presentación',  translationRu: 'Презентация' },
      { term: 'Promotion',    phonetic: '/prəˈmoʊʃən/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Promotion',       translationAr: 'ترقية',     translationEs: 'Ascenso',       translationRu: 'Повышение' },
      { term: 'Company',      phonetic: '/ˈkʌmpəni/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Entreprise',       translationAr: 'شركة',      translationEs: 'Empresa',       translationRu: 'Компания' },
      { term: 'Team',         phonetic: '/tiːm/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Équipe',           translationAr: 'فريق',      translationEs: 'Equipo',        translationRu: 'Команда' },
      { term: 'Manager',      phonetic: '/ˈmænɪdʒər/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Directeur',        translationAr: 'مدير',      translationEs: 'Gerente',       translationRu: 'Менеджер' },
      { term: 'Client',       phonetic: '/ˈklaɪənt/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Client',           translationAr: 'عميل',      translationEs: 'Cliente',       translationRu: 'Клиент' },
      { term: 'Invoice',      phonetic: '/ˈɪnvɔɪs/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Facture',          translationAr: 'فاتورة',    translationEs: 'Factura',       translationRu: 'Счёт' },
      { term: 'Budget',       phonetic: '/ˈbʌdʒɪt/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Budget',           translationAr: 'ميزانية',   translationEs: 'Presupuesto',   translationRu: 'Бюджет' },
      { term: 'Part-time',    phonetic: '/pɑːrt taɪm/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Temps partiel',   translationAr: 'دوام جزئي', translationEs: 'Media jornada', translationRu: 'Неполный рабочий день' },
      { term: 'Full-time',    phonetic: '/fʊl taɪm/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Temps plein',     translationAr: 'دوام كامل', translationEs: 'Jornada completa', translationRu: 'Полный рабочий день' },
      { term: 'Overtime',     phonetic: '/ˈoʊvərtaɪm/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Heures supp.',    translationAr: 'عمل إضافي', translationEs: 'Horas extra',   translationRu: 'Сверхурочные' },
      { term: 'Freelance',    phonetic: '/ˈfriːlæns/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Freelance',        translationAr: 'عمل حر',    translationEs: 'Autónomo',      translationRu: 'Фриланс' },
      { term: 'Unemployed',   phonetic: '/ˌʌnɪmˈplɔɪd/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Sans emploi',   translationAr: 'عاطل',      translationEs: 'Desempleado',   translationRu: 'Безработный' },
      { term: 'Employee',     phonetic: '/ɪmˈplɔɪiː/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Employé',         translationAr: 'موظف',      translationEs: 'Empleado',      translationRu: 'Сотрудник' },
      { term: 'Resignation',  phonetic: '/ˌrɛzɪɡˈneɪʃən/', difficulty: Difficulty.ADVANCED, translationFr: 'Démission',       translationAr: 'استقالة',   translationEs: 'Dimisión',      translationRu: 'Отставка' },
      { term: 'Phone call',   phonetic: '/foʊn kɔːl/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Appel téléphonique', translationAr: 'مكالمة', translationEs: 'Llamada',      translationRu: 'Звонок' },
    ]
  },

  {
    slug: 'city', emoji: '🏙️', orderIndex: 15,
    nameFr: 'Ville', nameEn: 'City', nameAr: 'المدينة', nameEs: 'Ciudad', nameRu: 'Город',
    words: [
      { term: 'City',          phonetic: '/ˈsɪti/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Ville',            translationAr: 'مدينة',      translationEs: 'Ciudad',        translationRu: 'Город' },
      { term: 'Street',        phonetic: '/striːt/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Rue',              translationAr: 'شارع',       translationEs: 'Calle',         translationRu: 'Улица' },
      { term: 'Square',        phonetic: '/skwɛər/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Place',            translationAr: 'ميدان',      translationEs: 'Plaza',         translationRu: 'Площадь' },
      { term: 'Bridge',        phonetic: '/brɪdʒ/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Pont',             translationAr: 'جسر',        translationEs: 'Puente',        translationRu: 'Мост' },
      { term: 'Park',          phonetic: '/pɑːrk/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Parc',             translationAr: 'حديقة عامة', translationEs: 'Parque',        translationRu: 'Парк' },
      { term: 'Hospital',      phonetic: '/ˈhɒspɪtəl/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Hôpital',          translationAr: 'مستشفى',     translationEs: 'Hospital',      translationRu: 'Больница' },
      { term: 'Market',        phonetic: '/ˈmɑːrkɪt/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Marché',           translationAr: 'سوق',        translationEs: 'Mercado',       translationRu: 'Рынок' },
      { term: 'Restaurant',    phonetic: '/ˈrɛstərɒnt/',  difficulty: Difficulty.BEGINNER,    translationFr: 'Restaurant',       translationAr: 'مطعم',       translationEs: 'Restaurante',   translationRu: 'Ресторан' },
      { term: 'Shop',          phonetic: '/ʃɒp/',          difficulty: Difficulty.BEGINNER,    translationFr: 'Magasin',          translationAr: 'محل',        translationEs: 'Tienda',        translationRu: 'Магазин' },
      { term: 'Bank',          phonetic: '/bæŋk/',         difficulty: Difficulty.BEGINNER,    translationFr: 'Banque',           translationAr: 'بنك',        translationEs: 'Banco',         translationRu: 'Банк' },
      { term: 'Post office',   phonetic: '/poʊst ˈɒfɪs/', difficulty: Difficulty.BEGINNER,    translationFr: 'Bureau de poste',  translationAr: 'مكتب بريد',  translationEs: 'Correos',       translationRu: 'Почта' },
      { term: 'Museum',        phonetic: '/mjuːˈziːəm/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Musée',            translationAr: 'متحف',       translationEs: 'Museo',         translationRu: 'Музей' },
      { term: 'Cinema',        phonetic: '/ˈsɪnɪmə/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Cinéma',           translationAr: 'سينما',      translationEs: 'Cine',          translationRu: 'Кино' },
      { term: 'Hotel',         phonetic: '/hoʊˈtɛl/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Hôtel',            translationAr: 'فندق',       translationEs: 'Hotel',         translationRu: 'Отель' },
      { term: 'Church',        phonetic: '/tʃɜːrtʃ/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Église',           translationAr: 'كنيسة',      translationEs: 'Iglesia',       translationRu: 'Церковь' },
      { term: 'Mosque',        phonetic: '/mɒsk/',         difficulty: Difficulty.BEGINNER,    translationFr: 'Mosquée',          translationAr: 'مسجد',       translationEs: 'Mezquita',      translationRu: 'Мечеть' },
      { term: 'Pharmacy',      phonetic: '/ˈfɑːrməsi/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Pharmacie',        translationAr: 'صيدلية',     translationEs: 'Farmacia',      translationRu: 'Аптека' },
      { term: 'Bakery',        phonetic: '/ˈbeɪkəri/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Boulangerie',      translationAr: 'مخبز',       translationEs: 'Panadería',     translationRu: 'Булочная' },
      { term: 'Supermarket',   phonetic: '/ˈsuːpərmɑːrkɪt/', difficulty: Difficulty.BEGINNER, translationFr: 'Supermarché',     translationAr: 'سوبرماركت',  translationEs: 'Supermercado',  translationRu: 'Супермаркет' },
      { term: 'Police station', phonetic: '/pəˈliːs ˈsteɪʃən/', difficulty: Difficulty.BEGINNER, translationFr: 'Commissariat',  translationAr: 'مركز شرطة', translationEs: 'Comisaría',     translationRu: 'Полиция' },
      { term: 'Neighbourhood', phonetic: '/ˈneɪbərhʊd/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Quartier',        translationAr: 'حي',         translationEs: 'Barrio',        translationRu: 'Район' },
      { term: 'Address',       phonetic: '/əˈdrɛs/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Adresse',         translationAr: 'عنوان',      translationEs: 'Dirección',     translationRu: 'Адрес' },
      { term: 'Map',           phonetic: '/mæp/',          difficulty: Difficulty.BEGINNER,    translationFr: 'Carte',           translationAr: 'خريطة',      translationEs: 'Mapa',          translationRu: 'Карта' },
      { term: 'Traffic light', phonetic: '/ˈtræfɪk laɪt/', difficulty: Difficulty.BEGINNER, translationFr: 'Feu tricolore',   translationAr: 'إشارة مرور', translationEs: 'Semáforo',      translationRu: 'Светофор' },
      { term: 'Pavement',      phonetic: '/ˈpeɪvmənt/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Trottoir',        translationAr: 'رصيف',       translationEs: 'Acera',         translationRu: 'Тротуар' },
      { term: 'Suburb',        phonetic: '/ˈsʌbɜːrb/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Banlieue',        translationAr: 'ضاحية',      translationEs: 'Suburbio',      translationRu: 'Пригород' },
      { term: 'Fountain',      phonetic: '/ˈfaʊntɪn/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Fontaine',        translationAr: 'نافورة',     translationEs: 'Fuente',        translationRu: 'Фонтан' },
      { term: 'Town hall',     phonetic: '/taʊn hɔːl/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Mairie',          translationAr: 'دار البلدية', translationEs: 'Ayuntamiento', translationRu: 'Мэрия' },
      { term: 'Postcode',      phonetic: '/ˈpoʊstkəʊd/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Code postal',     translationAr: 'رمز بريدي',  translationEs: 'Código postal', translationRu: 'Индекс' },
      { term: 'Pedestrian',    phonetic: '/pɪˈdɛstriən/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Piéton',         translationAr: 'مشاة',       translationEs: 'Peatón',        translationRu: 'Пешеход' },
    ]
  },

  {
    slug: 'health', emoji: '🏥', orderIndex: 16,
    nameFr: 'Santé', nameEn: 'Health', nameAr: 'الصحة', nameEs: 'Salud', nameRu: 'Здоровье',
    words: [
      { term: 'Doctor',        phonetic: '/ˈdɒktər/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Médecin',          translationAr: 'طبيب',       translationEs: 'Médico',        translationRu: 'Врач' },
      { term: 'Nurse',         phonetic: '/nɜːrs/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Infirmier',        translationAr: 'ممرض',       translationEs: 'Enfermero',     translationRu: 'Медсестра' },
      { term: 'Medicine',      phonetic: '/ˈmɛdɪsɪn/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Médicament',       translationAr: 'دواء',       translationEs: 'Medicamento',   translationRu: 'Лекарство' },
      { term: 'Pain',          phonetic: '/peɪn/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Douleur',          translationAr: 'ألم',        translationEs: 'Dolor',         translationRu: 'Боль' },
      { term: 'Headache',      phonetic: '/ˈhɛdeɪk/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Mal de tête',      translationAr: 'صداع',       translationEs: 'Dolor de cabeza', translationRu: 'Головная боль' },
      { term: 'Fever',         phonetic: '/ˈfiːvər/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Fièvre',           translationAr: 'حمى',        translationEs: 'Fiebre',        translationRu: 'Лихорадка' },
      { term: 'Cold',          phonetic: '/koʊld/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Rhume',            translationAr: 'زكام',       translationEs: 'Resfriado',     translationRu: 'Простуда' },
      { term: 'Cough',         phonetic: '/kɒf/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Toux',             translationAr: 'سعال',       translationEs: 'Tos',           translationRu: 'Кашель' },
      { term: 'Allergy',       phonetic: '/ˈælədʒi/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Allergie',         translationAr: 'حساسية',     translationEs: 'Alergia',       translationRu: 'Аллергия' },
      { term: 'Surgery',       phonetic: '/ˈsɜːrdʒəri/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Chirurgie',        translationAr: 'جراحة',      translationEs: 'Cirugía',       translationRu: 'Операция' },
      { term: 'Injection',     phonetic: '/ɪnˈdʒɛkʃən/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Injection',        translationAr: 'حقنة',       translationEs: 'Inyección',     translationRu: 'Укол' },
      { term: 'X-ray',         phonetic: '/ˈɛksreɪ/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Radiographie',     translationAr: 'أشعة سينية', translationEs: 'Radiografía',   translationRu: 'Рентген' },
      { term: 'Prescription',  phonetic: '/prɪˈskrɪpʃən/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Ordonnance',     translationAr: 'وصفة طبية', translationEs: 'Receta médica', translationRu: 'Рецепт' },
      { term: 'Bandage',       phonetic: '/ˈbændɪdʒ/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Pansement',        translationAr: 'ضمادة',      translationEs: 'Vendaje',       translationRu: 'Повязка' },
      { term: 'Healthy',       phonetic: '/ˈhɛlθi/',     difficulty: Difficulty.BEGINNER,     translationFr: 'En bonne santé',   translationAr: 'صحي',        translationEs: 'Saludable',     translationRu: 'Здоровый' },
      { term: 'Ill',           phonetic: '/ɪl/',          difficulty: Difficulty.BEGINNER,     translationFr: 'Malade',           translationAr: 'مريض',       translationEs: 'Enfermo',       translationRu: 'Больной' },
      { term: 'Diet',          phonetic: '/ˈdaɪɪt/',     difficulty: Difficulty.INTERMEDIATE, translationFr: 'Régime',           translationAr: 'نظام غذائي', translationEs: 'Dieta',         translationRu: 'Диета' },
      { term: 'Exercise',      phonetic: '/ˈɛksərsaɪz/', difficulty: Difficulty.BEGINNER,     translationFr: 'Exercice',         translationAr: 'تمرين',      translationEs: 'Ejercicio',     translationRu: 'Упражнение' },
      { term: 'Sleep',         phonetic: '/sliːp/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Sommeil',          translationAr: 'نوم',        translationEs: 'Sueño',         translationRu: 'Сон' },
      { term: 'Stress',        phonetic: '/strɛs/',       difficulty: Difficulty.INTERMEDIATE, translationFr: 'Stress',           translationAr: 'توتر',       translationEs: 'Estrés',        translationRu: 'Стресс' },
      { term: 'Vitamin',       phonetic: '/ˈvaɪtəmɪn/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Vitamine',         translationAr: 'فيتامين',    translationEs: 'Vitamina',      translationRu: 'Витамин' },
      { term: 'Emergency',     phonetic: '/ɪˈmɜːrdʒənsi/', difficulty: Difficulty.BEGINNER,   translationFr: 'Urgence',          translationAr: 'طوارئ',      translationEs: 'Emergencia',    translationRu: 'Скорая помощь' },
      { term: 'Appointment',   phonetic: '/əˈpɔɪntmənt/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Rendez-vous',     translationAr: 'موعد',       translationEs: 'Cita médica',   translationRu: 'Приём' },
      { term: 'Blood pressure', phonetic: '/blʌd ˈprɛʃər/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Tension',       translationAr: 'ضغط الدم',  translationEs: 'Tensión',       translationRu: 'Давление' },
      { term: 'Ambulance',     phonetic: '/ˈæmbjʊləns/', difficulty: Difficulty.BEGINNER,     translationFr: 'Ambulance',        translationAr: 'سيارة إسعاف', translationEs: 'Ambulancia',  translationRu: 'Скорая помощь' },
      { term: 'Pregnant',      phonetic: '/ˈprɛɡnənt/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Enceinte',         translationAr: 'حامل',       translationEs: 'Embarazada',    translationRu: 'Беременная' },
      { term: 'Recovery',      phonetic: '/rɪˈkʌvəri/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Guérison',         translationAr: 'تعافٍ',      translationEs: 'Recuperación',  translationRu: 'Выздоровление' },
      { term: 'Operation',     phonetic: '/ˌɒpəˈreɪʃən/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Opération',       translationAr: 'عملية',      translationEs: 'Operación',     translationRu: 'Операция' },
      { term: 'Diabetes',      phonetic: '/ˌdaɪəˈbiːtɪz/', difficulty: Difficulty.ADVANCED,   translationFr: 'Diabète',          translationAr: 'سكري',       translationEs: 'Diabetes',      translationRu: 'Диабет' },
      { term: 'Asthma',        phonetic: '/ˈæzmə/',       difficulty: Difficulty.ADVANCED,     translationFr: 'Asthme',           translationAr: 'ربو',        translationEs: 'Asma',          translationRu: 'Астма' },
    ]
  },

  {
    slug: 'emotions', emoji: '😊', orderIndex: 17,
    nameFr: 'Émotions', nameEn: 'Emotions', nameAr: 'المشاعر', nameEs: 'Emociones', nameRu: 'Эмоции',
    words: [
      { term: 'Happy',        phonetic: '/ˈhæpi/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Heureux',          translationAr: 'سعيد',       translationEs: 'Feliz',         translationRu: 'Счастливый' },
      { term: 'Sad',          phonetic: '/sæd/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Triste',           translationAr: 'حزين',       translationEs: 'Triste',        translationRu: 'Грустный' },
      { term: 'Angry',        phonetic: '/ˈæŋɡri/',     difficulty: Difficulty.BEGINNER,     translationFr: 'En colère',        translationAr: 'غاضب',       translationEs: 'Enfadado',      translationRu: 'Злой' },
      { term: 'Scared',       phonetic: '/skɛərd/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Effrayé',          translationAr: 'خائف',       translationEs: 'Asustado',      translationRu: 'Напуганный' },
      { term: 'Excited',      phonetic: '/ɪkˈsaɪtɪd/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Excité',           translationAr: 'متحمس',      translationEs: 'Emocionado',    translationRu: 'Взволнованный' },
      { term: 'Surprised',    phonetic: '/səˈpraɪzd/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Surpris',          translationAr: 'مفاجأ',      translationEs: 'Sorprendido',   translationRu: 'Удивлённый' },
      { term: 'Tired',        phonetic: '/ˈtaɪərd/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Fatigué',          translationAr: 'متعب',       translationEs: 'Cansado',       translationRu: 'Усталый' },
      { term: 'Bored',        phonetic: '/bɔːrd/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Ennuyé',           translationAr: 'ممل',        translationEs: 'Aburrido',      translationRu: 'Скучающий' },
      { term: 'Nervous',      phonetic: '/ˈnɜːrvəs/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Nerveux',          translationAr: 'متوتر',      translationEs: 'Nervioso',      translationRu: 'Нервный' },
      { term: 'Confident',    phonetic: '/ˈkɒnfɪdənt/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Confiant',         translationAr: 'واثق',       translationEs: 'Confiado',      translationRu: 'Уверенный' },
      { term: 'Lonely',       phonetic: '/ˈloʊnli/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Solitaire',        translationAr: 'وحيد',       translationEs: 'Solitario',     translationRu: 'Одинокий' },
      { term: 'Proud',        phonetic: '/praʊd/',       difficulty: Difficulty.INTERMEDIATE, translationFr: 'Fier',             translationAr: 'فخور',       translationEs: 'Orgulloso',     translationRu: 'Гордый' },
      { term: 'Embarrassed',  phonetic: '/ɪmˈbærəst/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Gêné',             translationAr: 'محرج',       translationEs: 'Avergonzado',   translationRu: 'Смущённый' },
      { term: 'Grateful',     phonetic: '/ˈɡreɪtfəl/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Reconnaissant',    translationAr: 'ممتن',       translationEs: 'Agradecido',    translationRu: 'Благодарный' },
      { term: 'Jealous',      phonetic: '/ˈdʒɛləs/',    difficulty: Difficulty.INTERMEDIATE, translationFr: 'Jaloux',           translationAr: 'غيور',       translationEs: 'Celoso',        translationRu: 'Ревнивый' },
      { term: 'Love',         phonetic: '/lʌv/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Amour',            translationAr: 'حب',         translationEs: 'Amor',          translationRu: 'Любовь' },
      { term: 'Hope',         phonetic: '/hoʊp/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Espoir',           translationAr: 'أمل',        translationEs: 'Esperanza',     translationRu: 'Надежда' },
      { term: 'Fear',         phonetic: '/fɪər/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Peur',             translationAr: 'خوف',        translationEs: 'Miedo',         translationRu: 'Страх' },
      { term: 'Joy',          phonetic: '/dʒɔɪ/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Joie',             translationAr: 'فرح',        translationEs: 'Alegría',       translationRu: 'Радость' },
      { term: 'Calm',         phonetic: '/kɑːm/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Calme',            translationAr: 'هادئ',       translationEs: 'Calmado',       translationRu: 'Спокойный' },
      { term: 'Worried',      phonetic: '/ˈwʌrid/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Inquiet',          translationAr: 'قلق',        translationEs: 'Preocupado',    translationRu: 'Обеспокоенный' },
      { term: 'Relieved',     phonetic: '/rɪˈliːvd/',   difficulty: Difficulty.INTERMEDIATE, translationFr: 'Soulagé',          translationAr: 'مرتاح',      translationEs: 'Aliviado',      translationRu: 'Облегчённый' },
      { term: 'Disappointed', phonetic: '/ˌdɪsəˈpɔɪntɪd/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Déçu',         translationAr: 'محبط',       translationEs: 'Decepcionado',  translationRu: 'Разочарованный' },
      { term: 'Curious',      phonetic: '/ˈkjʊərɪəs/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Curieux',          translationAr: 'فضولي',      translationEs: 'Curioso',       translationRu: 'Любопытный' },
      { term: 'Frustrated',   phonetic: '/frʌˈstreɪtɪd/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Frustré',        translationAr: 'محبط',       translationEs: 'Frustrado',     translationRu: 'Расстроенный' },
      { term: 'Nostalgic',    phonetic: '/nɒˈstældʒɪk/', difficulty: Difficulty.ADVANCED,    translationFr: 'Nostalgique',      translationAr: 'حنين',       translationEs: 'Nostálgico',    translationRu: 'Ностальгирующий' },
      { term: 'Optimistic',   phonetic: '/ˌɒptɪˈmɪstɪk/', difficulty: Difficulty.ADVANCED,  translationFr: 'Optimiste',        translationAr: 'متفائل',     translationEs: 'Optimista',     translationRu: 'Оптимистичный' },
      { term: 'Overwhelmed',  phonetic: '/ˌoʊvərˈwɛlmd/', difficulty: Difficulty.ADVANCED,   translationFr: 'Dépassé',          translationAr: 'مثقل',       translationEs: 'Abrumado',      translationRu: 'Подавленный' },
      { term: 'Enthusiastic', phonetic: '/ɪnˌθjuːziˈæstɪk/', difficulty: Difficulty.ADVANCED, translationFr: 'Enthousiaste',   translationAr: 'متحمس',      translationEs: 'Entusiasta',    translationRu: 'Энтузиаст' },
      { term: 'Hate',         phonetic: '/heɪt/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Haine',            translationAr: 'كره',        translationEs: 'Odio',          translationRu: 'Ненависть' },
    ]
  },

  {
    slug: 'nature', emoji: '🌿', orderIndex: 18,
    nameFr: 'Nature', nameEn: 'Nature', nameAr: 'الطبيعة', nameEs: 'Naturaleza', nameRu: 'Природа',
    words: [
      { term: 'Tree',       phonetic: '/triː/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Arbre',            translationAr: 'شجرة',      translationEs: 'Árbol',        translationRu: 'Дерево' },
      { term: 'Flower',     phonetic: '/ˈflaʊər/',    difficulty: Difficulty.BEGINNER,     translationFr: 'Fleur',            translationAr: 'زهرة',      translationEs: 'Flor',         translationRu: 'Цветок' },
      { term: 'River',      phonetic: '/ˈrɪvər/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Rivière',          translationAr: 'نهر',       translationEs: 'Río',          translationRu: 'Река' },
      { term: 'Mountain',   phonetic: '/ˈmaʊntɪn/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Montagne',         translationAr: 'جبل',       translationEs: 'Montaña',      translationRu: 'Гора' },
      { term: 'Sea',        phonetic: '/siː/',         difficulty: Difficulty.BEGINNER,     translationFr: 'Mer',              translationAr: 'بحر',       translationEs: 'Mar',          translationRu: 'Море' },
      { term: 'Forest',     phonetic: '/ˈfɒrɪst/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Forêt',            translationAr: 'غابة',      translationEs: 'Bosque',       translationRu: 'Лес' },
      { term: 'Desert',     phonetic: '/ˈdɛzərt/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Désert',           translationAr: 'صحراء',     translationEs: 'Desierto',     translationRu: 'Пустыня' },
      { term: 'Beach',      phonetic: '/biːtʃ/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Plage',            translationAr: 'شاطئ',      translationEs: 'Playa',        translationRu: 'Пляж' },
      { term: 'Lake',       phonetic: '/leɪk/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Lac',              translationAr: 'بحيرة',     translationEs: 'Lago',         translationRu: 'Озеро' },
      { term: 'Hill',       phonetic: '/hɪl/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Colline',          translationAr: 'تل',        translationEs: 'Colina',       translationRu: 'Холм' },
      { term: 'Island',     phonetic: '/ˈaɪlənd/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Île',              translationAr: 'جزيرة',     translationEs: 'Isla',         translationRu: 'Остров' },
      { term: 'Grass',      phonetic: '/ɡrɑːs/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Herbe',            translationAr: 'عشب',       translationEs: 'Hierba',       translationRu: 'Трава' },
      { term: 'Leaf',       phonetic: '/liːf/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Feuille',          translationAr: 'ورقة',      translationEs: 'Hoja',         translationRu: 'Лист' },
      { term: 'Rock',       phonetic: '/rɒk/',        difficulty: Difficulty.BEGINNER,     translationFr: 'Rocher',           translationAr: 'صخرة',      translationEs: 'Roca',         translationRu: 'Скала' },
      { term: 'Sand',       phonetic: '/sænd/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Sable',            translationAr: 'رمال',      translationEs: 'Arena',        translationRu: 'Песок' },
      { term: 'Volcano',    phonetic: '/vɒlˈkeɪnoʊ/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Volcan',          translationAr: 'بركان',     translationEs: 'Volcán',       translationRu: 'Вулкан' },
      { term: 'Waterfall',  phonetic: '/ˈwɔːtərfɔːl/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Cascade',        translationAr: 'شلال',      translationEs: 'Cascada',      translationRu: 'Водопад' },
      { term: 'Cave',       phonetic: '/keɪv/',       difficulty: Difficulty.INTERMEDIATE, translationFr: 'Grotte',           translationAr: 'كهف',       translationEs: 'Cueva',        translationRu: 'Пещера' },
      { term: 'Jungle',     phonetic: '/ˈdʒʌŋɡəl/',  difficulty: Difficulty.INTERMEDIATE, translationFr: 'Jungle',           translationAr: 'غابة استوائية', translationEs: 'Jungla',   translationRu: 'Джунгли' },
      { term: 'Valley',     phonetic: '/ˈvæli/',      difficulty: Difficulty.INTERMEDIATE, translationFr: 'Vallée',           translationAr: 'وادٍ',      translationEs: 'Valle',        translationRu: 'Долина' },
      { term: 'Ocean',      phonetic: '/ˈoʊʃən/',     difficulty: Difficulty.BEGINNER,     translationFr: 'Océan',            translationAr: 'محيط',      translationEs: 'Océano',       translationRu: 'Океан' },
      { term: 'Sky',        phonetic: '/skaɪ/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Ciel',             translationAr: 'سماء',      translationEs: 'Cielo',        translationRu: 'Небо' },
      { term: 'Moon',       phonetic: '/muːn/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Lune',             translationAr: 'قمر',       translationEs: 'Luna',         translationRu: 'Луна' },
      { term: 'Star',       phonetic: '/stɑːr/',      difficulty: Difficulty.BEGINNER,     translationFr: 'Étoile',           translationAr: 'نجم',       translationEs: 'Estrella',     translationRu: 'Звезда' },
      { term: 'Earth',      phonetic: '/ɜːrθ/',       difficulty: Difficulty.BEGINNER,     translationFr: 'Terre',            translationAr: 'أرض',       translationEs: 'Tierra',       translationRu: 'Земля' },
      { term: 'Earthquake', phonetic: '/ˈɜːrθkweɪk/', difficulty: Difficulty.INTERMEDIATE, translationFr: 'Séisme',          translationAr: 'زلزال',     translationEs: 'Terremoto',    translationRu: 'Землетрясение' },
      { term: 'Sunset',     phonetic: '/ˈsʌnsɛt/',   difficulty: Difficulty.BEGINNER,     translationFr: 'Coucher de soleil', translationAr: 'غروب الشمس', translationEs: 'Puesta de sol', translationRu: 'Закат' },
      { term: 'Sunrise',    phonetic: '/ˈsʌnraɪz/',  difficulty: Difficulty.BEGINNER,     translationFr: 'Lever du soleil',  translationAr: 'شروق الشمس', translationEs: 'Amanecer',     translationRu: 'Восход' },
      { term: 'Soil',       phonetic: '/sɔɪl/',       difficulty: Difficulty.INTERMEDIATE, translationFr: 'Sol/Terre',        translationAr: 'تربة',      translationEs: 'Suelo',        translationRu: 'Почва' },
      { term: 'Tide',       phonetic: '/taɪd/',       difficulty: Difficulty.ADVANCED,     translationFr: 'Marée',            translationAr: 'مد وجزر',   translationEs: 'Marea',        translationRu: 'Прилив' },
    ]
  },
]

// ─────────────────────────────────────────────
// SEED PRINCIPAL
// ─────────────────────────────────────────────

async function main() {
  console.log('🌱 Démarrage du seed Lingua-Learn...')
  console.log(`   ${CATEGORIES.length} catégories à créer`)

  // 1. Langues
  console.log('\n📚 Création des langues...')
  const langues = [
    { code: LanguageCode.FR, name: 'Français',  nativeName: 'Français',  flagEmoji: '🇫🇷', rtl: false },
    { code: LanguageCode.EN, name: 'Anglais',   nativeName: 'English',   flagEmoji: '🇬🇧', rtl: false },
    { code: LanguageCode.AR, name: 'Arabe',     nativeName: 'العربية',   flagEmoji: '🇸🇦', rtl: true  },
    { code: LanguageCode.ES, name: 'Espagnol',  nativeName: 'Español',   flagEmoji: '🇪🇸', rtl: false },
    { code: LanguageCode.RU, name: 'Russe',     nativeName: 'Русский',   flagEmoji: '🇷🇺', rtl: false },
  ]
  for (const l of langues) {
    await prisma.language.upsert({ where: { code: l.code }, update: {}, create: l })
  }
  console.log(`   ✅ ${langues.length} langues créées`)

  // 2. Catégories + Mots
  let totalWords = 0

  for (const cat of CATEGORIES) {
    process.stdout.write(`\n${cat.emoji} ${cat.nameEn}... `)

    // Upsert catégorie
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { emoji: cat.emoji, orderIndex: cat.orderIndex, nameFr: cat.nameFr, nameEn: cat.nameEn, nameAr: cat.nameAr, nameEs: cat.nameEs, nameRu: cat.nameRu },
      create: { slug: cat.slug, emoji: cat.emoji, orderIndex: cat.orderIndex, nameFr: cat.nameFr, nameEn: cat.nameEn, nameAr: cat.nameAr, nameEs: cat.nameEs, nameRu: cat.nameRu },
    })

    // Upsert mots EN
    let count = 0
    for (const word of cat.words) {
      await prisma.word.upsert({
        where: { languageCode_term: { languageCode: LanguageCode.EN, term: word.term } },
        update: {},
        create: {
          languageCode:  LanguageCode.EN,
          categoryId:    category.id,
          term:          word.term,
          phonetic:      word.phonetic,
          difficulty:    word.difficulty,
          translationFr: word.translationFr,
          translationEn: word.term,
          translationAr: word.translationAr,
          translationEs: word.translationEs,
          translationRu: word.translationRu,
          exampleEn:     word.exampleEn,
          exampleFr:     word.exampleFr,
        },
      })
      count++
    }

    // Upsert mots ES — terme en espagnol
    for (const word of cat.words) {
      const termEs = word.translationEs
      if (!termEs) continue
      await prisma.word.upsert({
        where: { languageCode_term: { languageCode: LanguageCode.ES, term: termEs } },
        update: {},
        create: {
          languageCode:  LanguageCode.ES,
          categoryId:    category.id,
          term:          termEs,
          difficulty:    word.difficulty,
          translationFr: word.translationFr,
          translationEn: word.term,
          translationAr: word.translationAr,
          translationEs: termEs,
          translationRu: word.translationRu,
        },
      })
      count++
    }

    // Upsert mots AR — terme en arabe
    for (const word of cat.words) {
      const termAr = word.translationAr
      if (!termAr) continue
      await prisma.word.upsert({
        where: { languageCode_term: { languageCode: LanguageCode.AR, term: termAr } },
        update: {},
        create: {
          languageCode:  LanguageCode.AR,
          categoryId:    category.id,
          term:          termAr,
          difficulty:    word.difficulty,
          translationFr: word.translationFr,
          translationEn: word.term,
          translationAr: termAr,
          translationEs: word.translationEs,
          translationRu: word.translationRu,
        },
      })
      count++
    }

    // Upsert mots RU — terme en russe
    for (const word of cat.words) {
      const termRu = word.translationRu
      if (!termRu) continue
      await prisma.word.upsert({
        where: { languageCode_term: { languageCode: LanguageCode.RU, term: termRu } },
        update: {},
        create: {
          languageCode:  LanguageCode.RU,
          categoryId:    category.id,
          term:          termRu,
          difficulty:    word.difficulty,
          translationFr: word.translationFr,
          translationEn: word.term,
          translationAr: word.translationAr,
          translationEs: word.translationEs,
          translationRu: termRu,
        },
      })
      count++
    }

    totalWords += count
    console.log(`${count} mots ✅`)
  }

  // Résumé
  console.log('\n─────────────────────────────────────────')
  console.log('✅ Seed terminé avec succès !')
  console.log(`   📖 ${totalWords} mots insérés`)
  console.log(`   🌍 5 langues disponibles`)
  console.log(`   🗂️  ${CATEGORIES.length} catégories créées`)
  console.log('─────────────────────────────────────────')
}

main()
  .catch((e) => { console.error('❌ Erreur seed :', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })