import styles from './HeroSection.module.css';

const JOURNEY_STEPS = [
  'Customer Intent',
  'AI Understanding',
  'Product Discovery',
  'Recommendation',
  'Cart',
  'Razorpay Checkout',
  'Merchant Growth',
];

const ArrowIcon = () => (
  <svg
    className={styles.stepArrow}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 6h8M7 3l3 3-3 3" />
  </svg>
);

export default function HeroSection() {
  return (
    <section className={styles.section} aria-labelledby="hero-headline">
      <div className={styles.inner}>

        {/* Track Badge */}
        <div className={styles.trackBadge} role="note">
          <span className={styles.trackDot} aria-hidden="true" />
          Razorpay AI Track — AI Growth &amp; Agentic Commerce
        </div>

        {/* Headline + Tagline */}
        <div className={styles.headlineGroup}>
          <h1 id="hero-headline" className={styles.headline}>
            Merchant<span className={styles.accentWord}>Flow</span>
          </h1>
          <p className={styles.tagline}>Connect Intent. Drive Growth.</p>
        </div>

        {/* Description */}
        <p className={styles.description}>
          An AI-powered agentic commerce platform that understands customer intent
          in natural language, guides product discovery, and closes the loop from
          first touch to Razorpay checkout — autonomously.
        </p>

        <div className={styles.divider} aria-hidden="true" />

        {/* Journey Steps Preview */}
        <div className={styles.journeyRow} aria-label="Commerce journey overview">
          {JOURNEY_STEPS.map((step, index) => (
            <div key={step} className={styles.journeyStep}>
              <span className={styles.stepLabel}>{step}</span>
              {index < JOURNEY_STEPS.length - 1 && <ArrowIcon />}
            </div>
          ))}
        </div>

        {/* Status */}
        <div className={styles.statusRow}>
          <div className={styles.statusItem}>
            <span className={styles.statusDot} aria-hidden="true" />
            Foundation ready
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusDot} style={{ backgroundColor: 'var(--color-accent)' }} aria-hidden="true" />
            Part 1 of 8
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusDot} style={{ backgroundColor: 'var(--color-text-muted)', opacity: 0.5 }} aria-hidden="true" />
            AI Agent — coming soon
          </div>
        </div>

      </div>
    </section>
  );
}
