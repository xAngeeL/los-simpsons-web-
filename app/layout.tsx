import './globals.css';
import { ThemeProvider } from '@/lib/theme';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Homerverso.tv – Ver Los Simpsons Online en HD Castellano y Latino',
  description:
    'Disfruta de todas las temporadas y películas de Los Simpsons en Homerverso.tv. Ver online o descargar en HD, en castellano y latino. ¡Tu dosis de Springfield, gratis!',
  metadataBase: new URL('https://homerverso.tv'),
  openGraph: {
    title: 'Homerverso.tv – Ver Los Simpsons Online en HD',
    description:
      'Todas las temporadas completas y películas de Los Simpsons disponibles en HD, en castellano y latino. Gratuito y sin registros.',
    url: 'https://homerverso.tv',
    siteName: 'Homerverso.tv',
    images: [
      {
        url: 'https://homerverso.tv/peliculas-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Homerverso.tv',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Homerverso.tv – Ver Los Simpsons Online en HD',
    description:
      'Temporadas completas, películas y más de Los Simpsons. Gratis, HD, Castellano y Latino.',
    images: ['https://homerverso.tv/peliculas-banner.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

// 👇 Aquí es donde movemos el themeColor
export const viewport = {
  themeColor: '#FFD90F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="transition-colors bg-white dark:bg-[#0B1E3D] text-[#0F172A] dark:text-white">
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
