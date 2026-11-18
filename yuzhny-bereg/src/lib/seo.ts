/**
 * Структурированные данные Schema.org (JSON-LD).
 * Для демо-записей разметка не формируется: вымышленные объекты не должны попадать в поисковую выдачу.
 */
import type { EventItem, Listing, Settlement } from '@/types/domain';
import { SITE } from '@/data/site';
import { isoDate } from './format';

type JsonLd = Record<string, unknown>;

export interface Crumb {
  label: string;
  href: string;
}

export function websiteSchema(siteUrl: string, searchUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    description: SITE.description,
    url: siteUrl,
    inLanguage: SITE.lang,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${searchUrl}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(crumbs: Crumb[], toAbsolute: (href: string) => string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: toAbsolute(c.href),
    })),
  };
}

const geo = (l: { coordinates?: { lat: number; lng: number } | undefined }) =>
  l.coordinates ? { '@type': 'GeoCoordinates', latitude: l.coordinates.lat, longitude: l.coordinates.lng } : undefined;

const postalAddress = (address: string | undefined, settlement: Settlement) => ({
  '@type': 'PostalAddress',
  addressLocality: settlement.title,
  addressRegion: 'Крым',
  ...(address ? { streetAddress: address } : {}),
});

function listingType(l: Listing): string {
  if (l.kind === 'service') return 'Service';
  if (l.kind === 'organization') {
    const types = l.serviceTypes.map((t) => t.id);
    if (types.some((t) => ['hotel', 'guest-house', 'apartments', 'recreation-base'].includes(t))) return 'LodgingBusiness';
    if (types.some((t) => ['restaurant', 'cafe', 'coffee-shop'].includes(t))) return 'FoodEstablishment';
    return 'LocalBusiness';
  }
  const types = l.serviceTypes.map((t) => t.id);
  if (types.includes('museum') || types.includes('palace')) return 'Museum';
  if (types.includes('temple')) return 'PlaceOfWorship';
  if (types.includes('park')) return 'Park';
  return 'TouristAttraction';
}

export function listingSchema(l: Listing, pageUrl: string, imageUrl?: string): JsonLd | undefined {
  if (l.demo) return undefined;
  const base: JsonLd = {
    '@context': 'https://schema.org',
    '@type': listingType(l),
    name: l.title,
    description: l.summary,
    url: pageUrl,
    ...(imageUrl ? { image: imageUrl } : {}),
  };
  if (l.kind === 'service') {
    return { ...base, areaServed: { '@type': 'Place', name: l.settlement.title } };
  }
  return {
    ...base,
    address: postalAddress(l.address, l.settlement),
    ...(geo(l) ? { geo: geo(l) } : {}),
    ...(l.contacts.phone ? { telephone: l.contacts.phone } : {}),
    ...(l.links.length || l.contacts.website ? { sameAs: [l.contacts.website, ...l.links.map((x) => x.url)].filter(Boolean) } : {}),
  };
}

export function eventSchema(e: EventItem, pageUrl: string, venueName: string, imageUrl?: string): JsonLd | undefined {
  if (e.demo) return undefined;
  const start = e.startTime ? `${isoDate(e.startDate)}T${e.startTime}:00+03:00` : isoDate(e.startDate);
  const endDate = e.endDate ?? (e.endTime ? e.startDate : undefined);
  const end = endDate ? (e.endTime ? `${isoDate(endDate)}T${e.endTime}:00+03:00` : isoDate(endDate)) : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    description: e.summary,
    url: pageUrl,
    startDate: start,
    ...(end ? { endDate: end } : {}),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: venueName, address: postalAddress(e.address, e.settlement), ...(geo(e) ? { geo: geo(e) } : {}) },
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(e.organizerName ? { organizer: { '@type': 'Organization', name: e.organizerName } } : {}),
  };
}

export function settlementSchema(s: Settlement, pageUrl: string, imageUrl?: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': s.kind === 'город' ? 'City' : 'Place',
    name: s.title,
    description: s.summary,
    url: pageUrl,
    containedInPlace: { '@type': 'Place', name: s.region.title },
    ...(s.coordinates ? { geo: { '@type': 'GeoCoordinates', latitude: s.coordinates.lat, longitude: s.coordinates.lng } } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(s.wikipedia ? { sameAs: [s.wikipedia] } : {}),
  };
}
