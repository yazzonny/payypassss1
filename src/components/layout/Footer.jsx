import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { settingsService, DEFAULT_SETTINGS } from '../../config/firebase';
import { Zap, ShieldCheck, Headphones, MessageCircle } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();
  const [whatsappNum, setWhatsappNum] = useState(DEFAULT_SETTINGS.whatsappNumber);

  useEffect(() => {
    settingsService.get().then(s => {
      if (s?.whatsappNumber) setWhatsappNum(s.whatsappNumber);
    });

    const handleSettingsUpdate = (e) => {
      if (e.detail?.whatsappNumber) {
        setWhatsappNum(e.detail.whatsappNumber);
      }
    };
    window.addEventListener('playpass_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('playpass_settings_updated', handleSettingsUpdate);
  }, []);

  const cleanWaNumber = whatsappNum.replace(/[^0-9]/g, '') || '962780114108';

  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-brand">
            <div className="footer-logo-box">
              <img src="/assets/logo.png" alt="PlayPass" className="footer-logo-img" />
            </div>
            <div>
              <span className="footer-brand-name">PLAYPASS</span>
              <span className="footer-brand-sub">{t('tagline')}</span>
            </div>
          </Link>
          <p className="footer-desc-text">{t('footerDesc')}</p>
          <div className="footer-features-pills">
            <span className="badge badge-primary"><Zap size={12} /> {t('trustFeature1Title')}</span>
            <span className="badge badge-success"><ShieldCheck size={12} /> {t('trustFeature2Title')}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-title">{t('footerQuickLinks')}</h4>
          <ul className="footer-links">
            <li><Link to="/">{t('navHome')}</Link></li>
            <li><Link to="/catalog">{t('navCatalog')}</Link></li>
            <li><Link to="/account">{t('navMyOrders')}</Link></li>
            <li><Link to="/cart">{t('cart')}</Link></li>
            <li><Link to="/admin">{t('navAdmin')} (yznyzn123)</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4 className="footer-title">{t('footerCategories')}</h4>
          <ul className="footer-links">
            <li><Link to="/catalog?category=subscriptions">Netflix & Streaming</Link></li>
            <li><Link to="/catalog?category=subscriptions">IPTV VIP Sports</Link></li>
            <li><Link to="/catalog?category=gaming">PlayStation PSN Cards</Link></li>
            <li><Link to="/catalog?category=gaming">Xbox Game Pass Ultimate</Link></li>
            <li><Link to="/catalog?category=gaming">Steam Wallet & Razer Gold</Link></li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div className="footer-col">
          <h4 className="footer-title">{t('footerSupport')}</h4>
          <p className="footer-support-p">{t('trustFeature3Desc')}</p>
          <a
            href={`https://wa.me/${cleanWaNumber}?text=Hello%20PlayPass%20Support`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline whatsapp-btn"
          >
            <MessageCircle size={16} />
            <span>WhatsApp: {whatsappNum}</span>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p>© {new Date().getFullYear()} PlayPass. {t('footerAllRights')}</p>
          <div className="footer-bottom-tags">
            <span>Manual Support Verification</span>
            <span>•</span>
            <span>Secure Checkout</span>
            <span>•</span>
            <span>Arabic & English RTL</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background: #090B13;
          border-top: 1px solid var(--border-subtle);
          margin-top: 80px;
          padding-top: 60px;
        }
        .footer-container {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px;
          padding-bottom: 50px;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .footer-logo-box {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #141829;
          border: 2px solid var(--border-active);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .footer-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
          display: block;
        }
        .footer-brand-name {
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 1.35rem;
          color: var(--text-white);
          display: block;
          line-height: 1;
        }
        .footer-brand-sub {
          font-size: 0.65rem;
          color: var(--accent-purple);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .footer-desc-text {
          color: var(--text-secondary);
          font-size: 0.88rem;
          line-height: 1.6;
          margin-bottom: 16px;
          max-width: 380px;
        }
        .footer-features-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .footer-title {
          font-size: 1rem;
          color: var(--text-white);
          margin-bottom: 18px;
          position: relative;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links a {
          color: var(--text-secondary);
          font-size: 0.88rem;
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-block;
        }
        .footer-links a:hover {
          color: var(--accent-purple);
          transform: translateX(4px);
        }
        [dir="rtl"] .footer-links a:hover {
          transform: translateX(-4px);
        }
        .footer-support-p {
          color: var(--text-secondary);
          font-size: 0.88rem;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .whatsapp-btn {
          color: #25D366;
          border-color: rgba(37, 211, 102, 0.3);
        }
        .whatsapp-btn:hover {
          background: rgba(37, 211, 102, 0.1);
          border-color: #25D366;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-block: 20px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .footer-bottom-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-bottom-tags {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        @media (max-width: 960px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
          }
          .brand-col {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 580px) {
          .footer-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};
