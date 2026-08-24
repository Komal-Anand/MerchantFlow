'use client';

import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

const CATEGORY_LABELS = {
  electronics: 'Electronics',
  fashion: 'Fashion',
  beauty: 'Beauty',
  'home-kitchen': 'Home & Kitchen',
  sports: 'Sports',
  travel: 'Travel',
};

function getBadgeClass(badge) {
  if (!badge) return '';
  const lower = badge.toLowerCase();
  if (lower === 'new') return styles.badgeNew;
  if (lower === 'premium') return styles.badgePremium;
  if (lower === 'sale') return styles.badgeSale;
  return '';
}

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({ product, onClick }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  function handleQuickAdd(e) {
    e.stopPropagation(); // don't open modal
    if (product.inStock) addItem(product);
  }

  return (
    <article
      className={styles.card}
      onClick={() => onClick(product)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(product)}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className={styles.imageWrapper}>
        {product.image ? (
          <img src={product.image} alt={product.name} className={styles.productImage} />
        ) : (
          <div className={styles.imagePlaceholder}>
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
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span className={`${styles.badge} ${getBadgeClass(product.badge)}`}>
            {product.badge}
          </span>
        )}

        {/* Out of stock */}
        {!product.inStock && (
          <div className={styles.outOfStockOverlay}>
            <span className={styles.outOfStockLabel}>Out of Stock</span>
          </div>
        )}

        {/* Quick add button (visible on hover) */}
        {product.inStock && (
          <button
            className={`${styles.quickAddBtn} ${inCart ? styles.quickAddBtnInCart : ''}`}
            onClick={handleQuickAdd}
            aria-label={inCart ? `${product.name} is in cart` : `Quick add ${product.name} to cart`}
            id={`quick-add-${product.id}`}
          >
            {inCart ? (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 6.5l3 3 6-6" />
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6.5 2v9M2 6.5h9" />
                </svg>
                Add
              </>
            )}
          </button>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category}>
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>
          <div className={styles.rating} aria-label={`${product.rating} out of 5`}>
            <svg className={styles.ratingIcon} viewBox="0 0 12 12" aria-hidden="true">
              <path d="M6 1l1.4 2.8L11 4.3 8.5 6.8 9 10.5 6 9l-3 1.5.5-3.7L1 4.3l3.6-.5L6 1z" />
            </svg>
            <span className={styles.ratingValue}>{product.rating}</span>
            <span>({product.reviews.toLocaleString('en-IN')})</span>
          </div>
        </div>

        <h3 className={styles.name}>{product.name}</h3>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.pricing}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.discount > 0 && (
            <>
              <span className={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </span>
              <span className={styles.discountBadge}>{product.discount}% off</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
