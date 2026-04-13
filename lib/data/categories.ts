import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    slug: 'face',
    name: 'Уход за лицом',
    description: 'Кремы, сыворотки, тоники и маски из крымских трав',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
  },
  {
    id: '2',
    slug: 'body',
    name: 'Уход за телом',
    description: 'Масла, молочко и кремы для нежной кожи',
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
  },
  {
    id: '3',
    slug: 'hair',
    name: 'Уход за волосами',
    description: 'Шампуни, бальзамы и маски на основе трав',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
  },
  {
    id: '4',
    slug: 'soap',
    name: 'Натуральное мыло',
    description: 'Ручная работа из натуральных масел и трав',
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80',
  },
  {
    id: '5',
    slug: 'oils',
    name: 'Эфирные масла',
    description: 'Чистые крымские эфирные масла холодного отжима',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
  },
  {
    id: '6',
    slug: 'sets',
    name: 'Подарочные наборы',
    description: 'Идеальные подарки из натуральной косметики',
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&q=80',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
