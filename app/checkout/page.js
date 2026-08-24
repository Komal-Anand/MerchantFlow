'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, selectCartCount, selectCartSubtotal, selectCartOriginalTotal, selectCartSavings } from '@/context/CartContext';
import styles from './page.module.css';
import Script from 'next/script';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  
  const [mounted, setMounted] = useState(false);
  const [razorpayConfig, setRazorpayConfig] = useState({ available: false, keyId: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [activePaymentTab, setActivePaymentTab] = useState('UPI');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const count = selectCartCount(cart);
  const subtotal = selectCartSubtotal(cart);
  const originalTotal = selectCartOriginalTotal(cart);
  const savings = selectCartSavings(cart);

  useEffect(() => {
    setMounted(true);
    // Check Razorpay config on mount
    fetch('/api/razorpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'checkConfig' })
    })
      .then(res => res.json())
      .then(data => {
        setRazorpayConfig({
          available: data.razorpayAvailable,
          keyId: data.keyId
        });
      })
      .catch(err => console.error('Failed to check Razorpay config', err));
  }, []);

  // Prevent accessing checkout with empty cart
  useEffect(() => {
    if (mounted && cart.length === 0 && !isProcessing) {
      router.push('/cart');
    }
  }, [mounted, cart.length, router, isProcessing]);

  if (!mounted) return null;
  if (cart.length === 0) return null; // Wait for redirect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(formData).every(val => val.trim() !== '');

  const saveOrder = (paymentMethod, paymentStatus) => {
    const orderId = `MF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: formData,
      items: [...cart],
      subtotal: originalTotal,
      discount: savings,
      total: subtotal,
      paymentMethod,
      paymentStatus,
      status: 'Processing'
    };

    try {
      const existing = localStorage.getItem('merchantflow_orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.push(newOrder);
      localStorage.setItem('merchantflow_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save order to localStorage');
    }

    return orderId;
  };

  const handleDemoPayment = () => {
    setIsProcessing(true);
    setError(null);
    
    // Simulate processing delay
    setTimeout(() => {
      const orderId = saveOrder('Demo Payment', 'Paid');
      clearCart();
      router.push(`/order-confirmation?orderId=${orderId}`);
    }, 1500);
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create order on server
      const createRes = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createOrder',
          payload: { amount: subtotal * 100 } // Amount in paise
        })
      });

      const orderData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: razorpayConfig.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MerchantFlow',
        description: 'Secure Checkout',
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify Payment on Server
          try {
            const verifyRes = await fetch('/api/razorpay', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verifyPayment',
                payload: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              const orderId = saveOrder('Razorpay', 'Paid');
              clearCart();
              router.push(`/order-confirmation?orderId=${orderId}`);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (verifyError) {
            setError(verifyError.message);
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      rzp.open();
      
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    
    // HTML5 validation already passed if we reach here, but double check
    if (!isFormValid) {
      setError("Please fill out all required fields.");
      return;
    }
    
    if (razorpayConfig.available) {
      handleRazorpayPayment();
    } else {
      handleDemoPayment();
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className={styles.page}>
        <div className={styles.inner}>
          
          <div className={styles.header}>
            <h1 className={styles.title}>Checkout</h1>
            <Link href="/cart" className={styles.backBtn}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Return to Cart
            </Link>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.layout}>
            
            {/* LEFT COLUMN: Form Section */}
            <div className={styles.formSection}>
              <form id="checkout-form" onSubmit={handleCheckout} className={styles.form}>
                
                {/* 1. Customer Details Card */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.stepIndicator}>1</div>
                    <div>
                      <h2 className={styles.cardTitle}>Customer Details</h2>
                      <p className={styles.cardSubtitle}>Enter your details to complete your purchase</p>
                    </div>
                  </div>
                  
                  <div className={styles.formGroupRow}>
                    <div className={styles.formGroupFull}>
                      <label htmlFor="name">Full Name <span>*</span></label>
                      <div className={styles.inputWrapper}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email <span>*</span></label>
                      <div className={styles.inputWrapper}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone <span>*</span></label>
                      <div className={styles.inputWrapper}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Address Card */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.stepIndicator}>2</div>
                    <div>
                      <h2 className={styles.cardTitle}>Shipping Address</h2>
                      <p className={styles.cardSubtitle}>Where should we deliver your order?</p>
                    </div>
                  </div>
                  
                  <div className={styles.formGroupRow}>
                    <div className={styles.formGroupFull}>
                      <label htmlFor="address">Address <span>*</span></label>
                      <div className={styles.inputWrapper}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="House no., Street name, Area, Landmark" required />
                      </div>
                    </div>
                  </div>

                  <div className={styles.addressGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="city">City <span>*</span></label>
                      <div className={styles.inputWrapper}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                          <path d="M9 22v-4h6v4"></path>
                          <path d="M8 6h.01"></path>
                          <path d="M16 6h.01"></path>
                          <path d="M12 6h.01"></path>
                          <path d="M12 10h.01"></path>
                          <path d="M12 14h.01"></path>
                          <path d="M16 10h.01"></path>
                          <path d="M16 14h.01"></path>
                          <path d="M8 10h.01"></path>
                          <path d="M8 14h.01"></path>
                        </svg>
                        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" required />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="state">State <span>*</span></label>
                      <div className={styles.inputWrapper}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" required />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="pincode">Pincode <span>*</span></label>
                      <div className={styles.inputWrapper}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Enter pincode" required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method Card */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.stepIndicator}>3</div>
                    <div>
                      <h2 className={styles.cardTitle}>Payment Method</h2>
                      <p className={styles.cardSubtitle}>Choose your preferred payment option</p>
                    </div>
                  </div>
                  
                  {!razorpayConfig.available && (
                    <div className={styles.demoModeBadge}>
                      <div className={styles.demoIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <strong>Demo Payment Mode</strong>
                        <p>Razorpay test keys are not configured. Checkout is running in demonstration mode.</p>
                      </div>
                    </div>
                  )}

                  <div className={styles.paymentSelector}>
                    {/* Left Pane - Options */}
                    <div className={styles.paymentTabs}>
                      <button 
                        type="button" 
                        className={`${styles.paymentTab} ${activePaymentTab === 'UPI' ? styles.activeTab : ''}`}
                        onClick={() => setActivePaymentTab('UPI')}
                      >
                        <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        <div className={styles.tabContent}>
                          <span className={styles.tabTitle}>UPI</span>
                          <span className={styles.tabDesc}>Pay using any UPI app</span>
                        </div>
                      </button>

                      <button 
                        type="button" 
                        className={`${styles.paymentTab} ${activePaymentTab === 'Cards' ? styles.activeTab : ''}`}
                        onClick={() => setActivePaymentTab('Cards')}
                      >
                        <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                        <div className={styles.tabContent}>
                          <span className={styles.tabTitle}>Cards</span>
                          <span className={styles.tabDesc}>Credit / Debit / ATM Cards</span>
                        </div>
                      </button>

                      <button 
                        type="button" 
                        className={`${styles.paymentTab} ${activePaymentTab === 'NetBanking' ? styles.activeTab : ''}`}
                        onClick={() => setActivePaymentTab('NetBanking')}
                      >
                        <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                        <div className={styles.tabContent}>
                          <span className={styles.tabTitle}>Net Banking</span>
                          <span className={styles.tabDesc}>All major banks supported</span>
                        </div>
                      </button>

                      <button 
                        type="button" 
                        className={`${styles.paymentTab} ${activePaymentTab === 'Wallets' ? styles.activeTab : ''}`}
                        onClick={() => setActivePaymentTab('Wallets')}
                      >
                        <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-8H6a2 2 0 0 1-2-2z"></path></svg>
                        <div className={styles.tabContent}>
                          <span className={styles.tabTitle}>Wallets</span>
                          <span className={styles.tabDesc}>Pay using popular wallets</span>
                        </div>
                      </button>

                      <button 
                        type="button" 
                        className={`${styles.paymentTab} ${activePaymentTab === 'QR' ? styles.activeTab : ''}`}
                        onClick={() => setActivePaymentTab('QR')}
                      >
                        <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        <div className={styles.tabContent}>
                          <span className={styles.tabTitle}>QR Code</span>
                          <span className={styles.tabDesc}>Scan & pay securely</span>
                        </div>
                      </button>
                    </div>

                    {/* Right Pane - Content */}
                    <div className={styles.paymentContent}>
                      {activePaymentTab === 'UPI' && (
                        <div className={styles.upiView}>
                          <h3 className={styles.viewTitle}>Pay using UPI</h3>
                          <p className={styles.viewSubtitle}>Pay instantly using any UPI app</p>
                          
                          <div className={styles.upiApps}>
                            <div className={styles.upiApp}><div className={styles.upiAppCircle}>G</div><span>Google Pay</span></div>
                            <div className={styles.upiApp}><div className={styles.upiAppCircle}>P</div><span>PhonePe</span></div>
                            <div className={styles.upiApp}><div className={styles.upiAppCircle}>P</div><span>Paytm</span></div>
                            <div className={styles.upiApp}><div className={styles.upiAppCircle}>B</div><span>BHIM</span></div>
                            <div className={styles.upiApp}><div className={styles.upiAppCircle}>A</div><span>Amazon Pay</span></div>
                          </div>

                          <div className={styles.upiDivider}>
                            <span>Or scan any UPI QR</span>
                          </div>

                          <div className={styles.qrSection}>
                            <div className={styles.qrBox}>
                              <img src="/images/merchantflow-payment-qr.png" alt="Scan to Pay" className={styles.qrImage} />
                            </div>
                            <div className={styles.upiIdDisplay}>
                              UPI ID: merchantflow@razorpay
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </div>
                          </div>
                        </div>
                      )}

                      {activePaymentTab === 'Cards' && (
                        <div className={styles.placeholderView}>
                          <div className={styles.placeholderBox}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                            <p>Enter your credit or debit card details in the next step.</p>
                          </div>
                        </div>
                      )}

                      {activePaymentTab === 'NetBanking' && (
                        <div className={styles.placeholderView}>
                          <div className={styles.placeholderBox}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                            <p>Select your bank in the secure Razorpay window.</p>
                          </div>
                        </div>
                      )}

                      {activePaymentTab === 'Wallets' && (
                        <div className={styles.placeholderView}>
                          <div className={styles.placeholderBox}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-8H6a2 2 0 0 1-2-2z"></path></svg>
                            <p>Pay using Paytm, Amazon Pay, PhonePe and other wallets.</p>
                          </div>
                        </div>
                      )}

                      {activePaymentTab === 'QR' && (
                        <div className={styles.placeholderView}>
                          <div className={styles.qrSection}>
                            <p style={{marginBottom: '16px', color: 'var(--text-secondary)'}}>Scan to Pay securely</p>
                            <div className={styles.qrBox}>
                              <img src="/images/merchantflow-payment-qr.png" alt="Scan to Pay" className={styles.qrImage} />
                            </div>
                            <div className={styles.upiIdDisplay} style={{marginTop: '12px'}}>
                              UPI ID: merchantflow@razorpay
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* RIGHT COLUMN: Order Summary Section */}
            <aside className={styles.summarySidebar}>
              
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardHeader}>
                  <svg className={styles.summaryIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <h2 className={styles.cardTitle}>Order Summary</h2>
                </div>
                
                <div className={styles.summaryItems}>
                  {cart.map(item => (
                    <div key={item.id} className={styles.summaryItem}>
                      <div className={styles.summaryItemImageWrapper}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className={styles.summaryItemImage} />
                        ) : (
                          <div className={styles.summaryItemImagePlaceholder}></div>
                        )}
                      </div>
                      <div className={styles.summaryItemDetails}>
                        <span className={styles.summaryItemName}>{item.name}</span>
                        <span className={styles.summaryItemQty}>Qty: {item.quantity}</span>
                      </div>
                      <span className={styles.summaryItemPrice}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.summaryDivider} />

                <div className={styles.summaryList}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(originalTotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className={`${styles.summaryRow} ${styles.summaryRowDiscount}`}>
                      <span>Discount</span>
                      <span>-{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(savings)}</span>
                    </div>
                  )}
                  <div className={styles.summaryRow}>
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  
                  <div className={styles.summaryTotalBlock}>
                    <div className={styles.summaryTotal}>
                      <div className={styles.summaryTotalLabels}>
                        <span>Total Payable</span>
                        <span className={styles.taxInfo}>(Inclusive of all taxes)</span>
                      </div>
                      <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(subtotal)}</span>
                    </div>
                  </div>

                  {savings > 0 && (
                    <div className={styles.savingsBox}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      You saved {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(savings)} on this order
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className={styles.errorAlert} style={{ marginBottom: '16px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Pay Button */}
              <div className={styles.payActionCard}>
                <button 
                  type="submit"
                  form="checkout-form"
                  className={styles.checkoutBtn}
                  disabled={isProcessing}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  {isProcessing ? 'Processing...' : 
                    `Pay ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(subtotal)} Securely` 
                  }
                </button>
                
                <div className={styles.secureIndicator}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <div className={styles.secureText}>
                    <strong>Secure Checkout</strong>
                    <span>Your payment information is encrypted and protected by Razorpay.</span>
                  </div>
                </div>
              </div>

              {/* Trust Section */}
              <div className={styles.trustCard}>
                <div className={styles.trustItem}>
                  <div className={styles.trustIcon} style={{color: '#3b82f6'}}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  </div>
                  <div className={styles.trustText}>
                    <strong>Razorpay</strong>
                    <span>Secured Payments</span>
                  </div>
                </div>
                <div className={styles.trustItem}>
                  <div className={styles.trustIcon} style={{color: '#10b981'}}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div className={styles.trustText}>
                    <strong>100% Safe</strong>
                    <span>Secure & Encrypted</span>
                  </div>
                </div>
                <div className={styles.trustItem}>
                  <div className={styles.trustIcon} style={{color: '#3b82f6'}}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  </div>
                  <div className={styles.trustText}>
                    <strong>7 Days</strong>
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>

            </aside>

          </div>
        </div>
      </div>
    </>
  );
}
