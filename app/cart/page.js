'use client';

import Link from 'next/link';
import { useCart, selectCartCount, selectCartSubtotal, selectCartOriginalTotal, selectCartSavings } from '@/context/CartContext';
import CartItem from '@/components/CartItem';
import styles from './page.module.css';

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartPage() {
  const { cart } = useCart();
  
  const count = selectCartCount(cart);
  const subtotal = selectCartSubtotal(cart);
  const originalTotal = selectCartOriginalTotal(cart);
  const savings = selectCartSavings(cart);

  if (cart.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={styles.title}>Your Cart</h1>
            <span className={styles.itemCount}>0 items</span>
          </div>

          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 8h5l4.5 22h19l5-16H11" />
              <circle cx="16" cy="38" r="3" />
              <circle cx="34" cy="38" r="3" />
            </svg>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptySubtitle}>
              Looks like you haven't added anything yet. Discover our collection of premium products.
            </p>
            <Link href="/discover" className={styles.continueShoppingBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Cart</h1>
          <span className={styles.itemCount}>
            {count} {count === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className={styles.layout}>
          
          {/* Items List */}
          <div className={styles.itemsList}>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <aside className={styles.summary} aria-label="Order Summary">
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({count} items)</span>
                <span>{formatPrice(originalTotal)}</span>
              </div>
              
              {savings > 0 && (
                <div className={`${styles.summaryRow} ${styles.summaryRowDiscount}`}>
                  <span>Discount</span>
                  <span>-{formatPrice(savings)}</span>
                </div>
              )}
              
              <div className={styles.summaryRow}>
                <span>Estimated Delivery</span>
                <span>Free</span>
              </div>
              
              <div className={styles.summaryDivider} />
              
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className={styles.checkoutBtn}
            >
              <svg 
                className={styles.secureIcon} 
                viewBox="0 0 16 16" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                aria-hidden="true"
              >
                <rect x="3" y="7" width="10" height="7" rx="1.5" />
                <path d="M5.5 7v-2a2.5 2.5 0 1 1 5 0v2" />
              </svg>
              Proceed to Checkout
            </Link>
            
            <p className={styles.checkoutNote}>
              Secure checkout using Razorpay Test Mode.
            </p>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
