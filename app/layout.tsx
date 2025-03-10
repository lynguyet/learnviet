import type { Metadata } from "next";
import "./globals.css";
import { DM_Serif_Display, Be_Vietnam_Pro } from 'next/font/google'
import Navigation from './components/Navigation';

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | LearnViet',
    default: 'LearnViet - Learn Vietnamese Language Tool',
  },
  description: 'Practice Vietnamese pronunciation and expand your vocabulary with LearnViet.',
  keywords: ['vietnamese', 'language learning', 'pronunciation', 'vocabulary'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'LearnViet',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://learnviet.vercel.app'),
  openGraph: {
    title: 'LearnViet - Learn Vietnamese Language Online',
    description: 'Practice Vietnamese pronunciation and expand your vocabulary with LearnViet.',
    url: 'https://learnviet.vercel.ap',
    siteName: 'LearnViet',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LearnViet - Learn Vietnamese Language',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LearnViet - Learn Vietnamese Language Online',
    description: 'Practice Vietnamese pronunciation and expand your vocabulary with LearnViet.',
    images: ['https://your-domain.com/twitter-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${beVietnamPro.variable} antialiased`}>
      <body className={`${beVietnamPro.className} min-h-screen bg-[#f6f6ea80]`}>
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
