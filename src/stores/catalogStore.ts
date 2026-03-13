"use client";

import { create } from "zustand";
import { Category, Service, Package as PkgType, Portfolio, EventType, PortfolioMedia } from "@/types";
import { CATEGORIES, SERVICES, PACKAGES, EVENT_TYPES } from "@/lib/constants";
import { PORTFOLIOS } from "@/lib/portfolioData";

interface CatalogStore {
  categories: Category[];
  services: Service[];
  packages: PkgType[];
  portfolios: Portfolio[];
  portfolioMedia: PortfolioMedia[];
  eventTypes: EventType[];
  loaded: boolean;
  fetchAll: () => Promise<void>;
  reload: () => Promise<void>;
}


async function fetchFromSupabase() {
  const queries = await import("@/lib/queries");
  const [pfs, media] = await Promise.all([
    queries.fetchPortfolios(),
    queries.fetchAllPortfolioMedia(),
  ]);
  return { pfs, media };
}

export const useCatalogStore = create<CatalogStore>((set, get) => ({
  categories: CATEGORIES,
  services: SERVICES,
  packages: PACKAGES,
  portfolios: PORTFOLIOS,
  portfolioMedia: [],
  eventTypes: EVENT_TYPES,
  loaded: false,

  fetchAll: async () => {
    if (get().loaded) return;
    try {
      const { pfs, media } = await fetchFromSupabase();
      set({
        portfolios: pfs.length > 0 ? pfs : PORTFOLIOS,
        portfolioMedia: media,
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  reload: async () => {
    try {
      const { pfs, media } = await fetchFromSupabase();
      set({
        portfolios: pfs.length > 0 ? pfs : get().portfolios,
        portfolioMedia: media.length > 0 ? media : get().portfolioMedia,
        loaded: true,
      });
    } catch {
      // 실패 시 기존 데이터 유지
    }
  },
}));
