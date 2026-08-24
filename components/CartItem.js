'use client';

import { useCart } from '@/context/CartContext';
import styles from './CartItem.module.css';

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <article className={styles.item}>
      <div className={styles.imageWrapper}>
        {item.image ? (
          <img src={item.image} alt={item.name} className={styles.productImage} />
        ) : (
          <svg
            className={styles.placeholderIcon}
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="8" width="40" height="32" rx="3" />
            <circle cx="16" cy="20" r="4" />
            <path d="M4 34l10-8 8 6 6-5 16 11" />
          </svg>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.name}>{item.name}</h3>
            <span className={styles.category}>{item.category}</span>
          </div>
          <span className={styles.price}>{formatPrice(item.price)}</span>
        </div>

        <div className={styles.actions}>
          <div className={styles.qtyControl}>
            <button
              className={styles.qtyBtn}
              onClick={() => updateQty(item.id, item.quantity - 1)}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 7h10" />
              </svg>
            </button>
            <span className={styles.qtyValue} aria-label={`Quantity: ${item.quantity}`}>
              {item.quantity}
            </span>
            <button
              className={styles.qtyBtn}
              onClick={() => updateQty(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${item.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 2v10M2 7h10" />
              </svg>
            </button>
          </div>

          <button
            className={styles.removeBtn}
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from cart`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 3.5h10M4.5 3.5v-2h5v2M5.5 6.5v5M8.5 6.5v5M3.5 3.5l1 9.5a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1l1-9.5" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
