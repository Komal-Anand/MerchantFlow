'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  PRODUCTS,
  CATEGORIES,
  PRICE_RANGES,
  SORT_OPTIONS,
  filterProducts,
  sortProducts,
} from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import styles from './page.module.css';

export default function DiscoverPage() {
  // ── State ──
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ── Derived: filtered + sorted products ──
  const displayedProducts = useMemo(() => {
    const filtered = filterProducts(PRODUCTS, { query, category, priceRange });
    return sortProducts(filtered, sortBy);
  }, [query, category, priceRange, sortBy]);

  // ── Count per category (for sidebar) ──
  const categoryCounts = useMemo(() => {
    const counts = { all: PRODUCTS.length };
    PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return counts;
  }, []);

  // ── Handlers ──
  const handleReset = useCallback(() => {
    setQuery('');
    setCategory('all');
    setPriceRange('all');
    setSortBy('featured');
  }, []);

  const hasActiveFilters =
    query || category !== 'all' || priceRange !== 'all' || sortBy !== 'featured';

  return (
    <div className={styles.page}>

      {/* ── Page Header ── */}
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>

          {/* Title row */}
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Discover</h1>
            <span className={styles.resultCount}>
              {displayedProducts.length} of {PRODUCTS.length} products
            </span>
          </div>

          {/* Search + Sort */}
          <div className={styles.searchRow}>
            <div className={styles.searchWrapper}>
              <svg
                className={styles.searchIcon}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="5" />
                <path d="m12.5 12.5 2 2" />
              </svg>
              <input
                id="discover-search"
                className={styles.searchInput}
                type="search"
                placeholder="Search products, brands, categories…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
                autoComplete="off"
              />
              {query && (
                <button
                  className={styles.clearBtn}
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 2l10 10M12 2L2 12" />
                  </svg>
                </button>
              )}
            </div>

            <select
              id="discover-sort"
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Category Filter Chips */}
          <div className={styles.filterBar} role="group" aria-label="Filter by category">
            <span className={styles.filterLabel}>Category</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id}`}
                className={`${styles.filterChip} ${category === cat.id ? styles.filterChipActive : ''}`}
                onClick={() => setCategory(cat.id)}
                aria-pressed={category === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* ── Main Content ── */}
      <div className={styles.main}>

        {/* Sidebar — Price Filter */}
        <aside className={styles.sidebar} aria-label="Filter sidebar">

          <div className={styles.sidebarSection}>
            <span className={styles.sidebarTitle}>Price Range</span>
            {PRICE_RANGES.map((range) => (
              <button
                key={range.id}
                id={`filter-price-${range.id}`}
                className={`${styles.sidebarOption} ${priceRange === range.id ? styles.sidebarOptionActive : ''}`}
                onClick={() => setPriceRange(range.id)}
                aria-pressed={priceRange === range.id}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className={styles.sidebarSection}>
            <span className={styles.sidebarTitle}>By Category</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.sidebarOption} ${category === cat.id ? styles.sidebarOptionActive : ''}`}
                onClick={() => setCategory(cat.id)}
                aria-pressed={category === cat.id}
              >
                {cat.label}
                <span className={`${styles.sidebarOptionCount} ${category === cat.id ? styles.sidebarOptionActiveCount : ''}`}>
                  {categoryCounts[cat.id] ?? 0}
                </span>
              </button>
            ))}
          </div>

        </aside>

        {/* Product Grid */}
        <div className={styles.gridArea}>

          {displayedProducts.length > 0 ? (
            <div className={styles.productGrid} id="product-grid">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState} id="discover-empty-state">
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
                <circle cx="22" cy="22" r="16" />
                <path d="M34 34l8 8" />
                <path d="M16 22h12M22 16v12" strokeWidth="1.5" />
              </svg>
              <h3 className={styles.emptyTitle}>No products found</h3>
              <p className={styles.emptySubtitle}>
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              {hasActiveFilters && (
                <button className={styles.resetBtn} onClick={handleReset} id="reset-filters-btn">
                  Reset all filters
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Product Modal ── */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
}
