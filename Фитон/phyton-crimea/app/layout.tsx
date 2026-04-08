import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: {
    default: 'Фитон Крым — Натуральная косметика из Крыма',
    template: '%s | Фитон Крым',
  },
  description:
    'Натуральная косметика на основе крымских трав и растений. Производим с 2009 года. Кремы, масла, эфирные масла, мыло ручной работы.',
  keywords: [
    'натуральная косметика',
    'крымская косметика',
    'фитон крым',
    'эфирные масла',
    'натуральное мыло',
    'уход за лицом',
  ],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Фитон Крым',
    title: 'Фитон Крым — Натуральная косметика из Крыма',
    description:
      'Натуральная косметика на основе крымских трав и растений. С 2009 года.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap&subset=latin,cyrillic"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <Header />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
