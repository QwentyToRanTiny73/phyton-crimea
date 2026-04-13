import type { Product } from '@/types';

export const products: Product[] = [
  // ── Уход за лицом ──────────────────────────────────────────────────────────
  {
    id: 'p1',
    slug: 'krem-nochnoj-lavanda',
    name: 'Ночной крем с лавандой',
    shortDescription: 'Питательный ночной крем с экстрактом крымской лаванды',
    description:
      'Насыщенный ночной крем с экстрактом крымской лаванды, маслом жожоба и витамином Е. Восстанавливает кожу во время сна, борется с признаками усталости и первыми морщинками. Натуральный состав без парабенов и синтетических ароматизаторов.',
    ingredients:
      'Aqua, Butyrospermum Parkii Butter, Jojoba Oil, Lavandula Angustifolia Extract, Tocopherol (Vit. E), Glycerin, Shea Butter',
    price: 890,
    oldPrice: 1050,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    categorySlug: 'face',
    inStock: true,
    isBestseller: true,
    volume: '50 мл',
    sku: 'FC-001',
  },
  {
    id: 'p2',
    slug: 'krem-dnevnoj-roza',
    name: 'Дневной крем с розой',
    shortDescription: 'Увлажняющий дневной крем с лепестками крымской розы',
    description:
      'Лёгкий дневной крем на основе гидролата крымской розы. Интенсивно увлажняет и выравнивает тон кожи, защищает от внешних воздействий. Подходит для нормальной и комбинированной кожи.',
    ingredients:
      'Aqua, Rosa Damascena Flower Water, Hyaluronic Acid, Niacinamide, Glycerin, Rosa Canina Seed Oil, Zinc Oxide',
    price: 950,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
    categorySlug: 'face',
    inStock: true,
    isNew: true,
    volume: '50 мл',
    sku: 'FC-002',
  },
  {
    id: 'p3',
    slug: 'tonik-aloe',
    name: 'Тоник с алоэ вера',
    shortDescription: 'Освежающий тоник с органическим алоэ вера',
    description:
      'Мягкий тоник на основе органического алоэ вера и экстракта зелёного чая. Очищает поры, балансирует pH кожи и готовит её к нанесению следующих средств. Без спирта.',
    price: 520,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
    categorySlug: 'face',
    inStock: true,
    volume: '150 мл',
    sku: 'FC-003',
  },
  {
    id: 'p4',
    slug: 'syvorotka-shipovnik',
    name: 'Сыворотка с маслом шиповника',
    shortDescription: 'Омолаживающая сыворотка с крымским маслом шиповника',
    description:
      'Концентрированная сыворотка с маслом шиповника, богатым витамином С. Осветляет пигментные пятна, выравнивает тон кожи и стимулирует выработку коллагена. 30 дней — видимый результат.',
    price: 1280,
    imageUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80',
    categorySlug: 'face',
    inStock: true,
    isBestseller: true,
    isNew: true,
    volume: '30 мл',
    sku: 'FC-004',
  },
  {
    id: 'p5',
    slug: 'maska-belaya-glina',
    name: 'Маска с белой глиной',
    shortDescription: 'Очищающая маска с крымской белой глиной и экстрактом чабреца',
    description:
      'Глубоко очищающая маска с крымской белой глиной, экстрактом чабреца и маслом чайного дерева. Сужает поры, нормализует работу сальных желёз и улучшает цвет лица.',
    price: 680,
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
    categorySlug: 'face',
    inStock: true,
    weight: '100 г',
    sku: 'FC-005',
  },

  // ── Уход за телом ─────────────────────────────────────────────────────────
  {
    id: 'p6',
    slug: 'maslo-vinogradnye-kostochki',
    name: 'Масло "Виноградные косточки"',
    shortDescription: 'Лёгкое масло для тела с виноградными косточками',
    description:
      'Нежное масло для тела холодного отжима из виноградных косточек крымских сортов. Быстро впитывается, глубоко питает и разглаживает кожу. Богато антиоксидантами и витамином Е.',
    price: 750,
    oldPrice: 900,
    imageUrl: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
    categorySlug: 'body',
    inStock: true,
    isBestseller: true,
    volume: '100 мл',
    sku: 'BDY-001',
  },
  {
    id: 'p7',
    slug: 'molochko-lavanda',
    name: 'Молочко для тела с лавандой',
    shortDescription: 'Увлажняющее молочко с лавандой и маслом кокоса',
    description:
      'Нежное молочко для тела на основе масла кокоса, экстракта лаванды и пантенола. Интенсивно увлажняет, успокаивает раздражённую кожу и дарит ощущение нежности на целый день.',
    price: 680,
    imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
    categorySlug: 'body',
    inStock: true,
    volume: '200 мл',
    sku: 'BDY-002',
  },
  {
    id: 'p8',
    slug: 'krem-balzam-nogi',
    name: 'Крем-бальзам для ног',
    shortDescription: 'Интенсивный крем для ног с мятой и чайным деревом',
    description:
      'Интенсивный крем-бальзам для ног с мятой, маслом чайного дерева и мочевиной. Смягчает огрубевшую кожу, устраняет трещины на пятках и дарит ощущение лёгкости.',
    price: 580,
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80',
    categorySlug: 'body',
    inStock: true,
    weight: '75 мл',
    sku: 'BDY-003',
  },
  {
    id: 'p9',
    slug: 'sol-vann',
    name: 'Соль для ванн с травами',
    shortDescription: 'Расслабляющая соль для ванн с крымскими эфирными маслами',
    description:
      'Морская соль для ванн с эфирными маслами лаванды, мяты и чабреца. Расслабляет мышцы, успокаивает нервную систему и насыщает кожу минералами. Идеальна для вечернего ритуала.',
    price: 420,
    imageUrl: 'https://images.unsplash.com/photo-1556760544-74068565f05c?w=600&q=80',
    categorySlug: 'body',
    inStock: true,
    weight: '500 г',
    sku: 'BDY-004',
  },

  // ── Уход за волосами ───────────────────────────────────────────────────────
  {
    id: 'p10',
    slug: 'shampun-crimskie-travy',
    name: 'Шампунь с крымскими травами',
    shortDescription: 'Шампунь для всех типов волос с экстрактами крымских трав',
    description:
      'Мягкий шампунь на основе экстрактов крымских трав — ромашки, крапивы, чабреца. Бережно очищает волосы, не нарушая естественный баланс кожи головы. Без SLS и парабенов.',
    price: 650,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&q=80',
    categorySlug: 'hair',
    inStock: true,
    isBestseller: true,
    volume: '250 мл',
    sku: 'HR-001',
  },
  {
    id: 'p11',
    slug: 'balzam-opolaskivatel',
    name: 'Бальзам-ополаскиватель',
    shortDescription: 'Питательный бальзам с маслом арганы и жожоба',
    description:
      'Питательный бальзам для волос с маслом арганы, жожоба и экстрактом шёлка. Облегчает расчёсывание, придаёт блеск и защищает от термического воздействия.',
    price: 580,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    categorySlug: 'hair',
    inStock: true,
    volume: '250 мл',
    sku: 'HR-002',
  },
  {
    id: 'p12',
    slug: 'maska-volosy-pitatelnya',
    name: 'Маска для волос питательная',
    shortDescription: 'Глубоко питающая маска с крымским мёдом и яичным протеином',
    description:
      'Интенсивная питательная маска для сухих и повреждённых волос. Содержит крымский мёд, яичный протеин и масло жожоба. Восстанавливает структуру волоса, возвращает блеск и мягкость.',
    price: 780,
    oldPrice: 950,
    imageUrl: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
    categorySlug: 'hair',
    inStock: true,
    weight: '200 г',
    sku: 'HR-003',
  },

  // ── Натуральное мыло ───────────────────────────────────────────────────────
  {
    id: 'p13',
    slug: 'mylo-lavanda',
    name: 'Мыло натуральное "Лаванда"',
    shortDescription: 'Натуральное мыло ручной работы с крымской лавандой',
    description:
      'Мыло ручной работы на основе оливкового и кокосового масел с добавлением эфирного масла крымской лаванды. Нежно очищает, увлажняет и успокаивает кожу. Без искусственных красителей.',
    price: 280,
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80',
    categorySlug: 'soap',
    inStock: true,
    isBestseller: true,
    weight: '100 г',
    sku: 'SOP-001',
  },
  {
    id: 'p14',
    slug: 'mylo-chabrez-myata',
    name: 'Мыло "Чабрец и мята"',
    shortDescription: 'Освежающее мыло с чабрецом и мятой',
    description:
      'Освежающее натуральное мыло ручной работы с крымскими эфирными маслами чабреца и мяты. Тонизирует и освежает кожу, дарит ощущение чистоты на весь день.',
    price: 280,
    imageUrl: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=600&q=80',
    categorySlug: 'soap',
    inStock: true,
    weight: '100 г',
    sku: 'SOP-002',
  },
  {
    id: 'p15',
    slug: 'mylo-roza-krymskaya',
    name: 'Мыло "Роза крымская"',
    shortDescription: 'Роскошное мыло с лепестками крымской розы',
    description:
      'Роскошное мыло ручной работы с гидролатом крымской розы и лепестками. Нежно ухаживает за кожей, придаёт ей мягкость и цветочный аромат. Идеальный подарок.',
    price: 320,
    imageUrl: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80',
    categorySlug: 'soap',
    inStock: true,
    isNew: true,
    weight: '100 г',
    sku: 'SOP-003',
  },

  // ── Эфирные масла ─────────────────────────────────────────────────────────
  {
    id: 'p16',
    slug: 'efirnoye-maslo-lavanda',
    name: 'Эфирное масло лаванды',
    shortDescription: '100% натуральное эфирное масло крымской лаванды',
    description:
      'Чистое эфирное масло крымской лаванды, полученное методом паровой дистилляции. Обладает успокаивающим, противовоспалительным и антисептическим действием. Идеально для ароматерапии и ухода за кожей.',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
    categorySlug: 'oils',
    inStock: true,
    isBestseller: true,
    volume: '10 мл',
    sku: 'OIL-001',
  },
  {
    id: 'p17',
    slug: 'efirnoye-maslo-myata',
    name: 'Эфирное масло мяты',
    shortDescription: '100% натуральное эфирное масло перечной мяты',
    description:
      'Крымское эфирное масло перечной мяты высшей степени очистки. Освежает, тонизирует, помогает при головных болях и усталости. Используется в ароматерапии и косметологии.',
    price: 380,
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
    categorySlug: 'oils',
    inStock: true,
    volume: '10 мл',
    sku: 'OIL-002',
  },
  {
    id: 'p18',
    slug: 'efirnoye-maslo-roza',
    name: 'Эфирное масло розы',
    shortDescription: 'Премиальное эфирное масло крымской розы',
    description:
      'Редкое и драгоценное эфирное масло крымской розы Дамасской, полученное методом паровой дистилляции. Один из самых ценных ингредиентов в косметологии и ароматерапии. Премиальный продукт.',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=600&q=80',
    categorySlug: 'oils',
    inStock: true,
    volume: '5 мл',
    sku: 'OIL-003',
  },

  // ── Подарочные наборы ─────────────────────────────────────────────────────
  {
    id: 'p19',
    slug: 'nabor-krymskaya-lavanda',
    name: 'Набор "Крымская лаванда"',
    shortDescription: 'Подарочный набор из 4 средств с лавандой',
    description:
      'Красивый подарочный набор из 4 продуктов с крымской лавандой: ночной крем (50мл), тоник (150мл), молочко для тела (200мл), мыло (100г). Упаковано в элегантную коробку с натуральным наполнителем. Идеальный подарок для любого случая.',
    price: 2800,
    oldPrice: 3340,
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&q=80',
    categorySlug: 'sets',
    inStock: true,
    isBestseller: true,
    sku: 'SET-001',
  },
  {
    id: 'p20',
    slug: 'nabor-uhod-lico',
    name: 'Набор "Уход за лицом"',
    shortDescription: 'Полный набор для ухода за лицом из 5 средств',
    description:
      'Комплексный набор для ухода за лицом: дневной крем (50мл), ночной крем (50мл), тоник (150мл), сыворотка (30мл), маска с белой глиной (100г). Вся рутина ухода в одной элегантной коробке.',
    price: 3500,
    oldPrice: 4320,
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80',
    categorySlug: 'sets',
    inStock: true,
    isNew: true,
    sku: 'SET-002',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
