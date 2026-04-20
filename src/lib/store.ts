'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export type FavouriteKind = 'persona' | 'solution' | 'moment';

export interface FavouriteItem {
  kind: FavouriteKind;
  /**
   * Stable unique key within this app.
   * - persona:  `${area}/${personaId}`
   * - solution: `${solutionId}`
   * - moment:   `${area}/${personaId}/${momentId}`
   */
  id: string;
  label: string;
  href: string;
  meta?: string; // subtitle / context, e.g. area label
  addedAt: number;
}

interface Store {
  /* ── Theme ───────────────────────────────────────────── */
  theme: Theme;
  setTheme: (t: Theme) => void;

  /* ── Favourites ──────────────────────────────────────── */
  favourites: FavouriteItem[];
  toggleFavourite: (item: Omit<FavouriteItem, 'addedAt'>) => void;
  isFavourite: (kind: FavouriteKind, id: string) => boolean;
  clearFavourites: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (t) => set({ theme: t }),

      favourites: [],
      toggleFavourite: (item) => {
        const list = get().favourites;
        const exists = list.find((f) => f.kind === item.kind && f.id === item.id);
        if (exists) {
          set({ favourites: list.filter((f) => !(f.kind === item.kind && f.id === item.id)) });
        } else {
          set({ favourites: [...list, { ...item, addedAt: Date.now() }] });
        }
      },
      isFavourite: (kind, id) => get().favourites.some((f) => f.kind === kind && f.id === id),
      clearFavourites: () => set({ favourites: [] }),
    }),
    {
      name: 'sodexo-xp-catalogue',
      version: 1,
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : dummyStorage)),
      partialize: (s) => ({ theme: s.theme, favourites: s.favourites }),
    }
  )
);

/** SSR-safe fallback storage so zustand's persist middleware doesn't crash during build. */
const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
