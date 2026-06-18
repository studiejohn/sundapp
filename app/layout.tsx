import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'BoligSwipe – Find din drømmebolig i Nordjylland',
  description: 'Swipe dig frem til din næste bolig i Nordjylland. Vores algoritme lærer dine præferencer og finder de bedste boliger til dig.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className="h-full">
      <body className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="shrink-0 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-center px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="text-xl font-black text-blue-700 tracking-tight">BoligSwipe</span>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Nordjylland</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
