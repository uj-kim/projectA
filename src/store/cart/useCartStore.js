import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getCartFromLocalStorage,
  resetCartAtLocalStorage,
  setCartToLocalStorage,
  calculateTotal,
} from './cartUtils';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      totalCount: 0,
      totalPrice: 0,

      initCart: (userId) => {
        if (!userId) return;
        const prevCartItems = getCartFromLocalStorage(userId);
        const total = calculateTotal(prevCartItems);
        set({
          cart: prevCartItems,
          totalCount: total.totalCount,
          totalPrice: total.totalPrice,
        });
      },

      resetCart: (userId) => {
        resetCartAtLocalStorage(userId);
        set({ cart: [], totalCount: 0, totalPrice: 0 });
      },

      addCartItem: ({ item, userId, count }) => {
        const currentCart = get().cart;
        const existingItemIndex = currentCart.findIndex(
          (cartItem) => cartItem.id === item.id
        );

        let updatedCart;
        if (existingItemIndex !== -1) {
          updatedCart = [...currentCart];
          updatedCart[existingItemIndex].count += count;
        } else {
          updatedCart = [...currentCart, { ...item, count }];
        }

        const total = calculateTotal(updatedCart);
        set({
          cart: updatedCart,
          totalCount: total.totalCount,
          totalPrice: total.totalPrice,
        });
        setCartToLocalStorage(updatedCart, userId);
      },

      removeCartItem: ({ itemId, userId }) => {
        const updatedCart = get().cart.filter((item) => item.id !== itemId);
        const total = calculateTotal(updatedCart);
        set({
          cart: updatedCart,
          totalCount: total.totalCount,
          totalPrice: total.totalPrice,
        });
        setCartToLocalStorage(updatedCart, userId);
      },

      changeCartItemCount: ({ itemId, count, userId }) => {
        const currentCart = get().cart;
        const itemIndex = currentCart.findIndex((item) => item.id === itemId);
        if (itemIndex !== -1) {
          const updatedCart = [...currentCart];
          updatedCart[itemIndex].count = count;
          const total = calculateTotal(updatedCart);
          set({
            cart: updatedCart,
            totalCount: total.totalCount,
            totalPrice: total.totalPrice,
          });
          setCartToLocalStorage(updatedCart, userId);
        }
      },
    }),
    {
      name: 'cart', // 로컬스토리지 키 이름
      getStorage: () => localStorage, // 기본 스토리지는 localStorage
    }
  )
);

export default useCartStore;
