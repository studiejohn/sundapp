'use client';

import { useEffect, useState } from 'react';
import { UserPreferences, PropertyType, PROPERTY_TYPE_LABELS, DEFAULT_PREFERENCES } from '@/lib/types';
import { getPreferences, savePreferences, clearAll } from '@/lib/storage';
import { SlidersHorizontal, Trash2, Check } from 'lucide-react';

const ALL_TYPES: PropertyType[] = ['villa', 'lejlighed', 'rækkehus', 'andelsbolig', 'landejendom', 'sommerhus'];

function formatKr(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace('.', ',')} mio.`;
  return `${(value / 1_000).toFixed(0)} t.`;
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrefs(getPreferences());
  }, []);

  function toggleType(type: PropertyType) {
    setPrefs((p) => ({
      ...p,
      types: p.types.includes(type) ? p.types.filter((t) => t !== type) : [...p.types, type],
    }));
  }

  function handleSave() {
    savePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    clearAll();
    setPrefs(DEFAULT_PREFERENCES);
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-4 space-y-6 pb-8">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-blue-700" />
          <h2 className="text-lg font-black text-gray-800">Indstillinger</h2>
        </div>

        {/* Price range */}
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Pris</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Minimum</span>
                <span className="font-semibold text-blue-700">{formatKr(prefs.minPrice)} kr.</span>
              </div>
              <input
                type="range"
                min={0}
                max={9_000_000}
                step={100_000}
                value={prefs.minPrice}
                onChange={(e) => setPrefs((p) => ({ ...p, minPrice: Number(e.target.value) }))}
                className="w-full accent-blue-700"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Maximum</span>
                <span className="font-semibold text-blue-700">{formatKr(prefs.maxPrice)} kr.</span>
              </div>
              <input
                type="range"
                min={100_000}
                max={10_000_000}
                step={100_000}
                value={prefs.maxPrice}
                onChange={(e) => setPrefs((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
                className="w-full accent-blue-700"
              />
            </div>
          </div>
        </section>

        {/* Rooms */}
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Antal værelser</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Minimum</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPrefs((p) => ({ ...p, minRooms: Math.max(1, p.minRooms - 1) }))}
                  className="w-9 h-9 bg-gray-100 rounded-full font-bold text-lg active:bg-gray-200"
                >−</button>
                <span className="text-xl font-black w-6 text-center">{prefs.minRooms}</span>
                <button
                  onClick={() => setPrefs((p) => ({ ...p, minRooms: Math.min(p.maxRooms, p.minRooms + 1) }))}
                  className="w-9 h-9 bg-gray-100 rounded-full font-bold text-lg active:bg-gray-200"
                >+</button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Maximum</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPrefs((p) => ({ ...p, maxRooms: Math.max(p.minRooms, p.maxRooms - 1) }))}
                  className="w-9 h-9 bg-gray-100 rounded-full font-bold text-lg active:bg-gray-200"
                >−</button>
                <span className="text-xl font-black w-6 text-center">{prefs.maxRooms}</span>
                <button
                  onClick={() => setPrefs((p) => ({ ...p, maxRooms: Math.min(10, p.maxRooms + 1) }))}
                  className="w-9 h-9 bg-gray-100 rounded-full font-bold text-lg active:bg-gray-200"
                >+</button>
              </div>
            </div>
          </div>
        </section>

        {/* Area */}
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Areal (m²)</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Minimum</span>
                <span className="font-semibold text-blue-700">{prefs.minArea} m²</span>
              </div>
              <input
                type="range"
                min={0}
                max={490}
                step={10}
                value={prefs.minArea}
                onChange={(e) => setPrefs((p) => ({ ...p, minArea: Number(e.target.value) }))}
                className="w-full accent-blue-700"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Maximum</span>
                <span className="font-semibold text-blue-700">{prefs.maxArea} m²</span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={prefs.maxArea}
                onChange={(e) => setPrefs((p) => ({ ...p, maxArea: Number(e.target.value) }))}
                className="w-full accent-blue-700"
              />
            </div>
          </div>
        </section>

        {/* Property types */}
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">Boligtype</h3>
          <div className="grid grid-cols-2 gap-2">
            {ALL_TYPES.map((type) => {
              const active = prefs.types.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors active:scale-95 ${
                    active
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500'
                  }`}
                >
                  {active && <Check size={14} />}
                  {PROPERTY_TYPE_LABELS[type]}
                </button>
              );
            })}
          </div>
        </section>

        {/* Algorithm info */}
        <section className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-1">Algoritme</h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            BoligSwipe lærer dine præferencer fra dine swipes. Jo mere du swiper, desto
            bedre bliver anbefalingerne. Vi analyserer pris, type, areal og beliggenhed
            fra de boliger du synes godt om.
          </p>
        </section>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSave}
            className={`w-full py-3.5 rounded-2xl font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 ${
              saved ? 'bg-green-500' : 'bg-blue-700'
            }`}
          >
            {saved ? <><Check size={18} /> Gemt!</> : 'Gem indstillinger'}
          </button>

          <button
            onClick={handleReset}
            className="w-full py-3.5 rounded-2xl font-bold text-red-500 border-2 border-red-200 active:scale-95 flex items-center justify-center gap-2 transition-transform"
          >
            <Trash2 size={18} />
            Nulstil alt
          </button>
        </div>
      </div>
    </div>
  );
}
