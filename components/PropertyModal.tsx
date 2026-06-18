'use client';

import { useEffect } from 'react';
import { Property, PROPERTY_TYPE_LABELS, ENERGY_COLORS } from '@/lib/types';
import { X, Heart, MapPin, Home, Maximize2, Calendar, Zap, User, Phone, Clock } from 'lucide-react';

interface PropertyModalProps {
  property: Property;
  onClose: () => void;
  onLike: () => void;
  onDislike: () => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyModal({ property, onClose, onLike, onDislike }: PropertyModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const energyColor = ENERGY_COLORS[property.energyLabel];

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-h-[90vh] bg-white rounded-t-3xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header image */}
        <div className="relative h-52 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
          >
            <X size={18} className="text-gray-700" />
          </button>

          <div className="absolute bottom-3 left-4">
            <span className="text-white font-bold text-lg">{property.title}</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Price + address */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-black text-blue-700">{formatPrice(property.price)}</div>
                <div className="text-sm text-gray-500">{formatPrice(property.monthlyPayment)} / måned</div>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
                style={{ backgroundColor: energyColor }}
              >
                {property.energyLabel}
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-600 mt-2">
              <MapPin size={14} />
              <span className="text-sm">{property.address}, {property.postalCode} {property.city}</span>
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Home, label: 'Værelser', value: String(property.rooms) },
              { icon: Maximize2, label: 'Areal', value: `${property.area} m²` },
              { icon: Calendar, label: 'Byggeår', value: String(property.yearBuilt) },
              { icon: Zap, label: 'Energi', value: property.energyLabel },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-2xl p-3 text-center">
                <Icon size={18} className="text-blue-600 mx-auto mb-1" />
                <div className="text-sm font-bold text-gray-800">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          {/* Extra details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between bg-gray-50 rounded-xl px-3 py-2">
              <span className="text-gray-500">Type</span>
              <span className="font-semibold">{PROPERTY_TYPE_LABELS[property.type]}</span>
            </div>
            <div className="flex justify-between bg-gray-50 rounded-xl px-3 py-2">
              <span className="text-gray-500">Badeværelser</span>
              <span className="font-semibold">{property.bathrooms}</span>
            </div>
            {property.landArea && (
              <div className="flex justify-between bg-gray-50 rounded-xl px-3 py-2">
                <span className="text-gray-500">Grundareal</span>
                <span className="font-semibold">{property.landArea} m²</span>
              </div>
            )}
            <div className="flex justify-between bg-gray-50 rounded-xl px-3 py-2">
              <span className="text-gray-500 flex items-center gap-1"><Clock size={12} />På markedet</span>
              <span className="font-semibold">{property.daysOnMarket} dage</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Beskrivelse</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Faciliteter</h3>
            <div className="flex flex-wrap gap-2">
              {property.features.map((f) => (
                <span key={f} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Agent */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-bold text-gray-800 mb-3">Mægler</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{property.agent.name}</div>
                <div className="text-sm text-gray-500">{property.agent.company}</div>
              </div>
              <a
                href={`tel:${property.agent.phone}`}
                className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center"
              >
                <Phone size={16} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onDislike}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-red-200 text-red-500 font-bold active:scale-95 transition-transform"
          >
            <X size={20} />
            Nej tak
          </button>
          <button
            onClick={onLike}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-700 text-white font-bold active:scale-95 transition-transform"
          >
            <Heart size={20} />
            Gem bolig
          </button>
        </div>
      </div>
    </div>
  );
}
