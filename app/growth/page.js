'use client';

import React from 'react';
import { PRODUCTS } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

// Demo Data
const DEMO_KPIS = [
  { label: 'Total Revenue', value: '₹12,45,000', change: '+14%', trend: 'up' },
  { label: 'Total Orders', value: '842', change: '+8%', trend: 'up' },
  { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', trend: 'up' },
  { label: 'Avg Order Value', value: '₹1,478', change: '+2%', trend: 'up' },
  { label: 'AI-Assisted Purchases', value: '412', change: '+42%', trend: 'up', highlight: true },
  { label: 'AI-Influenced Revenue', value: '₹5,80,000', change: '+56%', trend: 'up', highlight: true },
];

const INTENTS = [
  { intent: "Wireless earbuds under ₹3,000", category: "Electronics", demand: "High", opportunity: "Cross-sell travel cases", action: "Enable AI Recommendations" },
  { intent: "Laptop for college", category: "Electronics", demand: "Very High", opportunity: "Bundle with backpacks", action: "Create College Bundle" },
  { intent: "Running shoes under ₹5,000", category: "Sports", demand: "High", opportunity: "Upsell premium socks", action: "Enable AI Cross-sell" },
  { intent: "Beauty products for daily use", category: "Beauty", demand: "Medium", opportunity: "Promote skincare kits", action: "Highlight Kits" },
];

const INSIGHTS = [
  {
    title: "Cross-Category Correlation",
    insight: "Customers interested in wireless earbuds frequently explore travel accessories.",
    opportunity: "Recommend complementary travel products during checkout.",
    action: "Enable AI cross-sell recommendations."
  },
  {
    title: "High-Intent Browsing",
    insight: "Customers comparing laptops frequently explore laptop bags and mice.",
    opportunity: "Increase average order value through complementary tech recommendations.",
    action: "Recommend laptop accessories before checkout."
  }
];

const OPPORTUNITIES = [
  { title: "Increase accessory attach rate", why: "Accessories have higher profit margins.", action: "Deploy AI bundles" },
  { title: "Improve conversion from high-intent searches", why: "Searchers have immediate purchase intent.", action: "Enhance AI parsing" },
  { title: "Reduce customer decision friction", why: "Too many choices lead to cart abandonment.", action: "Enable AI curation" },
];

export default function GrowthPage() {
  // Select a subset of products for the cross-sell demo (e.g. Travel / Electronics Accessories)
  const crossSellProducts = PRODUCTS.filter(p => p.category === 'travel' || (p.category === 'electronics' && p.price < 5000)).slice(0, 4);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Growth command center <span className={styles.liveDot} /> Live data preview</span>
            <h1 className={styles.title}>Merchant Growth Intelligence</h1>
            <p className={styles.subtitle}>Unlock AI-driven insights to maximize conversion and revenue.</p>
          </div>
          <div className={styles.headerMeta}>
            <div className={styles.demoBadge}>Simulated Analytics Mode</div>
            <span className={styles.period}>Last 7 days <span aria-hidden="true">↗</span></span>
          </div>
        </header>

        {/* 1. KPI Cards */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Performance Overview</h2>
          <div className={styles.kpiGrid}>
            {DEMO_KPIS.map((kpi, idx) => (
              <div key={idx} className={`${styles.kpiCard} ${kpi.highlight ? styles.kpiHighlight : ''}`}>
                <span className={styles.kpiLabel}>{kpi.label}</span>
                <div className={styles.kpiValueRow}>
                  <span className={styles.kpiValue}>{kpi.value}</span>
                  <span className={`${styles.kpiTrend} ${styles.trendUp}`}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Revenue Analytics (Pure CSS Charts) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Revenue & AI Impact</h2>
          <div className={styles.chartGrid}>
            
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Revenue Trend (Last 7 Days)</h3>
              <div className={styles.barChart}>
                {[40, 60, 45, 80, 65, 90, 100].map((h, i) => (
                  <div key={i} className={styles.barColumn}>
                    <div className={styles.bar} style={{ height: `${h}%` }}></div>
                    <span className={styles.barLabel}>D{i+1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>AI-Assisted vs Direct Revenue</h3>
              <div className={styles.horizontalChart}>
                <div className={styles.hBarContainer}>
                  <span className={styles.hBarLabel}>AI-Assisted</span>
                  <div className={styles.hBarTrack}>
                    <div className={styles.hBarFill} style={{ width: '46%', background: 'var(--brand-gradient)' }}></div>
                  </div>
                  <span className={styles.hBarValue}>46%</span>
                </div>
                <div className={styles.hBarContainer}>
                  <span className={styles.hBarLabel}>Direct Search</span>
                  <div className={styles.hBarTrack}>
                    <div className={styles.hBarFill} style={{ width: '34%' }}></div>
                  </div>
                  <span className={styles.hBarValue}>34%</span>
                </div>
                <div className={styles.hBarContainer}>
                  <span className={styles.hBarLabel}>Category Browsing</span>
                  <div className={styles.hBarTrack}>
                    <div className={styles.hBarFill} style={{ width: '20%' }}></div>
                  </div>
                  <span className={styles.hBarValue}>20%</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Customer Intent */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Customer Intent Mapping</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Captured Intent</th>
                  <th>Category</th>
                  <th>Demand</th>
                  <th>Opportunity</th>
                  <th>Suggested Action</th>
                </tr>
              </thead>
              <tbody>
                {INTENTS.map((row, idx) => (
                  <tr key={idx}>
                    <td className={styles.intentCell}>"{row.intent}"</td>
                    <td><span className={styles.badge}>{row.category}</span></td>
                    <td>{row.demand}</td>
                    <td>{row.opportunity}</td>
                    <td className={styles.actionCell}>{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. AI Growth Insights & Opportunities */}
        <div className={styles.twoColSection}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>AI Growth Insights</h2>
            <div className={styles.insightsList}>
              {INSIGHTS.map((insight, idx) => (
                <div key={idx} className={styles.insightCard}>
                  <div className={styles.insightIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div className={styles.insightContent}>
                    <h4>{insight.title}</h4>
                    <p><strong>Insight:</strong> {insight.insight}</p>
                    <p><strong>Opportunity:</strong> {insight.opportunity}</p>
                    <p className={styles.insightAction}><strong>Action:</strong> {insight.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Growth Opportunities</h2>
            <div className={styles.opportunitiesList}>
              {OPPORTUNITIES.map((opp, idx) => (
                <div key={idx} className={styles.oppCard}>
                  <h4>{opp.title}</h4>
                  <p>{opp.why}</p>
                  <span className={styles.oppAction}>+ {opp.action}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 5. AI Cross-sell / Upsell (Real Catalog Data) */}
        <section className={styles.section}>
          <div className={styles.crossSellHeader}>
            <h2 className={styles.sectionTitle}>Live AI Cross-Sell Preview</h2>
            <p className={styles.sectionDesc}>Simulated checkout recommendation: "Because you viewed Laptops and Earbuds..."</p>
          </div>
          <div className={styles.crossSellGrid}>
            {crossSellProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
