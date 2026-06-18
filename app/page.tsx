'use client';

import dynamic from 'next/dynamic';

const SwipeStack = dynamic(() => import('@/components/SwipeStack'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Henter boliger...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return <SwipeStack />;
}
