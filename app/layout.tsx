import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://phyton-crimea.vercel.app"),
  title: {
    default: "Фитон Крым — натуральная косметика из Крыма",
    template: "%s | Фитон Крым",
  },
  description:
    "Натуральная косметика ручной работы из Крыма. Бальзамы, мыло, бальзамы для губ на основе крымских трав и эфирных масел. Производство с 2009 года.",
  keywords: [
    "натуральная косметика",
    "крымская косметика",
    "бальзам",
    "натуральное мыло",
    "крымские травы",
    "фитон крым",
  ],
  authors: [{ name: "Фитон Крым" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://phyton-crimea.vercel.app",
    siteName: "Фитон Крым",
    title: "Фитон Крым — натуральная косметика из Крыма",
    description:
      "Натуральная косметика ручной работы из Крыма. Бальзамы, мыло, бальзамы для губ на основе крымских трав и эфирных масел.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Фитон Крым — натуральная косметика из Крыма",
    description: "Натуральная косметика ручной работы из Крыма.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Фитон Крым",
              url: "https://phyton-crimea.vercel.app",
              description:
                "Натуральная косметика ручной работы из Крыма с 2009 года",
              address: {
                "@type": "PostalAddress",
                addressRegion: "Крым",
                addressCountry: "RU",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "crimean.soap@gmail.com",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
