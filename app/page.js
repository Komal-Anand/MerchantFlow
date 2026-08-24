'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { PRODUCTS } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { useState } from 'react';

export default function Home() {
  // Extract specific products for the AI preview showcases
  // "wireless earbuds under ₹3,000" (using 30000 to match catalogue realistically for Bose/Sony)
  const earbuds = PRODUCTS
    .filter(p => p.category === 'electronics' && p.name.toLowerCase().includes('earbud'))
    .slice(0, 3);

  // "running shoes under ₹5,000" (using 15000 to match catalogue realistically)
  const shoes = PRODUCTS
    .filter(p => p.category === 'fashion' && p.name.toLowerCase().includes('running'))
    .slice(0, 3);

  // Dummy state to handle product clicks without errors
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className={styles.page}>
      
      {/* Background glow & Grid */}
      <div className={styles.bgGlow}></div>
      <div className={styles.bgGrid}></div>

      <div className={styles.inner}>
        
        {/* 2. HERO SECTION */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>AI GROWTH & AGENTIC COMMERCE</div>
            
            <h1 className={styles.heroTitle}>
              Commerce begins<br/>with <span className={styles.textAccent}>intent.</span>
            </h1>
            
            <h2 className={styles.heroSubtitle}>Connect Intent. Drive Growth.</h2>
            
            <p className={styles.heroDesc}>
              MerchantFlow understands what customers want, discovers relevant products, guides decisions, and turns every interaction into a growth opportunity.
            </p>
            
            <div className={styles.heroActions}>
              <Link href="/assistant" className={styles.primaryBtn}>Explore with AI →</Link>
              <Link href="/discover" className={styles.secondaryBtn}>Explore Products →</Link>
            </div>

            <div className={styles.capabilityIndicators}>
              <div className={styles.capInd}>
                <strong>AI Powered</strong>
                <span>Natural language understanding</span>
              </div>
              <div className={styles.capInd}>
                <strong>Smarter Discovery</strong>
                <span>Relevant products, in seconds</span>
              </div>
              <div className={styles.capInd}>
                <strong>Growth Focused</strong>
                <span>Actionable insights that drive sales</span>
              </div>
            </div>
          </div>

          <div className={styles.heroPreview}>
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <div className={styles.aiStatus}>
                  <span className={styles.statusDot}></span>
                  <span>MerchantFlow AI ● Online</span>
                </div>
              </div>
              <div className={styles.chatArea}>
                <div className={styles.chatBubbleUser}>
                  "I need wireless earbuds under ₹3,000 with good battery life."
                </div>
                <div className={styles.chatBubbleAi}>
                  "Based on your budget and battery preference, I found 3 strong matches."
                </div>
                
                <div className={styles.productScroller}>
                  {earbuds.map(product => (
                    <div key={product.id} className={styles.previewProductCard}>
                      <ProductCard product={product} onClick={setSelectedProduct} />
                    </div>
                  ))}
                </div>

                <div className={styles.previewFooterText}>
                  <span className={styles.checkItem}>✓ Intent understood</span>
                  <span className={styles.arrow}>→</span>
                  <span className={styles.checkItem}>✓ Products matched</span>
                  <span className={styles.arrow}>→</span>
                  <span className={styles.checkItem}>✓ Ready to purchase</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CAPABILITY STRIP */}
        <section className={styles.capabilityStrip}>
          <div className={styles.stripCard}>
            <div className={styles.stripItem}>
              <h4>Natural Language Intent</h4>
              <p>Understand what customers actually want.</p>
            </div>
            <div className={styles.stripDivider}></div>
            <div className={styles.stripItem}>
              <h4>AI Product Discovery</h4>
              <p>Match intent with relevant products.</p>
            </div>
            <div className={styles.stripDivider}></div>
            <div className={styles.stripItem}>
              <h4>Intelligent Checkout</h4>
              <p>Move from decision to secure payment.</p>
            </div>
            <div className={styles.stripDivider}></div>
            <div className={styles.stripItem}>
              <h4>Merchant Growth</h4>
              <p>Turn intent into actionable growth opportunities.</p>
            </div>
          </div>
        </section>

        {/* 4. FROM INTENT TO GROWTH JOURNEY SECTION */}
        <section className={styles.journeySection}>
          <div className={styles.sectionHeaderCentered}>
            <h2 className={styles.sectionTitle}>From Intent to Growth</h2>
            <p className={styles.sectionSubtitle}>
              One intelligent journey from the customer's first request to the merchant's next opportunity.
            </p>
          </div>
          
          <div className={styles.journeySteps}>
            <div className={styles.journeyLine}></div>
            
            <div className={styles.journeyCard}>
              <div className={styles.stepNum}>01</div>
              <h4 className={styles.stepTitle}>Understand Intent</h4>
              <p className={styles.stepDesc}>Translate natural language into structured shopping intent.</p>
            </div>
            <div className={styles.journeyCard}>
              <div className={styles.stepNum}>02</div>
              <h4 className={styles.stepTitle}>Discover</h4>
              <p className={styles.stepDesc}>Find products that match the customer's actual needs.</p>
            </div>
            <div className={styles.journeyCard}>
              <div className={styles.stepNum}>03</div>
              <h4 className={styles.stepTitle}>Recommend</h4>
              <p className={styles.stepDesc}>Help customers compare and make confident decisions.</p>
            </div>
            <div className={styles.journeyCard}>
              <div className={styles.stepNum}>04</div>
              <h4 className={styles.stepTitle}>Checkout</h4>
              <p className={styles.stepDesc}>Move seamlessly from product selection to secure payment.</p>
            </div>
            <div className={styles.journeyCard}>
              <div className={styles.stepNum}>05</div>
              <h4 className={styles.stepTitle}>Grow</h4>
              <p className={styles.stepDesc}>Turn customer intent into merchant growth signals.</p>
            </div>
          </div>
        </section>

        {/* 5. CONVERSATIONAL COMMERCE SECTION */}
        <section className={styles.conversationSection}>
          <div className={styles.convContent}>
            <div className={styles.sectionLabel}>AI COMMERCE EXPERIENCE</div>
            <h2 className={styles.sectionTitle}>Commerce Starts<br/>With a Conversation.</h2>
            <p className={styles.sectionSubtitleAlt}>
              Instead of forcing customers through filters, MerchantFlow lets them simply describe what they need.
            </p>
            <Link href="/assistant" className={styles.primaryBtn}>Try AI Assistant →</Link>
          </div>
          
          <div className={styles.convPreview}>
            <div className={styles.convCardWrapper}>
              <div className={styles.chatAreaAlt}>
                <div className={styles.chatBubbleUser}>
                  "Find me running shoes under ₹5,000 for daily workouts."
                </div>
                <div className={styles.chatBubbleAi}>
                  "I found several options matching your budget and use case."
                </div>
                
                <div className={styles.productScrollerAlt}>
                  {shoes.map(product => (
                    <div key={product.id} className={styles.previewProductCardSmall}>
                      <ProductCard product={product} onClick={setSelectedProduct} />
                    </div>
                  ))}
                </div>
                
                <div className={styles.carouselIndicators}>
                  <span className={styles.carouselDotActive}></span>
                  <span className={styles.carouselDot}></span>
                  <span className={styles.carouselDot}></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. GROWTH SIGNALS SECTION */}
        <section className={styles.growthSection}>
          <div className={styles.growthContent}>
            <div className={styles.sectionLabel}>MERCHANT GROWTH INTELLIGENCE</div>
            <h2 className={styles.sectionTitle}>Every Customer Intent<br/>Is a Growth Signal.</h2>
            <p className={styles.sectionSubtitleAlt}>
              MerchantFlow connects customer conversations with merchant intelligence — revealing what customers want, where they hesitate, and what opportunities can increase conversion and basket size.
            </p>
            <Link href="/growth" className={styles.primaryBtn}>Explore Growth Intelligence →</Link>
          </div>

          <div className={styles.growthPreview}>
            <div className={styles.growthCardsCol}>
              <div className={styles.gCard}>
                <div className={styles.gLabel}>CUSTOMER SIGNAL</div>
                <div className={styles.gText}>"Laptop shoppers frequently explore accessories."</div>
                <div className={styles.miniChart}>
                  <svg viewBox="0 0 100 30" fill="none" stroke="#2563EB" strokeWidth="2">
                    <path d="M0 25 L20 20 L40 28 L60 15 L80 18 L100 5" />
                  </svg>
                </div>
              </div>
              <div className={styles.gCard}>
                <div className={styles.gLabel}>AI OPPORTUNITY</div>
                <div className={styles.gText}>"Recommend relevant accessories before checkout."</div>
                <div className={styles.miniChart}>
                  <svg viewBox="0 0 100 30" fill="none" stroke="#22C55E" strokeWidth="2">
                    <path d="M0 28 L30 15 L50 20 L70 5 L100 2" />
                  </svg>
                </div>
              </div>
              <div className={styles.gCard}>
                <div className={styles.gLabel}>GROWTH IMPACT</div>
                <div className={styles.gText}>"Create contextual cross-sell opportunities."</div>
                <div className={styles.miniChart}>
                  <svg viewBox="0 0 100 30" fill="none" stroke="#9333EA" strokeWidth="2">
                    <path d="M0 30 L20 25 L40 10 L70 15 L100 0" />
                  </svg>
                </div>
              </div>
              <div className={styles.analyticsBadgeContainer}>
                <div className={styles.analyticsBadge}>Simulated merchant analytics</div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA SECTION */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Ready to turn intent into growth?</h2>
            <p className={styles.ctaDesc}>Explore products, talk to MerchantFlow AI, and experience the complete commerce journey.</p>
            <div className={styles.ctaActions}>
              <Link href="/assistant" className={styles.primaryBtn}>Try MerchantFlow AI →</Link>
              <Link href="/discover" className={styles.secondaryBtn}>Explore Products →</Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
