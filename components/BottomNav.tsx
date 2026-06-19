'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, SlidersHorizontal } from 'lucide-react';

const LINKS = [
  { href: '/', icon: Home, label: 'Udforsk' },
  { href: '/matches', icon: Heart, label: 'Favoritter' },
  { href: '/settings', icon: SlidersHorizontal, label: 'Indstillinger' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 bg-white border-t border-gray-100 safe-area-pb">
      <div className="flex items-stretch">
        {LINKS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                active ? 'text-blue-700' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-xs font-medium">{label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-blue-700" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
