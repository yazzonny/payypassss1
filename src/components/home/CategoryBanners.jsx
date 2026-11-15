import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Tilt } from '../fx/Tilt';
import { Reveal } from '../fx/Reveal';
import { Tv, Gamepad2, ArrowRight, ArrowLeft, Trophy } from 'lucide-react';

export const CategoryBanners = () => {
  const { language, t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">{t('catSectionTitle')}</h2>
            <p className="section-subtitle">{t('catSectionSubtitle')}</p>
          </div>
        </div>

        <div className="categories-grid">
          {/* Subscriptions Card */}
          <Reveal><Tilt max={6}><Link to="/catalog?category=subscriptions" className="category-card cat-subs glass-card">
            <div className="category-card-bg bg-subs-gradient" />
            <div className="cat-icon-box">
              <Tv size={28} />
            </div>
            <div className="cat-card-content">
              <span className="cat-badge-tag">{language === 'ar' ? 'ترفيه ومباريات' : 'Streaming & TV'}</span>
              <h3 className="cat-title">{t('catSubsTitle')}</h3>
              <p className="cat-desc">{t('catSubsDesc')}</p>
              <div className="cat-pills">
                <span>Netflix 4K</span>
                <span>IPTV VIP</span>
                <span>Spotify</span>
                <span>YouTube Premium</span>
              </div>
              <div className="cat-explore-link">
                <span>{language === 'ar' ? 'تصفح الاشتراكات' : 'Explore Subscriptions'}</span>
                <ArrowIcon size={16} />
              </div>
            </div>
          </Link></Tilt></Reveal>

          {/* Gaming Card */}
          <Reveal><Tilt max={6}><Link to="/catalog?category=gaming" className="category-card cat-gaming glass-card">
            <div className="category-card-bg bg-gaming-gradient" />
            <div className="cat-icon-box">
              <Gamepad2 size={28} />
            </div>
            <div className="cat-card-content">
              <span className="cat-badge-tag">{language === 'ar' ? 'شحن فوري وبطاقات' : 'Consoles & PC'}</span>
              <h3 className="cat-title">{t('catGamingTitle')}</h3>
              <p className="cat-desc">{t('catGamingDesc')}</p>
              <div className="cat-pills">
                <span>PlayStation PSN</span>
                <span>Xbox Game Pass</span>
                <span>Steam</span>
                <span>Razer Gold</span>
              </div>
              <div className="cat-explore-link">
                <span>{language === 'ar' ? 'تصفح الألعاب والبطاقات' : 'Explore Gaming'}</span>
                <ArrowIcon size={16} />
              </div>
            </div>
          </Link></Tilt></Reveal>
        </div>
      </div>

      <style>{`
        .categories-section {
          padding-block: 40px 60px;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .section-title {
          font-size: 2rem;
          color: var(--text-white);
          margin-bottom: 6px;
        }
        .section-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }
        .category-card {
          position: relative;
          padding: 36px 32px;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: inherit;
        }
        .category-card-bg {
          position: absolute;
          inset: 0;
          opacity: 0.22;
          transition: opacity 0.3s ease, transform 0.4s ease;
          z-index: 0;
        }
        .bg-subs-gradient {
          background: radial-gradient(circle at 100% 0%, #E50914 0%, transparent 60%),
                      radial-gradient(circle at 0% 100%, #7C5CFC 0%, transparent 60%);
        }
        .bg-gaming-gradient {
          background: radial-gradient(circle at 100% 0%, #0070D1 0%, transparent 60%),
                      radial-gradient(circle at 0% 100%, #107C10 0%, transparent 60%);
        }
        .category-card:hover .category-card-bg {
          opacity: 0.35;
          transform: scale(1.04);
        }
        .cat-icon-box {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          background: rgba(124, 92, 252, 0.18);
          border: 1px solid var(--border-active);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-purple);
          margin-bottom: 22px;
          z-index: 1;
        }
        .cat-card-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .cat-badge-tag {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--accent-purple);
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }
        .cat-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-white);
          margin-bottom: 10px;
        }
        .cat-desc {
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .cat-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .cat-pills span {
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .cat-explore-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-white);
          margin-top: auto;
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .category-card:hover .cat-explore-link {
          color: var(--accent-purple);
          transform: translateX(6px);
        }
        [dir="rtl"] .category-card:hover .cat-explore-link {
          transform: translateX(-6px);
        }
        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }
          .category-card {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
};
