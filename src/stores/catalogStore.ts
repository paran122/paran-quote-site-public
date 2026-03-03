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

/** Supabase에서 가져온 데이터에 imageUrl이 없으면 constants 폴백 이미지를 채워넣는다 */
function mergeImageUrls<T extends { id: string; name: string; imageUrl?: string }>(
  fetched: T[],
  defaults: T[],
): T[] {
  const byId = new Map(defaults.map((d) => [d.id, d.imageUrl]));
  const byName = new Map(defaults.map((d) => [d.name, d.imageUrl]));
  return fetched.map((item) => ({
    ...item,
    imageUrl: item.imageUrl || byId.get(item.id) || byName.get(item.name) || undefined,
  }));
}

async function fetchFromSupabase() {
  const queries = await import("@/lib/queries");
  const [cats, svcs, pkgs, pfs, media, ets] = await Promise.all([
    queries.fetchCategories(),
    queries.fetchServices(),
    queries.fetchPackages(),
    queries.fetchPortfolios(),
    queries.fetchAllPortfolioMedia(),
    queries.fetchEventTypes(),
  ]);
  return {
    cats,
    svcs: mergeImageUrls(svcs, SERVICES),
    pkgs: mergeImageUrls(pkgs, PACKAGES),
    pfs,
    media,
    ets,
  };
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
      const { cats, svcs, pkgs, pfs, media, ets } = await fetchFromSupabase();
      set({
        categories: cats.length > 0 ? cats : CATEGORIES,
        services: svcs.length > 0 ? svcs : SERVICES,
        packages: pkgs.length > 0 ? pkgs : PACKAGES,
        portfolios: pfs.length > 0 ? pfs : PORTFOLIOS,
        portfolioMedia: media,
        eventTypes: ets.length > 0 ? ets : EVENT_TYPES,
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  reload: async () => {
    try {
      const { cats, svcs, pkgs, pfs, media, ets } = await fetchFromSupabase();
      set({
        categories: cats.length > 0 ? cats : get().categories,
        services: svcs.length > 0 ? svcs : get().services,
        packages: pkgs.length > 0 ? pkgs : get().packages,
        portfolios: pfs.length > 0 ? pfs : get().portfolios,
        portfolioMedia: media.length > 0 ? media : get().portfolioMedia,
        eventTypes: ets.length > 0 ? ets : get().eventTypes,
        loaded: true,
      });
    } catch {
      // 실패 시 기존 데이터 유지
    }
  },
}));
