'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedOrders = localStorage.getItem('merchantflow_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders).sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Orders</h1>
          <span className={styles.orderCount}>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
        </div>

        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h2 className={styles.emptyTitle}>No orders yet</h2>
            <p className={styles.emptySubtitle}>
              When you place an order, it will appear here.
            </p>
            <Link href="/discover" className={styles.continueShoppingBtn}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.orderList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderId}>Order #{order.id}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className={styles.orderStatusContainer}>
                    <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || ''}`}>
                      {order.status}
                    </span>
                    <span className={`${styles.statusBadge} ${order.paymentStatus === 'Paid' ? styles.paid : styles.failed}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.items.map((item, idx) => (
                    <div key={`${order.id}-${item.id}-${idx}`} className={styles.orderItem}>
                      <div className={styles.itemImagePlaceholder}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQty}>Qty: {item.quantity}</span>
                      </div>
                      <span className={styles.itemPrice}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.customerDetails}>
                    <p><strong>Deliver to:</strong> {order.customer.name}</p>
                    <p>{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pincode}</p>
                  </div>
                  <div className={styles.orderTotal}>
                    <span>Total:</span>
                    <span className={styles.totalAmount}>
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
