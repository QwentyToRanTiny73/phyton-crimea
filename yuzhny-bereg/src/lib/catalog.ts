/**
 * Слой доступа к данным.
 *
 * Единственное место, где читаются Astro Content Collections. Здесь ссылки (reference) превращаются
 * в готовые объекты, проверяется целостность связей и отбираются только опубликованные записи.
 * При переходе на Supabase/PostgreSQL/CMS достаточно переписать этот модуль, сохранив его API.
 */
import { getCollection, render, type CollectionEntry } from 'astro:content';
import type {
  Category,
  Contacts,
  EventCategory,
  EventItem,
  Guide,
  Listing,
  Photo,
  Region,
  ServiceType,
  Settlement,
} from '@/types/domain';

export interface Catalog {
  regions: Region[];
  settlements: Settlement[];
  categories: Category[];
  serviceTypes: ServiceType[];
  eventCategories: EventCategory[];
  photos: Photo[];
  listings: Listing[];
  events: EventItem[];
  guides: Guide[];
  listingById: Map<string, Listing>;
  eventById: Map<string, EventItem>;
  settlementById: Map<string, Settlement>;
  categoryById: Map<string, Category>;
}

type Ref = { id: string };

class DataError extends Error {
  constructor(message: string) {
    super(`[данные] ${message}`);
    this.name = 'DataError';
  }
}

function resolve<T>(map: Map<string, T>, ref: Ref | string, context: string): T {
  const id = typeof ref === 'string' ? ref : ref.id;
  const value = map.get(id);
  if (!value) throw new DataError(`${context}: ссылка на несуществующую запись «${id}»`);
  return value;
}

function byOrderThenTitle<T extends { order: number; title: string }>(a: T, b: T): number {
  return a.order - b.order || a.title.localeCompare(b.title, 'ru');
}

function cleanContacts(c: { phone?: string | undefined; email?: string | undefined; website?: string | undefined }): Contacts {
  return { phone: c.phone, email: c.email, website: c.website };
}

const listingEntries = new Map<string, CollectionEntry<'listings'>>();
const eventEntries = new Map<string, CollectionEntry<'events'>>();
const guideEntries = new Map<string, CollectionEntry<'guides'>>();

