import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Zap, ShieldCheck, Headphones, CreditCard } from 'lucide-react';

export const TrustSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Zap size={26} />,
      title: t('trustFeature1Title'),
      desc: t('trustFeature1Desc')
    },
    {
      icon: <ShieldCheck size={26} />,
      title: t('trustFeature2Title'),
      desc: t('trustFeature2Desc')
    },
    {
      icon: <Headphones size={26} />,
      title: t('trustFeature3Title'),
      desc: t('trustFeature3Desc')
    },
    {
      icon: <CreditCard size={26} />,
      title: t('trustFeature4Title'),
      desc: t('trustFeature4Desc')
    }
  ];

  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-header text-center">
          <h2 className="section-title">{t('trustTitle')}</h2>
          <p className="section-subtitle">{t('trustSubtitle')}</p>
        </div>

        <div className="trust-grid">
          {features.map((item, idx) => (
            <div key={idx} className="trust-card glass-card">
              <div className="trust-icon-box">{item.icon}</div>
              <h3 className="trust-card-title">{item.title}</h3>
              <p className="trust-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .trust-section {
          padding-block: 50px 70px;
        }
        .text-center {
          text-align: center;
        }
        .trust-header {
          margin-bottom: 40px;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        .trust-card {
          padding: 28px 22px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: start;
        }
        [dir="rtl"] .trust-card {
          align-items: flex-start;
          text-align: start;
        }
        .trust-icon-box {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          background: rgba(124, 92, 252, 0.14);
          border: 1px solid var(--border-active);
          color: var(--accent-purple);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .trust-card-title {
          font-size: 1.12rem;
          color: var(--text-white);
          margin-bottom: 8px;
        }
        .trust-card-desc {
          font-size: 0.86rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        @media (max-width: 1024px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .trust-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
