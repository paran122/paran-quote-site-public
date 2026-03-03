"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/stores/catalogStore";

export default function SiteDataLoader() {
  const fetchAll = useCatalogStore((s) => s.fetchAll);
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  return null;
}
