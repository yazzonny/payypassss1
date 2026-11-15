import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, orderService } from '../../config/firebase';
import { useLanguage } from '../../../src/context/LanguageContext';
import { formatPrice, formatDate } from '../../utils/formatters';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  ArrowLeft,
  Gamepad2
} from 'lucide-react';

export const AdminDashboard = () => {
  const { language, t, isRTL } = useLanguage();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [pData, oData] = await Promise.all([
          productService.getAll(),
          orderService.getAll()
        ]);
        setProducts(pData);
        setOrders(oData);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const totalOrdersCount = orders.length;
  const activeProductsCount = products.filter(p => p.inStock).length;
  const pendingOrdersCount = orders.filter(
    o => o.status === 'Pending Verification' || o.status === 'Pending' || o.status === 'Pending Payment'
  ).length;

  const subsCount = products.filter(p => p.category === 'subscriptions').length;
  const gamingCount = products.filter(p => p.category === 'gaming').length;

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="py-80 text-center">
        <div className="spinner" />
        <p>{language === 'ar' ? 'جاري تحميل الإحصائيات...' : 'Loading metrics...'}</p>
      </div>
    );
  }

  return (
    <div className="admin-overview-root">
      {/* 4 Stats Cards */}
      <div className="stats-cards-grid">
        {/* Total Revenue */}
        <div className="stat-overview-card glass-card">
          <div className="stat-icon-wrap bg-purple-glow">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t('adminStatsRevenue')}</span>
            <span className="stat-value">{formatPrice(totalRevenue, language)}</span>
            <span className="stat-sub-growth text-green">
              <TrendingUp size={13} />
              <span>+18.4% {language === 'ar' ? 'هذا الأسبوع' : 'this week'}</span>
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat-overview-card glass-card">
          <div className="stat-icon-wrap bg-blue-glow">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t('adminStatsOrders')}</span>
            <span className="stat-value">{totalOrdersCount}</span>
            <span className="stat-sub-growth">
              {language === 'ar' ? 'إجمالي الطلبات المسجلة' : 'All lifetime orders'}
            </span>
          </div>
        </div>

        {/* Active Products */}
        <div className="stat-overview-card glass-card">
          <div className="stat-icon-wrap bg-green-glow">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t('adminStatsProducts')}</span>
            <span className="stat-value">{activeProductsCount} / {products.length}</span>
            <span className="stat-sub-growth">
              {subsCount} {language === 'ar' ? 'اشتراكات' : 'Subs'} • {gamingCount} {language === 'ar' ? 'ألعاب' : 'Gaming'}
            </span>
          </div>
        </div>

        {/* Pending Fulfillment */}
        <div className="stat-overview-card glass-card">
          <div className="stat-icon-wrap bg-amber-glow">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t('adminStatsPending')}</span>
            <span className="stat-value text-yellow">{pendingOrdersCount}</span>
            <span className="stat-sub-growth">
              {language === 'ar' ? 'بانتظار تسليم الأكواد' : 'Awaiting delivery dispatch'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="quick-actions-bar glass-card">
        <div className="quick-actions-text">
          <h3 className="quick-title">{language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}</h3>
          <p className="quick-desc">
            {language === 'ar'
              ? 'أضف منتجاً جديداً إلى المتجر أو انتقل لمعالجة طلبات العملاء المعلقة.'
              : 'Add new passes or jump straight to fulfilling pending orders.'}
          </p>
        </div>
        <div className="quick-buttons-row">
          <Link to="/admin/products" className="btn btn-primary">
            <Plus size={16} />
            <span>{t('adminAddNewProduct')}</span>
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary">
            <ShoppingBag size={16} />
            <span>{t('adminTabOrders')} ({pendingOrdersCount})</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="recent-orders-section glass-card">
        <div className="recent-orders-head">
          <h3 className="recent-title">{t('adminRecentOrders')}</h3>
          <Link to="/admin/orders" className="btn btn-sm btn-outline">
            <span>{language === 'ar' ? 'عرض كافة الطلبات' : 'View All Orders'}</span>
            <ArrowIcon size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-secondary py-20">{t('noOrdersYet')}</p>
        ) : (
          <div className="recent-orders-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('orderNumber')}</th>
                  <th>{t('adminCustomer')}</th>
                  <th>{t('adminItems')}</th>
                  <th>{t('total')}</th>
                  <th>{t('status')}</th>
                  <th>{t('adminDate')}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <strong className="order-id-code">{order.id}</strong>
                    </td>
                    <td>
                      <div className="cust-cell">
                        <span className="cust-name">{order.customerInfo?.name || 'Customer'}</span>
                        <span className="cust-sub">{order.customerInfo?.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="items-count-tag">
                        {order.items?.length || 1} {language === 'ar' ? 'عنصر' : 'item(s)'}
                      </span>
                    </td>
                    <td>
                      <strong className="order-price-val">{formatPrice(order.total, language)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${
                        order.status === 'Delivered' ? 'badge-success' :
                        (order.status === 'Confirmed' || order.status === 'Paid') ? 'badge-primary' :
                        order.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {order.status === 'Pending Verification' || order.status === 'Pending' || order.status === 'Pending Payment'
                          ? (language === 'ar' ? 'قيد التحقق' : 'Pending Verification')
                          : order.status === 'Confirmed' || order.status === 'Paid'
                          ? (language === 'ar' ? 'تم تأكيد الدفع' : 'Confirmed')
                          : order.status === 'Delivered'
                          ? (language === 'ar' ? 'تم التسليم' : 'Delivered')
                          : order.status === 'Cancelled'
                          ? (language === 'ar' ? 'ملغي' : 'Cancelled')
                          : order.status}
                      </span>
                    </td>
                    <td>
                      <span className="order-date-text">{formatDate(order.createdAt, language)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .admin-overview-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .stats-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .stat-overview-card {
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .stat-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bg-purple-glow {
          background: rgba(124, 92, 252, 0.15);
          color: var(--accent-purple);
          border: 1px solid var(--border-active);
        }
        .bg-blue-glow {
          background: rgba(56, 189, 248, 0.15);
          color: #38BDF8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .bg-green-glow {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .bg-amber-glow {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .stat-content {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }
        .stat-value {
          font-family: var(--font-heading);
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-white);
          line-height: 1.1;
        }
        .stat-sub-growth {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .text-green { color: #10B981; }
        .text-yellow { color: #FBBF24; }
        .quick-actions-bar {
          padding: 22px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .quick-title {
          font-size: 1.15rem;
          color: var(--text-white);
          margin-bottom: 4px;
        }
        .quick-desc {
          font-size: 0.86rem;
          color: var(--text-secondary);
        }
        .quick-buttons-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .recent-orders-section {
          padding: 24px;
        }
        .recent-orders-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .recent-title {
          font-size: 1.25rem;
          color: var(--text-white);
        }
        .recent-orders-table-wrap {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: start;
        }
        .admin-table th {
          font-size: 0.78rem;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 12px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .admin-table td {
          padding: 14px;
          font-size: 0.88rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: var(--text-secondary);
        }
        .order-id-code {
          color: var(--accent-purple);
          font-family: var(--font-heading);
          font-size: 1rem;
        }
        .cust-cell {
          display: flex;
          flex-direction: column;
        }
        .cust-name {
          font-weight: 600;
          color: var(--text-white);
        }
        .cust-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .order-price-val {
          color: var(--text-white);
          font-family: var(--font-heading);
          font-size: 1.05rem;
        }
        .items-count-tag {
          font-size: 0.78rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .order-date-text {
          font-size: 0.8rem;
        }
        @media (max-width: 1024px) {
          .stats-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .stats-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
