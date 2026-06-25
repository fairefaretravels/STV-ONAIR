// pages/index.jsx  (or app/page.jsx for App Router)
// Drop the CSS module file alongside this: RadioMeltdown.module.css

import styles from "./RadioMeltdown.module.css";

export default function RadioMeltdownPage() {
  return (
    <main className={styles.page}>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* slow-drifting car silhouette */}
        <div className={styles.carTrack} aria-hidden="true">
          <div className={styles.car}>🚗</div>
        </div>

        <div className={styles.heroBadge}>LIVE</div>
        <p className={styles.heroLocation}>LIVE FROM LITHONIA, GEORGIA</p>
        <p className={styles.heroOnAir}>
          <span className={styles.dot} /> ON AIR
        </p>
      </section>

      {/* ── META ROW ─────────────────────────────────── */}
      <section className={styles.meta}>
        <span className={styles.metaName}>STV RADIOMELTDOWN — LITHONIA, GA</span>
        <a href="tel:6784338772" className={styles.metaPhone}>
          678-433-8772
        </a>
      </section>

      {/* ── LINKS ROW ────────────────────────────────── */}
      <nav className={styles.links}>
        <a href="#contact" className={styles.linkPlain}>
          CONTACT US
        </a>
        <a href="#book" className={styles.linkUnderline}>
          BOOK US — BARTENDING &amp; DJ SERVICES
        </a>
      </nav>

      {/* ── CTA ──────────────────────────────────────── */}
      <div className={styles.ctaWrapper}>
        <a href="#radio" className={styles.ctaButton}>
          <span className={styles.bolt}>⚡</span>
          ENTER RADIO
          <span className={styles.bolt}>⚡</span>
        </a>
      </div>

      {/* ── FEATURE TRACK ────────────────────────────── */}
      <section className={styles.featureTrack}>
        <p className={styles.featureText}>
          EMIL GORDON JR FEAT. RISK –<br />
          CRUIZN&apos; LISTEN{" "}
          <span className={styles.pointer}>👉</span> HERE
        </p>
      </section>

      {/* ── NOW PLAYING CARD ─────────────────────────── */}
      <section className={styles.nowPlaying}>
        <div className={styles.albumArt}>
          {/* Replace src with your actual image */}
          <img src="/album-art.jpg" alt="I'm Off My Meds" />
        </div>
        <div className={styles.trackInfo}>
          <p className={styles.trackTitle}>Season 5 Trailer</p>
          <p className={styles.trackMeta}>Jan 3 · I&apos;m Off My Meds</p>
          <p className={styles.trackTime}>48:32</p>
        </div>
        <button className={styles.playBtn} aria-label="Play">
          ▶
        </button>
      </section>

      {/* ── TIKTOK BANNER ────────────────────────────── */}
      <div className={styles.tiktokBanner}>SAW IT ON TIKTOK</div>
    </main>
  );
}
