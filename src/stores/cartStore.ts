"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  setItems: (items: CartItem[]) => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),

      setItems: (items) => set({ items }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        return get().items.reduce((sum, item) => {
          if (item.type === "package" && item.discountRate) {
            const original = item.price / (1 - item.discountRate / 100);
            return sum + (original - item.price) * item.quantity;
          }
          return sum;
        }, 0);
      },

      getTotal: () => {
        return get().getSubtotal();
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "paran-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
