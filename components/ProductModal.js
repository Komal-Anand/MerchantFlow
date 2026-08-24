'use client';

import { useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './ProductModal.module.css';

const CATEGORY_LABELS = {
  electronics: 'Electronics',
  fashion: 'Fashion',
  beauty: 'Beauty',
  'home-kitchen': 'Home & Kitchen',
  sports: 'Sports',
  travel: 'Travel',
};

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function StarRating({ rating }) {
  return (
    <div className={styles.stars} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={styles.starIcon}
          viewBox="0 0 12 12"
          style={{ opacity: star <= Math.round(rating) ? 1 : 0.25 }}
        >
          <path d="M6 1l1.4 2.8L11 4.3 8.5 6.8 9 10.5 6 9l-3 1.5.5-3.7L1 4.3l3.6-.5L6 1z" />
        </svg>
      ))}
    </div>
  );
}

function StockStatus({ product }) {
  if (!product.inStock) {
    return (
      <div className={styles.stockRow}>
        <span className={styles.stockDot} style={{ backgroundColor: 'var(--color-text-muted)' }} />
        <span className={styles.outOfStock}>Out of Stock</span>
      </div>
    );
  }
  if (product.stockCount <= 10) {
    return (
      <div className={styles.stockRow}>
        <span className={styles.stockDot} style={{ backgroundColor: '#f59e0b' }} />
        <span className={styles.lowStock}>Only {product.stockCount} left in stock</span>
      </div>
    );
  }
  return (
    <div className={styles.stockRow}>
      <span className={styles.stockDot} style={{ backgroundColor: '#10b981' }} />
      <span className={styles.inStock}>In Stock · {product.stockCount}+ available</span>
    </div>
  );
}

export default function ProductModal({ product, onClose }) {
  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const savings = product.originalPrice - product.price;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-name"
    >
      <div className={styles.dialog} id={`product-modal-${product.id}`}>

        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close product details"
          id="modal-close-btn"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 2l10 10M12 2L2 12" />
          </svg>
        </button>

        <div className={styles.layout}>

          {/* Image Panel */}
          <div className={styles.imagePanel}>
            {product.image ? (
              <img src={product.image} alt={product.name} className={styles.productImage} />
            ) : (
              <div className={styles.imagePlaceholder}>
                <svg
                  className={styles.placeholderIcon}
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="4" y="10" width="56" height="44" rx="4" />
                  <circle cx="20" cy="26" r="6" />
                  <path d="M4 46l16-12 12 9 8-7 24 17" />
                </svg>
              </div>
            )}
            {product.badge && (
              <span className={styles.imageBadge}>{product.badge}</span>
            )}
          </div>

          {/* Content Panel */}
          <div className={styles.content}>

            {/* Header */}
            <div className={styles.header}>
              <div className={styles.categoryRow}>
                <span className={styles.categoryTag}>
                  {CATEGORY_LABELS[product.category] ?? product.category}
                </span>
                {product.isNew && (
                  <span className={styles.categoryTag} style={{ backgroundColor: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)', color: '#10b981' }}>
                    New Arrival
                  </span>
                )}
              </div>
              <h2 id="modal-product-name" className={styles.productName}>
                {product.name}
              </h2>
            </div>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <StarRating rating={product.rating} />
              <span className={styles.ratingText}>{product.rating}</span>
              <span className={styles.reviewCount}>
                {product.reviews.toLocaleString('en-IN')} reviews
              </span>
            </div>

            <div className={styles.divider} />

            {/* Pricing */}
            <div className={styles.pricingBlock}>
              <div className={styles.priceRow}>
                <span className={styles.price}>{formatPrice(product.price)}</span>
                {product.discount > 0 && (
                  <span className={styles.originalPrice}>
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.discount > 0 && (
                <div className={styles.savingsRow}>
                  <span className={styles.discountTag}>{product.discount}% off</span>
                  <span className={styles.savingsText}>
                    You save {formatPrice(savings)}
                  </span>
                </div>
              )}
            </div>

            {/* Stock */}
            <StockStatus product={product} />

            <div className={styles.divider} />

            {/* Description */}
            <div className={styles.descriptionBlock}>
              <span className={styles.sectionLabel}>About this product</span>
              <p className={styles.descriptionText}>{product.description}</p>
            </div>

            {/* Features */}
            <div className={styles.featuresBlock}>
              <span className={styles.sectionLabel}>Key Features</span>
              <ul className={styles.featuresList}>
                {product.features.map((feature, i) => (
                  <li key={i} className={styles.featureItem}>
                    <svg
                      className={styles.featureCheck}
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 7l3.5 3.5L12 3" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                className={styles.addToCartBtn}
                disabled={!product.inStock || inCart}
                id={`add-to-cart-${product.id}`}
                aria-label={
                  !product.inStock
                    ? 'Out of stock'
                    : inCart
                    ? `${product.name} is in cart`
                    : `Add ${product.name} to cart`
                }
                onClick={() => {
                  if (product.inStock && !inCart) {
                    addItem(product);
                  }
                }}
              >
                {inCart ? (
                   <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 9l4 4 8-8" />
                   </svg>
                ) : (
                  <svg
                    className={styles.cartIcon}
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M1 1h2.5l1.6 8h7.4l1.5-5.5H4" />
                    <circle cx="6.5" cy="14.5" r="1.2" />
                    <circle cx="12.5" cy="14.5" r="1.2" />
                  </svg>
                )}
                
                {!product.inStock ? 'Out of Stock' : inCart ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button className={styles.wishlistBtn} id={`wishlist-${product.id}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 14s-6-3.5-6-8a4 4 0 0 1 6-3.44A4 4 0 0 1 14 6c0 4.5-6 8-6 8z" />
                </svg>
                Save to Wishlist
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
