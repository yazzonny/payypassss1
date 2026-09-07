import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingCart,
  Globe,
  User,
  ShieldAlert,
  Menu,
  X,
  Gamepad2,
  Tv,
  Layers,
  LogOut
} from 'lucide-react';

export const Navbar = () => {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { itemsCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobile}>
          <div className="logo-badge">
            <img src="/assets/logo.png" alt="PlayPass Logo" className="brand-logo-img" />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">PLAYPASS</span>
            <span className="brand-tagline">{t('tagline')}</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            {t('navHome')}
          </Link>
          <Link
            to="/catalog"
            className={`nav-link ${isActive('/catalog') && !location.search ? 'active' : ''}`}
          >
            <Layers size={16} />
            {t('navCatalog')}
          </Link>
          <Link
            to="/catalog?category=subscriptions"
            className={`nav-link ${location.search.includes('subscriptions') ? 'active' : ''}`}
          >
            <Tv size={16} />
            {t('navSubscriptions')}
          </Link>
          <Link
            to="/catalog?category=gaming"
            className={`nav-link ${location.search.includes('gaming') ? 'active' : ''}`}
          >
            <Gamepad2 size={16} />
            {t('navGaming')}
          </Link>
        </nav>

        {/* Action Controls: Language, Cart, Auth */}
        <div className="navbar-actions">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="btn-icon lang-toggle-btn"
            title={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
            aria-label="Language Toggle"
          >
            <Globe size={18} className="lang-icon" />
            <span className="lang-text">{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Cart Icon & Badge */}
          <Link to="/cart" className="btn-icon cart-badge-btn" aria-label="Cart">
            <ShoppingCart size={20} />
            {itemsCount > 0 && (
              <span className="cart-counter animate-glow">{itemsCount}</span>
            )}
          </Link>

          {/* User / Admin Controls */}
          {user ? (
            <div className="user-dropdown-area">
              {isAdmin && (
                <Link to="/admin" className="btn btn-sm btn-outline admin-badge-link">
                  <ShieldAlert size={14} />
                  <span>{t('navAdmin')}</span>
                </Link>
              )}
              <Link to="/account" className="btn btn-sm btn-secondary account-link">
                <User size={15} />
                <span className="user-display-name">{user.displayName || t('navAccount')}</span>
              </Link>
              <button
                onClick={logout}
                className="btn-icon logout-btn"
                title={t('navLogout')}
                aria-label="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-sm btn-primary login-btn">
              <User size={15} />
              <span>{t('navLogin')}</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <Link to="/" className="mobile-nav-link" onClick={closeMobile}>
            {t('navHome')}
          </Link>
          <Link to="/catalog" className="mobile-nav-link" onClick={closeMobile}>
            <Layers size={18} />
            {t('navCatalog')}
          </Link>
          <Link to="/catalog?category=subscriptions" className="mobile-nav-link" onClick={closeMobile}>
            <Tv size={18} />
            {t('navSubscriptions')}
          </Link>
          <Link to="/catalog?category=gaming" className="mobile-nav-link" onClick={closeMobile}>
            <Gamepad2 size={18} />
            {t('navGaming')}
          </Link>
          <Link to="/account" className="mobile-nav-link" onClick={closeMobile}>
            <User size={18} />
            {t('navMyOrders')}
          </Link>
          {isAdmin && (
            <Link to="/admin" className="mobile-nav-link admin-highlight" onClick={closeMobile}>
              <ShieldAlert size={18} />
              {t('navAdmin')}
            </Link>
          )}
          <div className="mobile-nav-footer">
            <button onClick={toggleLanguage} className="btn btn-secondary w-full">
              <Globe size={16} />
              <span>{language === 'en' ? 'تغيير اللغة إلى العربية' : 'Switch Language to English'}</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(13, 15, 26, 0.88);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
          transition: background 0.3s ease;
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-block: 12px;
          height: 72px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-badge {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #181d33 0%, #101322 100%);
          border: 2px solid var(--border-active);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 0 15px rgba(124, 92, 252, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          flex-shrink: 0;
        }
        .navbar-brand:hover .logo-badge {
          transform: scale(1.05);
          box-shadow: 0 0 25px var(--primary-glow);
        }
        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
          display: block;
        }
        .brand-text-block {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        .brand-title {
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 1.45rem;
          color: var(--text-white);
          letter-spacing: 1.5px;
          text-shadow: 0 0 15px rgba(124, 92, 252, 0.5);
        }
        .brand-tagline {
          font-size: 0.65rem;
          color: var(--accent-purple);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-top: 2px;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 22px;
        }
        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--text-secondary);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: var(--text-white);
          background: var(--primary-soft);
        }
        .nav-link.active {
          color: var(--text-white);
          background: rgba(124, 92, 252, 0.18);
          border: 1px solid rgba(124, 92, 252, 0.35);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lang-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          padding-inline: 12px;
          height: 40px;
        }
        .lang-text {
          font-size: 0.82rem;
        }
        .cart-badge-btn {
          position: relative;
          height: 40px;
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-counter {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--primary-purple);
          color: white;
          font-size: 0.72rem;
          font-weight: 800;
          min-width: 19px;
          height: 19px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-deep);
        }
        [dir="rtl"] .cart-counter {
          right: auto;
          left: -4px;
        }
        .user-dropdown-area {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .admin-badge-link {
          border-color: rgba(245, 158, 11, 0.5);
          color: #FBBF24;
          background: rgba(245, 158, 11, 0.1);
        }
        .admin-badge-link:hover {
          background: rgba(245, 158, 11, 0.2);
          border-color: #FBBF24;
          color: #FDE68A;
        }
        .account-link {
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-display-name {
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-white);
          cursor: pointer;
          padding: 8px;
        }
        .mobile-nav-drawer {
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-active);
          padding: 16px 20px 24px;
          gap: 12px;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          font-size: 1.05rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }
        .mobile-nav-link.admin-highlight {
          color: #FBBF24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .w-full {
          width: 100%;
        }
        @media (max-width: 860px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .user-display-name {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .navbar-container {
            height: 62px;
            padding-inline: 10px;
          }
          .logo-badge {
            width: 38px;
            height: 38px;
          }
          .brand-title {
            font-size: 1.15rem;
            letter-spacing: 1px;
          }
          .brand-tagline {
            display: none;
          }
          .navbar-actions {
            gap: 6px;
          }
          .lang-toggle-btn {
            padding-inline: 8px;
            height: 36px;
          }
          .cart-badge-btn {
            width: 36px;
            height: 36px;
          }
          .admin-badge-link {
            display: none;
          }
          .login-btn {
            padding: 7px 10px;
            font-size: 0.8rem;
          }
        }
        @media (max-width: 360px) {
          .login-btn span {
            display: none;
          }
          .login-btn {
            padding: 8px;
            min-width: 36px;
            height: 36px;
          }
          .brand-title {
            font-size: 1rem;
          }
        }
        @media (max-width: 320px) {
          .brand-title {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
