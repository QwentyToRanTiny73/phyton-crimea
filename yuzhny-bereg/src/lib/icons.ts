import {
  BedDouble,
  CalendarDays,
  Compass,
  ConciergeBell,
  Footprints,
  Frame,
  Guitar,
  Hammer,
  Landmark,
  Mountain,
  Palette,
  PartyPopper,
  Route,
  Sailboat,
  Trophy,
  UtensilsCrossed,
} from '@lucide/astro';
import type { IconKey } from '@/data/icon-keys';

/** Соответствие ключей иконок из данных компонентам Lucide (SVG без JS). */
export const ICONS: Record<IconKey, typeof BedDouble> = {
  'bed-double': BedDouble,
  'utensils-crossed': UtensilsCrossed,
  landmark: Landmark,
  mountain: Mountain,
  compass: Compass,
  footprints: Footprints,
  sailboat: Sailboat,
  'calendar-days': CalendarDays,
  hammer: Hammer,
  'concierge-bell': ConciergeBell,
  guitar: Guitar,
  'party-popper': PartyPopper,
  frame: Frame,
  palette: Palette,
  trophy: Trophy,
  route: Route,
};
