import React, { useEffect } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { isLiveFirebaseConfigured } from '../../config/firebase';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Type,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Store,
  LogOut,
  Wifi,
  WifiOff
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const { language, t, isRTL } = useLanguage();
  const location = useLocation();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Label every table cell with its column title so tables can render as cards on phones.
  useEffect(() => {
    const label = () => {
      document.querySelectorAll('.admin-table').forEach(table => {
        const heads = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach(tr => {
          [...tr.children].forEach((td, i) => {
            if (heads[i] && td.dataset.label !== heads[i]) td.dataset.label = heads[i];
          });
        });
      });
    };
    label();
    const mo = new MutationObserver(label);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [location.pathname, isAdmin]);

  // Non-admins get no hint that an admin area exists.
  if (!isAdmin) return <Navigate to="/" replace />;

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout-root">
      <div className="container">
        {/* Admin Header Bar */}
        <div className="admin-header-bar glass-card">
          <div className="admin-title-wrap">
            <div className="admin-shield-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="admin-main-heading">{t('adminTitle')}</h1>
              <span className="admin-sub-tag">{t('adminSubtitle')}</span>
            </div>
          </div>

          <div className="admin-top-controls">
            {/* Connection Mode Indicator */}
            <div className={`conn-indicator ${isLiveFirebaseConfigured ? 'live' : 'demo'}`}>
              {isLiveFirebaseConfigured ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span>{isLiveFirebaseConfigured ? 'Firebase Live' : 'Demo Local Mode'}</span>
            </div>

            <Link to="/" className="btn btn-sm btn-secondary">
              <Store size={14} />
              <span>{language === 'ar' ? 'معاينة المتجر' : 'Storefront'}</span>
            </Link>

            <button onClick={logout} className="btn btn-sm btn-outline">
              <LogOut size={14} />
              <span>{t('navLogout')}</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <nav className="admin-nav-tabs">
          <Link
            to="/admin"
            className={`admin-tab ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
          >
            <LayoutDashboard size={17} />
            <span>{t('adminTabOverview')}</span>
          </Link>
          <Link
            to="/admin/products"
            className={`admin-tab ${isActive('/admin/products') ? 'active' : ''}`}
          >
            <Package size={17} />
            <span>{t('adminTabProducts')}</span>
          </Link>
          <Link
            to="/admin/orders"
            className={`admin-tab ${isActive('/admin/orders') ? 'active' : ''}`}
          >
            <ShoppingBag size={17} />
            <span>{t('adminTabOrders')}</span>
          </Link>
          <Link
            to="/admin/content"
            className={`admin-tab ${isActive('/admin/content') ? 'active' : ''}`}
          >
            <Type size={17} />
            <span>{language === 'ar' ? 'محتوى الموقع' : 'Site Content'}</span>
          </Link>
          <Link
            to="/admin/settings"
            className={`admin-tab ${isActive('/admin/settings') ? 'active' : ''}`}
          >
            <Settings size={17} />
            <span>{t('adminTabSettings')}</span>
          </Link>
        </nav>

        {/* Outlet for Admin Pages */}
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .admin-layout-root {
          padding-block: 28px 80px;
        }
        .admin-header-bar {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .admin-title-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .admin-shield-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background: rgba(124, 92, 252, 0.15);
          border: 1px solid var(--border-active);
          color: var(--accent-purple);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin-main-heading {
          font-size: 1.4rem;
          color: var(--text-white);
        }
        .admin-sub-tag {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .admin-top-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .conn-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
        }
        .conn-indicator.live {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .conn-indicator.demo {
          background: rgba(245, 158, 11, 0.15);
          color: #FBBF24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .admin-nav-tabs {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 12px;
          overflow-x: auto;
        }
        .admin-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: var(--radius-sm);
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .admin-tab:hover {
          color: var(--text-white);
          background: var(--primary-soft);
        }
        .admin-tab.active {
          color: var(--text-white);
          background: var(--primary-purple);
          border-color: var(--primary-purple);
          box-shadow: 0 4px 14px rgba(124, 92, 252, 0.35);
        }
        .admin-lock-card {
          max-width: 520px;
          margin-inline: auto;
          padding: 50px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .admin-lock-icon {
          color: #F59E0B;
        }
        .lock-title {
          font-size: 1.6rem;
          color: var(--text-white);
        }
        .lock-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 12px;
        }
        .lock-actions {
          display: flex;
          gap: 12px;
        }
        @media (max-width: 640px) {
          .admin-layout-root {
            padding-block: 18px 60px;
          }
          .admin-header-bar {
            padding: 16px;
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
          .admin-top-controls {
            width: 100%;
            justify-content: space-between;
          }
          .admin-nav-tabs {
            -webkit-overflow-scrolling: touch;
            padding-bottom: 8px;
            margin-bottom: 20px;
          }
          .admin-tab {
            padding: 8px 12px;
            font-size: 0.84rem;
          }
        }
      `}</style>
    </div>
  );
};
