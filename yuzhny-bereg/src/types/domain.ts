/**
 * Доменная модель платформы.
 *
 * Эти интерфейсы не зависят от источника данных: сейчас их заполняет src/lib/catalog.ts из
 * Astro Content Collections, в будущем — Supabase/PostgreSQL/CMS. Компоненты интерфейса
 * работают только с этими типами, все ссылки (категория, населённый пункт, фото) уже развёрнуты
 * в объекты.
 */
import type { ImageMetadata } from 'astro';
import type { IconKey } from '@/data/icon-keys';

export type Tone = 'olive' | 'sea' | 'terracotta' | 'sand';

export interface Coordinates {
  lat: number;
  lng: number;
  source?: string | undefined;
}

export interface Photo {
  id: string;
  src: ImageMetadata;
  alt: string;
  author: string;
  license: string;
  licenseUrl?: string | undefined;
  sourceUrl: string;
  sourceName: string;
}

export interface Region {
  id: string;
  title: string;
  summary: string;
  description: string;
  order: number;
  active: boolean;
}

export type SettlementKind = 'город' | 'посёлок' | 'село';

export interface Settlement {
  id: string;
  slug: string;
  title: string;
  kind: SettlementKind;
  region: Region;
  order: number;
  summary: string;
  description: string[];
  coordinates?: Coordinates | undefined;
  photo: Photo;
  wikipedia?: string | undefined;
}

export type CategorySection = 'listings' | 'events';

export interface Category {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  icon: IconKey;
  tone: Tone;
  order: number;
  section: CategorySection;
  summary: string;
  intro: string;
}

export interface ServiceType {
  id: string;
  title: string;
  category: Category;
}

export interface EventCategory {
  id: string;
  slug: string;
  title: string;
  icon: IconKey;
  order: number;
}

export type ListingKind = 'place' | 'organization' | 'service';
export type LegalForm = 'company' | 'sole-proprietor' | 'self-employed' | 'nonprofit' | 'state';
export type PublicationStatus = 'published' | 'draft' | 'archived';
export type VerificationStatus = 'sourced' | 'owner' | 'demo' | 'unverified';
export type SocialNetwork = 'telegram' | 'vk' | 'max' | 'ok' | 'whatsapp' | 'youtube' | 'instagram' | 'other';

export interface Contacts {
  phone?: string | undefined;
  email?: string | undefined;
  website?: string | undefined;
}

export interface SocialLink {
  network: SocialNetwork;
  url: string;
  label?: string | undefined;
}

export interface ExternalLink {
  label: string;
  url: string;
}

export interface Verification {
  status: VerificationStatus;
  note?: string | undefined;
  sources: string[];
  checkedAt?: Date | undefined;
}

export interface Location {
  title?: string | undefined;
  settlement: Settlement;
  address?: string | undefined;
  coordinates?: Coordinates | undefined;
}

/** Общие поля любой карточки каталога (объект или событие). */
export interface EntityBase {
  id: string;
  slug: string;
  title: string;
  summary: string;
  settlement: Settlement;
  address?: string | undefined;
  coordinates?: Coordinates | undefined;
  photos: Photo[];
  contacts: Contacts;
  socials: SocialLink[];
  links: ExternalLink[];
  price?: string | undefined;
  tags: string[];
  verification: Verification;
  status: PublicationStatus;
  demo: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Listing extends EntityBase {
  kind: ListingKind;
  legalForm?: LegalForm | undefined;
  category: Category;
  extraCategories: Category[];
  serviceTypes: ServiceType[];
  hours?: string | undefined;
  features: string[];
  /** ID организации, оказывающей услугу (для kind === 'service'). */
  providerId?: string | undefined;
  locations: Location[];
  relatedIds: string[];
}

export interface EventItem extends EntityBase {
  category: Category;
  eventCategory: EventCategory;
  startDate: Date;
  endDate?: Date | undefined;
  startTime?: string | undefined;
  endTime?: string | undefined;
  venueId?: string | undefined;
  venueName?: string | undefined;
  organizerId?: string | undefined;
  organizerName?: string | undefined;
  registrationUrl?: string | undefined;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover: Photo;
  itemIds: string[];
  duration?: string | undefined;
  format?: string | undefined;
  tags: string[];
  status: PublicationStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
