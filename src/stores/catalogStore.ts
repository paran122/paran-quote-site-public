"use client";

import { create } from "zustand";
import { Portfolio, PortfolioMedia } from "@/types";
import { PORTFOLIOS } from "@/lib/portfolioData";

interface CatalogStore {
  portfolios: Portfolio[];
  portfolioMedia: PortfolioMedia[];
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
  portfolios: PORTFOLIOS,
  portfolioMedia: [],
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
