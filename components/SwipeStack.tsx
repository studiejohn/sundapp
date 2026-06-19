'use client';

import { useState, useEffect, useCallback } from 'react';
import SwipeCard from './SwipeCard';
import PropertyModal from './PropertyModal';
import { Property } from '@/lib/types';
import { addSwipe, removeLastSwipe, getSwipeHistory, getPreferences } from '@/lib/storage';
import { getRecommendedStack } from '@/lib/algorithm';
import { PROPERTIES } from '@/lib/properties';
import { X, Heart, RotateCcw } from 'lucide-react';

const VISIBLE_CARDS = 3;

export default function SwipeStack() {
  const [stack, setStack] = useState<Property[]>([]);
  const [modalProperty, setModalProperty] = useState<Property | null>(null);
  const [lastSwiped, setLastSwiped] = useState<Property | null>(null);
  const [swipeCount, setSwipeCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [showMatch, setShowMatch] = useState(false);

  useEffect(() => {
    const history = getSwipeHistory();
    const prefs = getPreferences();
    const recommended = getRecommendedStack(PROPERTIES, history, prefs);
    setStack(recommended);
    setSwipeCount(history.length);
    setLikeCount(history.filter((r) => r.liked).length);
  }, []);

  const handleSwipe = useCallback(
    (property: Property, liked: boolean) => {
      addSwipe({ propertyId: property.id, liked, timestamp: Date.now() });
      setLastSwiped(property);
      setStack((prev) => prev.filter((p) => p.id !== property.id));
      setSwipeCount((c) => c + 1);
      if (liked) {
        setLikeCount((c) => c + 1);
        setShowMatch(true);
        setTimeout(() => setShowMatch(false), 1500);
      }
    },
    []
  );

  const handleUndo = useCallback(() => {
    if (!lastSwiped) return;
    const restored = removeLastSwipe();
    if (!restored) return;
    setStack((prev) => [lastSwiped, ...prev]);
    setLastSwiped(null);
    setSwipeCount((c) => Math.max(0, c - 1));
    if (restored.liked) setLikeCount((c) => Math.max(0, c - 1));
  }, [lastSwiped]);

  const visibleCards = stack.slice(0, VISIBLE_CARDS);
  const topCard = visibleCards[0];

  const triggerAction = (liked: boolean) => {
    if (!topCard) return;
    handleSwipe(topCard, liked);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stats bar */}
      <div className="flex items-center justify-between px-5 py-2">
        <div className="text-center">
          <div className="text-xl font-black text-gray-900">{likeCount}</div>
          <div className="text-xs text-gray-500">Likes</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-black text-gray-900">{stack.length}</div>
          <div className="text-xs text-gray-500">Tilbage</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-black text-gray-900">{swipeCount}</div>
          <div className="text-xs text-gray-500">Set</div>
        </div>
      </div>

      {/* Match animation */}
      {showMatch && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center animate-bounce">
            <div className="text-5xl mb-2">🏠</div>
            <div className="text-2xl font-black text-blue-700">Match!</div>
            <div className="text-gray-500 text-sm">Tilføjet til dine favoritter</div>
          </div>
        </div>
      )}

      {/* Card stack */}
      <div className="relative flex-1 mx-4">
        {stack.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Du har set det hele!</h2>
            <p className="text-gray-500 mb-6">
              Du har swipet igennem {swipeCount} boliger i Nordjylland.
              <br />
              {likeCount} boliger er gemt som favoritter.
            </p>
            <button
              onClick={() => {
                const prefs = getPreferences();
                setStack(getRecommendedStack(PROPERTIES, getSwipeHistory(), prefs));
              }}
              className="px-6 py-3 bg-blue-700 text-white font-bold rounded-full shadow-lg active:scale-95 transition-transform"
            >
              Se igen
            </button>
          </div>
        ) : (
          [...visibleCards].reverse().map((property, reversedIndex) => {
            const stackIndex = visibleCards.length - 1 - reversedIndex;
            return (
              <SwipeCard
                key={property.id}
                property={property}
                stackIndex={stackIndex}
                onSwipeLeft={() => handleSwipe(property, false)}
                onSwipeRight={() => handleSwipe(property, true)}
                onInfo={() => setModalProperty(property)}
              />
            );
          })
        )}
      </div>

      {/* Action buttons */}
      {stack.length > 0 && (
        <div className="flex items-center justify-center gap-5 py-4 px-6">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={!lastSwiped}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform border border-gray-100"
          >
            <RotateCcw size={20} className="text-yellow-500" />
          </button>

          {/* Nope */}
          <button
            onClick={() => triggerAction(false)}
            className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-transform border-2 border-red-200 hover:border-red-400"
          >
            <X size={28} className="text-red-500" />
          </button>

          {/* Like */}
          <button
            onClick={() => triggerAction(true)}
            className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-transform border-2 border-green-200 hover:border-green-400"
          >
            <Heart size={28} className="text-green-500" />
          </button>

          {/* Spacer for symmetry */}
          <div className="w-12 h-12" />
        </div>
      )}

      {/* Property detail modal */}
      {modalProperty && (
        <PropertyModal
          property={modalProperty}
          onClose={() => setModalProperty(null)}
          onLike={() => {
            handleSwipe(modalProperty, true);
            setModalProperty(null);
          }}
          onDislike={() => {
            handleSwipe(modalProperty, false);
            setModalProperty(null);
          }}
        />
      )}
    </div>
  );
}
