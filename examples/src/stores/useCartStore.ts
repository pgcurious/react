import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

/**
 * Shopping Cart Store with Zustand
 *
 * Modern patterns demonstrated:
 * 1. Devtools middleware for debugging
 * 2. Complex state with computed values
 * 3. Immer-like immutable updates
 */

interface CartState {
  // State
  items: CartItem[];
  isOpen: boolean;

  // Computed (using getters pattern)
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      // State
      items: [],
      isOpen: false,

      // Computed values (called as functions)
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getItemQuantity: (productId: string) => {
        const item = get().items.find((i) => i.product.id === productId);
        return item?.quantity ?? 0;
      },

      // Actions
      addItem: (product: Product) =>
        set(
          (state) => {
            const existingItem = state.items.find(
              (i) => i.product.id === product.id
            );

            if (existingItem) {
              // Update quantity if item exists
              return {
                items: state.items.map((item) =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              };
            }

            // Add new item
            return {
              items: [
                ...state.items,
                {
                  id: crypto.randomUUID(),
                  product,
                  quantity: 1,
                },
              ],
            };
          },
          false,
          'cart/addItem' // Action name for devtools
        ),

      removeItem: (productId: string) =>
        set(
          (state) => ({
            items: state.items.filter((i) => i.product.id !== productId),
          }),
          false,
          'cart/removeItem'
        ),

      updateQuantity: (productId: string, quantity: number) =>
        set(
          (state) => {
            if (quantity <= 0) {
              return {
                items: state.items.filter((i) => i.product.id !== productId),
              };
            }

            return {
              items: state.items.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              ),
            };
          },
          false,
          'cart/updateQuantity'
        ),

      clearCart: () =>
        set({ items: [] }, false, 'cart/clearCart'),

      toggleCart: () =>
        set(
          (state) => ({ isOpen: !state.isOpen }),
          false,
          'cart/toggleCart'
        ),
    }),
    { name: 'CartStore' } // Devtools name
  )
);

export { useCartStore };
