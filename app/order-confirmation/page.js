'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      try {
        const stored = localStorage.getItem('merchantflow_orders');
        if (stored) {
          const orders = JSON.parse(stored);
          const found = orders.find(o => o.id === orderId);
          if (found) setOrder(found);
        }
      } catch (err) {
        console.error('Failed to load order', err);
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.successIcon}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      
      <h1 className={styles.title}>Order Confirmed!</h1>
      <p className={styles.subtitle}>
        Thank you for your purchase, {order.customer.name.split(' ')[0]}. We've received your order.
      </p>

      <div className={styles.orderCard}>
        <div className={styles.orderHeader}>
          <div className={styles.orderHeaderItem}>
            <span className={styles.label}>Order Number</span>
            <span className={styles.value}>{order.id}</span>
          </div>
          <div className={styles.orderHeaderItem}>
            <span className={styles.label}>Date</span>
            <span className={styles.value}>
              {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className={styles.orderHeaderItem}>
            <span className={styles.label}>Total</span>
            <span className={styles.value}>
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(order.total)}
            </span>
          </div>
          <div className={styles.orderHeaderItem}>
            <span className={styles.label}>Payment Method</span>
            <span className={styles.value}>{order.paymentMethod}</span>
          </div>
        </div>

        <div className={styles.orderItems}>
          {order.items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className={styles.orderItem}>
              <span className={styles.itemName}>{item.quantity}x {item.name}</span>
              <span className={styles.itemPrice}>
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        
        <div className={styles.shippingDetails}>
          <span className={styles.label}>Shipping to:</span>
          <p>{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pincode}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/orders" className={styles.primaryBtn}>
          View Orders
        </Link>
        <Link href="/discover" className={styles.secondaryBtn}>
          Continue Shopping
        </Link>
      </div>
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Suspense fallback={<div className={styles.spinner}></div>}>
          <ConfirmationContent />
        </Suspense>
      </div>
    </div>
  );
}
