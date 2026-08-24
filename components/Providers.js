'use client';

import { CartProvider } from '@/context/CartContext';

/**
 * Client-side providers wrapper.
 * The root layout is a Server Component, so we isolate
 * all client-side context providers here.
 */
export default function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
