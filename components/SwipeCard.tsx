'use client';

import { useRef, useState, useCallback, CSSProperties } from 'react';
import { Property, PROPERTY_TYPE_LABELS, ENERGY_COLORS } from '@/lib/types';
import { MapPin, Home, Maximize2, Calendar, Info } from 'lucide-react';

interface SwipeCardProps {
  property: Property;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onInfo: () => void;
  stackIndex: number;
}

const SWIPE_THRESHOLD = 90;

function formatPrice(price: number): string {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function SwipeCard({
  property,
  onSwipeLeft,
  onSwipeRight,
  onInfo,
  stackIndex,
}: SwipeCardProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [leaving, setLeaving] = useState<'left' | 'right' | null>(null);
  const isDragging = useRef(false);
  const origin = useRef({ x: 0, y: 0 });
  const isTop = stackIndex === 0;

  const triggerSwipe = useCallback(
    (dir: 'left' | 'right') => {
      setLeaving(dir);
      const targetX = dir === 'right' ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;
      setPos({ x: targetX, y: 0 });
      setTimeout(() => {
        if (dir === 'right') onSwipeRight();
        else onSwipeLeft();
      }, 380);
    },
    [onSwipeLeft, onSwipeRight]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isTop || leaving) return;
      isDragging.current = true;
      origin.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [isTop, leaving, pos.x, pos.y]
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    setPos({ x: e.clientX - origin.current.x, y: e.clientY - origin.current.y });
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setPos((current) => {
      if (current.x > SWIPE_THRESHOLD) {
        triggerSwipe('right');
        return current;
      } else if (current.x < -SWIPE_THRESHOLD) {
        triggerSwipe('left');
        return current;
      }
      return { x: 0, y: 0 };
    });
  }, [triggerSwipe]);

  const rotation = pos.x * 0.06;
  const likeOpacity = Math.min(1, Math.max(0, pos.x / SWIPE_THRESHOLD));
  const nopeOpacity = Math.min(1, Math.max(0, -pos.x / SWIPE_THRESHOLD));

  const scale = 1 - stackIndex * 0.04;
  const translateY = stackIndex * 12;

  const cardStyle: CSSProperties = isTop
    ? {
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg)`,
        transition: isDragging.current || leaving ? 'none' : 'transform 0.35s ease',
        touchAction: 'none',
        zIndex: 30,
        cursor: leaving ? 'default' : 'grab',
      }
    : {
        transform: `scale(${scale}) translateY(${translateY}px)`,
        zIndex: 30 - stackIndex,
        pointerEvents: 'none',
      };

  const energyColor = ENERGY_COLORS[property.energyLabel];

  return (
    <div
      className="absolute inset-0"
      style={cardStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="h-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col select-none">
        {/* Image */}
        <div className="relative flex-1 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Like badge */}
          <div
            className="absolute top-6 left-6 px-4 py-2 rounded-xl border-4 border-green-400 rotate-[-15deg]"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-green-400 font-black text-2xl tracking-widest">SYNES GODT OM</span>
          </div>

          {/* Nope badge */}
          <div
            className="absolute top-6 right-6 px-4 py-2 rounded-xl border-4 border-red-400 rotate-[15deg]"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-red-400 font-black text-2xl tracking-widest">NEJ TAK</span>
          </div>

          {/* Type badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
            <span className="text-xs font-semibold text-gray-700">{PROPERTY_TYPE_LABELS[property.type]}</span>
          </div>

          {/* Energy label */}
          <div
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: energyColor }}
          >
            <span className="text-white text-xs font-black">{property.energyLabel}</span>
          </div>

          {/* Days on market */}
          {property.daysOnMarket <= 7 && (
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-orange-500 rounded-full">
              <span className="text-white text-xs font-bold">NYT</span>
            </div>
          )}

          {/* Info button */}
          {isTop && (
            <button
              className="absolute bottom-3 left-1/2 -translate-x-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onInfo(); }}
            >
              <Info size={16} className="text-gray-700" />
            </button>
          )}
        </div>

        {/* Info */}
        <div className="px-5 py-4 bg-white">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{property.title}</h2>
          </div>

          <div className="flex items-center gap-1 text-gray-500 mb-3">
            <MapPin size={13} />
            <span className="text-sm">{property.address}, {property.postalCode} {property.city}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-blue-700">{formatPrice(property.price)}</span>
            <span className="text-sm text-gray-500">
              {formatPrice(property.monthlyPayment)}/md.
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-gray-600 text-sm">
            <span className="flex items-center gap-1">
              <Home size={13} />
              {property.rooms} vær.
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 size={13} />
              {property.area} m²
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {property.yearBuilt}
            </span>
            {property.landArea && (
              <span className="text-gray-400 text-xs">Grund: {property.landArea} m²</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
