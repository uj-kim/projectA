import create from 'zustand';
import { calculateTotal, setCartToLocalStorage } from './cartUtils';

const useCartStore = create((set) => ({
  cart: [],
  totalCount: 0,
  totalPrice: 0,

  initCart: (userId, getCartFromLocalStorage) => {
    if (!userId) return;
    const prevCartItems = getCartFromLocalStorage(userId);
    const total = calculateTotal(prevCartItems);
    set({
      cart: prevCartItems,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
  },

  resetCart: (userId, resetCartAtLocalStorage) => {
    resetCartAtLocalStorage(userId);
    set({ cart: [], totalCount: 0, totalPrice: 0 });
  },

  addCartItem: (item, userId, count, setCartToLocalStorage) => {
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      let updatedCart;
      if (existingItemIndex !== -1) {
        updatedCart = [...state.cart];
        updatedCart[existingItemIndex].count += count;
      } else {
        updatedCart = [...state.cart, { ...item, count }];
      }

      const total = calculateTotal(updatedCart);
      setCartToLocalStorage(updatedCart, userId);

      return {
        cart: updatedCart,
        totalCount: total.totalCount,
        totalPrice: total.totalPrice,
      };
    });
  },
  //removeCartItem
  removeCartItem: (itemId, userId, setCartToLocalStorage) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== itemId);
      const total = calculateTotal(updatedCart);
      setCartToLocalStorage(updatedCart, userId);

      return {
        cart: updatedCart,
        totalCount: total.totalCount,
        totalPrice: total.totalPrice,
      };
    });
  },
  //chartgeCartItemCount
  changeCartItemCount: (itemId, count, userId, setCartToLocalStorage) => {
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === itemId ? { ...item, count } : item
      );
      const total = calculateTotal(updatedCart);
      setCartToLocalStorage(updatedCart, userId);

      return {
        cart: updatedCart,
        totalCount: total.totalCount,
        totalPrice: total.totalPrice,
      };
    });
  },
}));

export default useCartStore;
