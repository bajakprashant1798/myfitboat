import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // variant id
  productSlug: string;
  name: string;
  variantName: string;
  priceInr: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + qty } : i,
              ),
              isOpen: true,
            };
          }
          return { items: [...s.items, { ...item, quantity: qty }], isOpen: true };
        }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    { name: "mfb-cart" },
  ),
);

export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0);
export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.priceInr * i.quantity, 0);