async function buildCatalog(): Promise<Catalog> {
  const [regionE, photoE, settlementE, categoryE, typeE, eventCatE, listingE, eventE, guideE] = await Promise.all([
    getCollection('regions'),
    getCollection('photos'),
    getCollection('settlements'),
    getCollection('categories'),
    getCollection('serviceTypes'),
    getCollection('eventCategories'),
    getCollection('listings'),
    getCollection('events'),
    getCollection('guides'),
  ]);

  const regions: Region[] = regionE.map((e) => ({ id: e.id, ...e.data })).sort(byOrderThenTitle);
  const regionById = new Map(regions.map((r) => [r.id, r]));

  const photos: Photo[] = photoE.map((e) => ({ id: e.id, ...e.data }));
  const photoById = new Map(photos.map((p) => [p.id, p]));

  const settlements: Settlement[] = settlementE
    .map((e) => ({
      id: e.id,
      slug: e.id,
      title: e.data.title,
      kind: e.data.kind,
      region: resolve(regionById, e.data.region, `Населённый пункт ${e.id}`),
      order: e.data.order,
      summary: e.data.summary,
      description: e.data.description,
      coordinates: e.data.coordinates,
      photo: resolve(photoById, e.data.photo, `Населённый пункт ${e.id}`),
      wikipedia: e.data.wikipedia,
    }))
    .sort(byOrderThenTitle);
  const settlementById = new Map(settlements.map((s) => [s.id, s]));

  const categories: Category[] = categoryE.map((e) => ({ id: e.id, slug: e.id, ...e.data })).sort(byOrderThenTitle);
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const eventsCategory = categories.find((c) => c.section === 'events');
  if (!eventsCategory) throw new DataError('нет категории с section: "events"');

  const serviceTypes: ServiceType[] = typeE.map((e) => ({
    id: e.id,
    title: e.data.title,
    category: resolve(categoryById, e.data.category, `Тип услуги ${e.id}`),
  }));
  const typeById = new Map(serviceTypes.map((t) => [t.id, t]));

  const eventCategories: EventCategory[] = eventCatE
    .map((e) => ({ id: e.id, slug: e.id, ...e.data }))
    .sort(byOrderThenTitle);
  const eventCategoryById = new Map(eventCategories.map((c) => [c.id, c]));

  listingEntries.clear();
  const listings: Listing[] = [];
  for (const e of listingE) {
    if (e.data.status !== 'published') continue;
    listingEntries.set(e.id, e);
    const d = e.data;
    const ctx = `Объект ${e.id}`;
    listings.push({
      id: e.id,
      slug: e.id,
      title: d.title,
      summary: d.summary,
      kind: d.kind,
      legalForm: d.legalForm,
      category: resolve(categoryById, d.category, ctx),
      extraCategories: d.extraCategories.map((r) => resolve(categoryById, r, ctx)),
      serviceTypes: d.serviceTypes.map((r) => resolve(typeById, r, ctx)),
      settlement: resolve(settlementById, d.settlement, ctx),
      address: d.address,
      coordinates: d.coordinates,
      photos: d.photos.map((r) => resolve(photoById, r, ctx)),
      contacts: cleanContacts(d.contacts),
      socials: d.socials,
      links: d.links,
      hours: d.hours,
      price: d.price,
      features: d.features,
      tags: d.tags,
      providerId: d.provider?.id,
      locations: d.locations.map((l) => ({
        title: l.title,
        settlement: resolve(settlementById, l.settlement, ctx),
        address: l.address,
        coordinates: l.coordinates,
      })),
      relatedIds: d.related.map((r) => r.id),
      verification: d.verification,
      status: d.status,
      demo: d.demo,
      featured: d.featured,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    });
  }
  const listingById = new Map(listings.map((l) => [l.id, l]));

  // Целостность связей между объектами.
  for (const l of listings) {
    if (l.providerId) {
      const provider = resolve(listingById, l.providerId, `Объект ${l.id} (provider)`);
      if (provider.kind !== 'organization') throw new DataError(`Объект ${l.id}: provider «${provider.id}» должен быть организацией`);
    }
    for (const id of l.relatedIds) resolve(listingById, id, `Объект ${l.id} (related)`);
    if (l.demo !== (l.verification.status === 'demo')) {
      throw new DataError(`Объект ${l.id}: demo: true и verification.status: demo должны совпадать`);
    }
  }

  eventEntries.clear();
  const events: EventItem[] = [];
  for (const e of eventE) {
    if (e.data.status !== 'published') continue;
    eventEntries.set(e.id, e);
    const d = e.data;
    const ctx = `Событие ${e.id}`;
    if (d.venue) resolve(listingById, d.venue, `${ctx} (venue)`);
    if (d.organizer) resolve(listingById, d.organizer, `${ctx} (organizer)`);
    if (d.endDate && d.endDate < d.startDate) throw new DataError(`${ctx}: endDate раньше startDate`);
    if (d.demo !== (d.verification.status === 'demo')) throw new DataError(`${ctx}: demo и verification.status: demo должны совпадать`);
    events.push({
      id: e.id,
      slug: e.id,
      title: d.title,
      summary: d.summary,
      category: eventsCategory,
      eventCategory: resolve(eventCategoryById, d.eventCategory, ctx),
      settlement: resolve(settlementById, d.settlement, ctx),
      address: d.address,
      coordinates: d.coordinates,
      photos: d.photos.map((r) => resolve(photoById, r, ctx)),
      contacts: cleanContacts(d.contacts),
      socials: d.socials,
      links: d.links,
      price: d.price,
      tags: d.tags,
      startDate: d.startDate,
      endDate: d.endDate,
      startTime: d.startTime,
      endTime: d.endTime,
      venueId: d.venue?.id,
      venueName: d.venueName,
      organizerId: d.organizer?.id,
      organizerName: d.organizerName,
      registrationUrl: d.registrationUrl,
      verification: d.verification,
      status: d.status,
      demo: d.demo,
      featured: d.featured,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    });
  }
  events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime() || a.title.localeCompare(b.title, 'ru'));
  const eventById = new Map(events.map((e) => [e.id, e]));

  guideEntries.clear();
  const guides: Guide[] = [];
  for (const e of guideE) {
    if (e.data.status !== 'published') continue;
    guideEntries.set(e.id, e);
    const d = e.data;
    const ctx = `Подборка ${e.id}`;
    guides.push({
      id: e.id,
      slug: e.id,
      title: d.title,
      summary: d.summary,
      cover: resolve(photoById, d.cover, ctx),
      itemIds: d.items.map((r) => resolve(listingById, r, ctx).id),
      duration: d.duration,
      format: d.format,
      tags: d.tags,
      status: d.status,
      featured: d.featured,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    });
  }
  guides.sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title, 'ru'));

  listings.sort((a, b) => a.title.localeCompare(b.title, 'ru'));

  return {
    regions,
    settlements,
    categories,
    serviceTypes,
    eventCategories,
    photos,
    listings,
    events,
    guides,
    listingById,
    eventById,
    settlementById,
    categoryById,
  };
}

