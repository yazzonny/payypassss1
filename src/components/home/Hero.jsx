import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, ArrowLeft, Zap, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export const Hero = () => {
  const { language, t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="hero-section">
      <div className="hero-glow-sphere" />
      <div className="container hero-container">
        {/* Left Column: Content */}
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} className="hero-pill-icon" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="hero-title">
            {language === 'ar' ? (
              <>
                عالم الاشتراكات الترفيهية <br />
                <span className="text-gradient">وبطاقات الألعاب الرقمية</span>
              </>
            ) : (
              <>
                Unlock Premium Streaming <br />
                <span className="text-gradient">& Next-Gen Gaming</span>
              </>
            )}
          </h1>

          <p className="hero-subtitle">
            {t('heroSubtitle')}
          </p>

          <div className="hero-actions">
            <Link to="/catalog" className="btn btn-lg btn-primary hero-btn-main">
              <span>{t('heroCtaShop')}</span>
              <ArrowIcon size={18} />
            </Link>
            <Link to="/catalog?category=subscriptions" className="btn btn-lg btn-secondary">
              <Zap size={18} />
              <span>{t('heroCtaSubs')}</span>
            </Link>
          </div>

          {/* Key Value Stats */}
          <div className="hero-stats-row">
            <div className="stat-card">
              <span className="stat-num">{t('heroStat1Number')}</span>
              <span className="stat-lbl">{t('heroStat1Label')}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <span className="stat-num">{t('heroStat2Number')}</span>
              <span className="stat-lbl">{t('heroStat2Label')}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <span className="stat-num">{t('heroStat3Number')}</span>
              <span className="stat-lbl">{t('heroStat3Label')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Graphic with Uploaded Logo */}
        <div className="hero-graphic-wrap">
          <div className="hero-card-glow">
            <div className="hero-logo-frame animate-float">
              <img
                src="/assets/logo.png"
                alt="PlayPass Gamer Character"
                className="hero-logo-img"
              />
            </div>

            {/* Floating Gamertag Card 1 */}
            <div className="floating-badge badge-top-right">
              <div className="floating-icon-dot bg-green" />
              <div>
                <div className="floating-title">Netflix 4K UHD</div>
                <div className="floating-sub">Instant Delivery Active</div>
              </div>
            </div>

            {/* Floating Gamertag Card 2 */}
            <div className="floating-badge badge-bottom-left">
              <div className="floating-icon-dot bg-purple" />
              <div>
                <div className="floating-title">PSN & Game Pass</div>
                <div className="floating-sub">100% Guaranteed Keys</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          padding-block: 60px 80px;
          overflow: hidden;
        }
        .hero-glow-sphere {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(124, 92, 252, 0.15) 0%, rgba(13, 15, 26, 0) 70%);
          pointer-events: none;
          z-index: 0;
        }
        .hero-container {
          position: relative;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 60px;
          align-items: center;
          z-index: 1;
        }
        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(124, 92, 252, 0.12);
          border: 1px solid rgba(124, 92, 252, 0.35);
          color: var(--accent-purple);
          font-size: 0.82rem;
          font-weight: 700;
          margin-bottom: 24px;
        }
        .hero-pill-icon {
          color: #FBBF24;
        }
        .hero-title {
          font-size: 3.4rem;
          line-height: 1.15;
          font-weight: 800;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
        }
        [dir="rtl"] .hero-title {
          font-size: 3.1rem;
          line-height: 1.3;
        }
        .hero-subtitle {
          font-size: 1.12rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 32px;
          max-width: 540px;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 44px;
        }
        .hero-btn-main {
          box-shadow: 0 0 25px rgba(124, 92, 252, 0.45);
        }
        .hero-stats-row {
          display: flex;
          align-items: center;
          gap: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .stat-card {
          display: flex;
          flex-direction: column;
        }
        .stat-num {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-white);
          line-height: 1;
        }
        .stat-lbl {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
        }
        .hero-graphic-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-card-glow {
          position: relative;
          width: 100%;
          max-width: 440px;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-inline: auto;
        }
        .hero-logo-frame {
          position: relative;
          width: min(340px, 72vw);
          height: min(340px, 72vw);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124, 92, 252, 0.28) 0%, rgba(20, 24, 42, 0.95) 75%);
          border: 3px solid var(--border-active);
          box-shadow: 0 0 60px rgba(124, 92, 252, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 0;
          flex-shrink: 0;
        }
        .hero-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
          display: block;
          filter: drop-shadow(0 10px 25px rgba(0,0,0,0.6));
        }
        .floating-badge {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: var(--radius-md);
          background: rgba(19, 23, 42, 0.92);
          border: 1px solid var(--border-active);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
          z-index: 3;
        }
        .badge-top-right {
          top: 15px;
          right: -10px;
        }
        [dir="rtl"] .badge-top-right {
          right: auto;
          left: -10px;
        }
        .badge-bottom-left {
          bottom: 25px;
          left: -10px;
        }
        [dir="rtl"] .badge-bottom-left {
          left: auto;
          right: -10px;
        }
        .floating-icon-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .floating-icon-dot.bg-green {
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }
        .floating-icon-dot.bg-purple {
          background: #7C5CFC;
          box-shadow: 0 0 8px #7C5CFC;
        }
        .floating-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-white);
          line-height: 1.2;
        }
        .floating-sub {
          font-size: 0.72rem;
          color: var(--text-secondary);
        }
        @media (max-width: 960px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }
          .hero-title {
            font-size: clamp(2rem, 5vw + 0.8rem, 2.8rem);
          }
          [dir="rtl"] .hero-title {
            font-size: clamp(1.9rem, 4.8vw + 0.8rem, 2.6rem);
          }
          .hero-subtitle {
            margin-inline: auto;
          }
          .hero-actions {
            justify-content: center;
          }
          .hero-stats-row {
            justify-content: center;
          }
          .hero-logo-frame {
            width: min(280px, 68vw);
            height: min(280px, 68vw);
          }
        }
        @media (max-width: 520px) {
          .hero-section {
            padding-block: 30px 48px;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }
          .hero-actions .btn {
            width: 100%;
          }
          .hero-stats-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            padding-top: 18px;
          }
          .stat-divider {
            display: none;
          }
          .stat-num {
            font-size: 1.45rem;
          }
          .stat-lbl {
            font-size: 0.72rem;
          }
          .badge-top-right {
            top: 6px;
            right: 4px;
          }
          [dir="rtl"] .badge-top-right {
            right: auto;
            left: 4px;
          }
          .badge-bottom-left {
            bottom: 6px;
            left: 4px;
          }
          [dir="rtl"] .badge-bottom-left {
            left: auto;
            right: 4px;
          }
          .floating-badge {
            padding: 7px 12px;
            gap: 6px;
          }
          .floating-title {
            font-size: 0.74rem;
          }
          .floating-sub {
            font-size: 0.64rem;
          }
        }
        @media (max-width: 340px) {
          .hero-stats-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </section>
  );
};
