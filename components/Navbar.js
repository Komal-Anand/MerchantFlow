'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart, selectCartCount } from '@/context/CartContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg className={styles.navLinkIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1.5 6.5 8 1.5l6.5 5V14a.5.5 0 0 1-.5.5H10v-4H6v4H2a.5.5 0 0 1-.5-.5V6.5Z" />
      </svg>
    ),
  },
  {
    label: 'Discover',
    href: '/discover',
    icon: (
      <svg className={styles.navLinkIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="7" cy="7" r="5" />
        <path d="m12.5 12.5 2 2" />
      </svg>
    ),
  },
  {
    label: 'AI Assistant',
    href: '/assistant',
    icon: (
      <svg className={styles.navLinkIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1.5" y="3" width="13" height="9" rx="1.5" />
        <path d="M5.5 14.5h5M8 12v2.5" />
        <path d="M5 7.5h.01M8 7.5h.01M11 7.5h.01" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    href: '/orders',
    icon: (
      <svg className={styles.navLinkIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="1.5" width="12" height="13" rx="1" />
        <path d="M5 5.5h6M5 8.5h6M5 11.5h3" />
      </svg>
    ),
  },
  {
    label: 'Growth',
    href: '/growth',
    icon: (
      <svg className={styles.navLinkIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 13h14M2 9l3-3 3 3 5-5" />
        <path d="M13 4h-3v3" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();
  const cartCount = selectCartCount(cart);

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.inner}>

        {/* Brand */}
        <Link href="/" className={styles.brand} aria-label="MerchantFlow home">
          <span className={styles.logoMark} aria-hidden="true">
            <svg className={styles.logoIcon} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7h10M7 2l5 5-5 5" />
            </svg>
          </span>
          <span className={styles.brandName}>MerchantFlow</span>
        </Link>

        {/* Nav Links */}
        <ul className={styles.navLinks} role="list">
          {NAV_LINKS.map(({ label, href, icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {icon}
                  {label}
                </Link>
              </li>
            );
          })}

          {/* Cart link — separate so we can add the badge */}
          <li>
            <Link
              href="/cart"
              className={`${styles.navLink} ${pathname === '/cart' ? styles.active : ''}`}
              aria-current={pathname === '/cart' ? 'page' : undefined}
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              id="nav-cart-link"
            >
              <span className={styles.cartIconWrapper}>
                <svg className={styles.navLinkIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 1h2.5l1.6 8h7.4l1.5-5.5H4" />
                  <circle cx="6.5" cy="13" r="1" />
                  <circle cx="11.5" cy="13" r="1" />
                </svg>
                {cartCount > 0 && (
                  <span className={styles.cartBadge} aria-hidden="true">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>
              Cart
            </Link>
          </li>
        </ul>

        {/* CTA */}
        <Link href="/assistant" className={styles.ctaBadge} id="nav-try-ai-cta">
          Try AI Assistant
        </Link>

        {/* Mobile toggle */}
        <button className={styles.menuToggle} aria-label="Open menu" aria-expanded="false">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>

      </div>
    </nav>
  );
}
