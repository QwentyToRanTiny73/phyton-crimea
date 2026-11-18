import type { APIRoute } from 'astro';
import { getCatalog } from '@/lib/catalog';
import { absoluteUrl, routes } from '@/lib/url';

/**
 * GeoJSON всех объектов и событий с координатами — готовый источник для будущей карты на MapLibre GL JS
 * (map.addSource('places', { type: 'geojson', data: '<base>/data/places.geojson' })).
 */
export const GET: APIRoute = async ({ site }) => {
  const catalog = await getCatalog();
  const features = [
    ...catalog.listings
      .filter((l) => l.coordinates)
      .map((l) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [l.coordinates!.lng, l.coordinates!.lat] },
        properties: { id: l.id, type: 'listing', kind: l.kind, title: l.title, category: l.category.id, settlement: l.settlement.id, demo: l.demo, url: absoluteUrl(routes.listing(l.slug), site) },
      })),
    ...catalog.events
      .filter((e) => e.coordinates)
      .map((e) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [e.coordinates!.lng, e.coordinates!.lat] },
        properties: { id: e.id, type: 'event', title: e.title, category: e.eventCategory.id, settlement: e.settlement.id, demo: e.demo, url: absoluteUrl(routes.event(e.slug), site) },
      })),
  ];
  return new Response(JSON.stringify({ type: 'FeatureCollection', features }), {
    headers: { 'Content-Type': 'application/geo+json; charset=utf-8' },
  });
};
