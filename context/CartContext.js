'use client';

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// ── Cart Actions ─────────────────────────────────────────────────────────────

const ADD_ITEM     = 'ADD_ITEM';
const REMOVE_ITEM  = 'REMOVE_ITEM';
const UPDATE_QTY   = 'UPDATE_QTY';
const CLEAR_CART   = 'CLEAR_CART';
const LOAD_CART    = 'LOAD_CART';

// ── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {

    case LOAD_CART:
      return action.payload;

    case ADD_ITEM: {
      const existing = state.find((item) => item.id === action.product.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...state,
        {
          id: action.product.id,
          name: action.product.name,
          category: action.product.category,
          price: action.product.price,
          originalPrice: action.product.originalPrice,
          discount: action.product.discount,
          image: action.product.image,
          quantity: 1,
        },
      ];
    }

    case REMOVE_ITEM:
      return state.filter((item) => item.id !== action.id);

    case UPDATE_QTY: {
      if (action.quantity <= 0) {
        return state.filter((item) => item.id !== action.id);
      }
      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      );
    }

    case CLEAR_CART:
      return [];

    default:
      return state;
  }
}

// ── Selectors ────────────────────────────────────────────────────────────────

export function selectCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function selectCartOriginalTotal(cart) {
  return cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
}

export function selectCartSavings(cart) {
  return selectCartOriginalTotal(cart) - selectCartSubtotal(cart);
}

// ── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext(null);

const STORAGE_KEY = 'merchantflow_cart';

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: LOAD_CART, payload: parsed });
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist to localStorage on every cart change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage errors (private browsing etc.)
    }
  }, [cart]);

  // ── Actions ──

  const addItem = useCallback((product) => {
    dispatch({ type: ADD_ITEM, product });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: REMOVE_ITEM, id });
  }, []);

  const updateQty = useCallback((id, quantity) => {
    dispatch({ type: UPDATE_QTY, id, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CLEAR_CART });
  }, []);

  const isInCart = useCallback(
    (id) => cart.some((item) => item.id === id),
    [cart]
  );

  const getItemQty = useCallback(
    (id) => cart.find((item) => item.id === id)?.quantity ?? 0,
    [cart]
  );

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQty, clearCart, isInCart, getItemQty }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
