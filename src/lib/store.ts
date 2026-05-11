'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  favourites: FavouriteItem[];
  toggleFavourite: (item: Omit<FavouriteItem, 'addedAt'>) => void;
  isFavourite: (kind: FavouriteKind, id: string) => boolean;
  clearFavourites: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
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
      version: 2,
      migrate: (persistedState: unknown) => {
        const p = persistedState as { favourites?: FavouriteItem[] } | null | undefined;
        const fav = p?.favourites;
        return {
          favourites: Array.isArray(fav) ? fav : [],
        };
      },
      /** Strip legacy `theme` (and any other unknown keys) from old persisted blobs without `version`. */
      merge: (persistedState: unknown, currentState: Store) => {
        const p = persistedState as { favourites?: FavouriteItem[] } | null | undefined;
        return {
          ...currentState,
          favourites: Array.isArray(p?.favourites) ? p.favourites : currentState.favourites,
        };
      },
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : dummyStorage)),
      partialize: (s) => ({ favourites: s.favourites }),
    }
  )
);

/** SSR-safe fallback storage so zustand's persist middleware doesn't crash during build. */
const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
