/**
 * Схема данных платформы «Южный берег».
 *
 * Все сущности хранятся локально: справочники — в JSON (src/data), объекты, события и подборки —
 * в Markdown с frontmatter (src/content). Связи между сущностями задаются через reference(),
 * поэтому одна и та же информация не дублируется: фото описано один раз в photos.json,
 * населённый пункт — один раз в settlements.json и т. д.
 *
 * Компоненты не читают коллекции напрямую — только через слой src/lib/catalog.ts.
 * Это позволяет позже заменить источник (Supabase, PostgreSQL, CMS) без переделки интерфейса.
 */
import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ICON_KEYS } from './data/icon-keys';

const iconKey = z.enum(ICON_KEYS);

const coordinates = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  /** Откуда взяты координаты: «Википедия», «Викиданные», «владелец объекта». */
  source: z.string().optional(),
});

const contacts = z
  .object({
    phone: z.string().optional(),
    email: z.email().optional(),
    website: z.url().optional(),
  })
  .default({});

const social = z.object({
  network: z.enum(['telegram', 'vk', 'max', 'ok', 'whatsapp', 'youtube', 'instagram', 'other']),
  url: z.url(),
  label: z.string().optional(),
});

const externalLink = z.object({ label: z.string(), url: z.url() });

const verification = z.object({
  /**
   * sourced — факты взяты из открытых источников (указаны в sources);
   * owner — данные подтверждены владельцем;
   * demo — тестовая запись, вымышленная;
   * unverified — требует проверки.
   */
  status: z.enum(['sourced', 'owner', 'demo', 'unverified']),
  note: z.string().optional(),
  sources: z.array(z.url()).default([]),
  checkedAt: z.coerce.date().optional(),
});

const publication = {
  status: z.enum(['published', 'draft', 'archived']).default('published'),
  /** Тестовая запись: помечается в интерфейсе, закрыта от индексации и не попадает в sitemap. */
  demo: z.boolean().default(false),
  featured: z.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
};

const location = z.object({
  title: z.string().optional(),
  settlement: reference('settlements'),
  address: z.string().optional(),
  coordinates: coordinates.optional(),
});

const regions = defineCollection({
  loader: file('src/data/regions.json'),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string(),
    order: z.number().int(),
    active: z.boolean().default(true),
  }),
});

const photos = defineCollection({
  loader: file('src/data/photos.json'),
  schema: ({ image }) =>
    z.object({
      src: image(),
      alt: z.string().min(5),
      author: z.string(),
      license: z.string(),
      licenseUrl: z.url().optional(),
      sourceUrl: z.url(),
      sourceName: z.string(),
    }),
});

const settlements = defineCollection({
  loader: file('src/data/settlements.json'),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['город', 'посёлок', 'село']),
    region: reference('regions'),
    order: z.number().int(),
    summary: z.string().max(200),
    description: z.array(z.string()).min(1),
    coordinates: coordinates.optional(),
    photo: reference('photos'),
    wikipedia: z.url().optional(),
  }),
});

const categories = defineCollection({
  loader: file('src/data/categories.json'),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    icon: iconKey,
    tone: z.enum(['olive', 'sea', 'terracotta', 'sand']),
    order: z.number().int(),
    /** listings — каталог объектов; events — раздел афиши. */
    section: z.enum(['listings', 'events']),
    summary: z.string(),
    intro: z.string(),
  }),
});

const serviceTypes = defineCollection({
  loader: file('src/data/service-types.json'),
  schema: z.object({
    title: z.string(),
    category: reference('categories'),
  }),
});

const eventCategories = defineCollection({
  loader: file('src/data/event-categories.json'),
  schema: z.object({
    title: z.string(),
    icon: iconKey,
    order: z.number().int(),
  }),
});

const listings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/listings' }),
  schema: z.object({
    title: z.string(),
    /** place — место, organization — организация/ИП/самозанятый, service — отдельная услуга. */
    kind: z.enum(['place', 'organization', 'service']),
    legalForm: z.enum(['company', 'sole-proprietor', 'self-employed', 'nonprofit', 'state']).optional(),
    category: reference('categories'),
    extraCategories: z.array(reference('categories')).default([]),
    serviceTypes: z.array(reference('serviceTypes')).default([]),
    settlement: reference('settlements'),
    summary: z.string().min(20).max(240),
    address: z.string().optional(),
    coordinates: coordinates.optional(),
    photos: z.array(reference('photos')).default([]),
    contacts,
    socials: z.array(social).default([]),
    links: z.array(externalLink).default([]),
    hours: z.string().optional(),
    price: z.string().optional(),
    features: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    /** Для услуги — организация, которая её оказывает. */
    provider: reference('listings').optional(),
    /** Дополнительные точки организации (филиалы, причалы, площадки). */
    locations: z.array(location).default([]),
    related: z.array(reference('listings')).default([]),
    verification,
    ...publication,
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    eventCategory: reference('eventCategories'),
    settlement: reference('settlements'),
    summary: z.string().min(20).max(240),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    /** Площадка из каталога или текстовое название площадки. */
    venue: reference('listings').optional(),
    venueName: z.string().optional(),
    address: z.string().optional(),
    coordinates: coordinates.optional(),
    organizer: reference('listings').optional(),
    organizerName: z.string().optional(),
    price: z.string().optional(),
    contacts,
    socials: z.array(social).default([]),
    links: z.array(externalLink).default([]),
    registrationUrl: z.url().optional(),
    photos: z.array(reference('photos')).default([]),
    tags: z.array(z.string()).default([]),
    verification,
    ...publication,
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().min(20).max(240),
    cover: reference('photos'),
    items: z.array(reference('listings')).min(2),
    duration: z.string().optional(),
    format: z.string().optional(),
    tags: z.array(z.string()).default([]),
    status: publication.status,
    featured: publication.featured,
    createdAt: publication.createdAt,
    updatedAt: publication.updatedAt,
  }),
});

export const collections = {
  regions,
  photos,
  settlements,
  categories,
  serviceTypes,
  eventCategories,
  listings,
  events,
  guides,
};
