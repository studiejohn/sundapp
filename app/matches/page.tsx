'use client';

import { useEffect, useState } from 'react';
import { Property, PROPERTY_TYPE_LABELS, ENERGY_COLORS } from '@/lib/types';
import { PROPERTIES } from '@/lib/properties';
import { getLikedIds } from '@/lib/storage';
import PropertyModal from '@/components/PropertyModal';
import { Heart, MapPin, Home, Maximize2 } from 'lucide-react';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function MatchesPage() {
  const [liked, setLiked] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Property | null>(null);

  useEffect(() => {
    const ids = getLikedIds();
    setLiked(PROPERTIES.filter((p) => ids.has(p.id)));
  }, []);

  if (liked.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8 gap-4">
        <div className="text-6xl">💔</div>
        <h2 className="text-2xl font-black text-gray-800">Ingen favoritter endnu</h2>
        <p className="text-gray-500">
          Swipe til højre på boliger du synes godt om — de dukker op her.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={20} className="text-red-500 fill-red-500" />
          <h2 className="text-lg font-black text-gray-800">{liked.length} Favoritter</h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {liked.map((property) => (
            <button
              key={property.id}
              onClick={() => setSelected(property)}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex active:scale-[0.98] transition-transform text-left"
            >
              <div className="relative w-28 h-28 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
                  style={{ backgroundColor: ENERGY_COLORS[property.energyLabel] }}
                >
                  {property.energyLabel}
                </div>
              </div>

              <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="text-xs font-semibold text-blue-600 mb-0.5">
                    {PROPERTY_TYPE_LABELS[property.type]}
                  </div>
                  <div className="font-bold text-gray-900 text-sm leading-tight truncate">
                    {property.title}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 mt-1">
                    <MapPin size={11} />
                    <span className="text-xs truncate">{property.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-blue-700 font-black text-sm">{formatPrice(property.price)}</span>
                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <span className="flex items-center gap-0.5">
                      <Home size={11} />
                      {property.rooms}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Maximize2 size={11} />
                      {property.area} m²
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <PropertyModal
          property={selected}
          onClose={() => setSelected(null)}
          onLike={() => setSelected(null)}
          onDislike={() => setSelected(null)}
        />
      )}
    </div>
  );
}
