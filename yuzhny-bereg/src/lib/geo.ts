import type { Coordinates } from '@/types/domain';

const fixed = (n: number): string => n.toFixed(5);

export const osmLink = (c: Coordinates, zoom = 16): string =>
  `https://www.openstreetmap.org/?mlat=${fixed(c.lat)}&mlon=${fixed(c.lng)}#map=${zoom}/${fixed(c.lat)}/${fixed(c.lng)}`;

export const yandexMapsLink = (c: Coordinates, zoom = 16): string =>
  `https://yandex.ru/maps/?pt=${fixed(c.lng)},${fixed(c.lat)}&z=${zoom}&l=map`;

/** Встраиваемая карта OpenStreetMap без JS-библиотек (загружается по клику). */
export function osmEmbed(c: Coordinates, delta = 0.008): string {
  const bbox = [c.lng - delta * 1.6, c.lat - delta, c.lng + delta * 1.6, c.lat + delta].map(fixed).join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${fixed(c.lat)},${fixed(c.lng)}`;
}

export const formatCoordinates = (c: Coordinates): string => `${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`;

/** Расстояние по прямой между точками, км (формула гаверсинусов). */
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
