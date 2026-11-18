import type { Tone } from '@/types/domain';

/** Полные строки классов (Tailwind находит их статически при сборке). */
export const TONE: Record<Tone, { surface: string; ink: string; solid: string }> = {
  olive: { surface: 'bg-olive-soft', ink: 'text-olive-dark', solid: 'bg-olive' },
  sea: { surface: 'bg-sea-soft', ink: 'text-sea-dark', solid: 'bg-sea' },
  terracotta: { surface: 'bg-terracotta-soft', ink: 'text-terracotta-dark', solid: 'bg-terracotta' },
  sand: { surface: 'bg-sand-100', ink: 'text-graphite-soft', solid: 'bg-sand-300' },
};