let cached: Promise<Catalog> | undefined;

/** Загружает и кеширует каталог на время сборки. В dev-режиме всегда читает свежие данные. */
export function getCatalog(): Promise<Catalog> {
  if (import.meta.env.DEV) return buildCatalog();
  return (cached ??= buildCatalog());
}

/** Рендер полного описания (Markdown-тело записи). */
export async function renderBody(kind: 'listing' | 'event' | 'guide', id: string) {
  await getCatalog();
  const entry = kind === 'listing' ? listingEntries.get(id) : kind === 'event' ? eventEntries.get(id) : guideEntries.get(id);
  if (!entry) throw new DataError(`нет записи ${kind} «${id}» для рендера`);
  return render(entry);
}

/* ---------- Выборки ---------- */

export function listingsInCategory(catalog: Catalog, categoryId: string): Listing[] {
  return catalog.listings.filter((l) => l.category.id === categoryId || l.extraCategories.some((c) => c.id === categoryId));
}

export function listingsInSettlement(catalog: Catalog, settlementId: string): Listing[] {
  return catalog.listings.filter((l) => l.settlement.id === settlementId || l.locations.some((loc) => loc.settlement.id === settlementId));
}

export function eventsInSettlement(catalog: Catalog, settlementId: string): EventItem[] {
  return catalog.events.filter((e) => e.settlement.id === settlementId);
}

/** Услуги, которые оказывает организация. */
export function servicesOf(catalog: Catalog, organizationId: string): Listing[] {
  return catalog.listings.filter((l) => l.providerId === organizationId);
}

/** События, где объект — организатор или площадка. */
export function eventsLinkedTo(catalog: Catalog, listingId: string): EventItem[] {
  return catalog.events.filter((e) => e.organizerId === listingId || e.venueId === listingId);
}

export function guidesWith(catalog: Catalog, listingId: string): Guide[] {
  return catalog.guides.filter((g) => g.itemIds.includes(listingId));
}

/**
 * Похожие объекты: сначала явно связанные, затем того же типа в том же месте,
 * затем той же категории, затем из того же населённого пункта. Реальные записи выше демо.
 */
export function relatedListings(catalog: Catalog, listing: Listing, limit = 4): Listing[] {
  const explicit = listing.relatedIds.map((id) => catalog.listingById.get(id)).filter((l): l is Listing => Boolean(l));
  const score = (l: Listing): number => {
    let s = 0;
    if (l.category.id === listing.category.id) s += 2;
    if (l.settlement.id === listing.settlement.id) s += 1.5;
    if (l.serviceTypes.some((t) => listing.serviceTypes.some((u) => u.id === t.id))) s += 1;
    if (l.demo === listing.demo) s += 0.5;
    return s;
  };
  const rest = catalog.listings
    .filter((l) => l.id !== listing.id && !explicit.includes(l) && l.id !== listing.providerId && l.providerId !== listing.id)
    .map((l) => ({ l, s: score(l) }))
    .filter((x) => x.s >= 1.5)
    .sort((a, b) => b.s - a.s || a.l.title.localeCompare(b.l.title, 'ru'))
    .map((x) => x.l);
  return [...explicit, ...rest].slice(0, limit);
}

export function upcomingEvents(catalog: Catalog, from: Date, limit?: number): EventItem[] {
  const day = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const list = catalog.events.filter((e) => (e.endDate ?? e.startDate) >= day);
  return limit ? list.slice(0, limit) : list;
}

export function countByCategory(catalog: Catalog): Map<string, number> {
  const counts = new Map<string, number>();
  for (const c of catalog.categories) {
    counts.set(c.id, c.section === 'events' ? catalog.events.length : listingsInCategory(catalog, c.id).length);
  }
  return counts;
}
