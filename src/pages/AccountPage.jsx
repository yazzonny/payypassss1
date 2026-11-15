import { Tilt } from '../components/fx/Tilt';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { orderService, settingsService } from '../config/firebase';
import { formatPrice, formatDate } from '../utils/formatters';
import {
  User,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Copy,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';

export const AccountPage = () => {
  const { user, logout } = useAuth();
  const { language, t, isRTL } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const all = await orderService.getAll();
        if (user) {
          // Filter to user orders or show demo customer orders
          const userOrders = all.filter(o =>
            (o.userId && o.userId === user.uid) ||
            (o.customerInfo?.email && o.customerInfo.email.toLowerCase() === user.email.toLowerCase()) ||
            user.isDemo
          );
          setOrders(userOrders.length > 0 ? userOrders : all);
        } else {
          setOrders(all);
        }
      } catch (err) {
        console.error('Error fetching account orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [whatsappNum, setWhatsappNum] = useState('+962780114108');

  useEffect(() => {
    settingsService.get().then(s => {
      if (s?.whatsappNumber) setWhatsappNum(s.whatsappNumber);
    });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> {t('statusDelivered')}</span>;
      case 'Confirmed':
      case 'Paid':
        return <span className="badge badge-primary"><ShieldCheck size={12} /> {t('statusConfirmed')}</span>;
      case 'Cancelled':
        return <span className="badge badge-danger"><XCircle size={12} /> {t('statusCancelled')}</span>;
      case 'Pending Verification':
      case 'Pending Payment':
      case 'Pending':
      default:
        return <span className="badge badge-warning"><Clock size={12} /> {t('statusPendingVerification')}</span>;
    }
  };

  return (
    <div className="account-page-root">
      <div className="container">
        {/* Profile Header Bar */}
        <Tilt max={4}><div className="profile-hero-card glass-card">
          <div className="profile-avatar-box">
            <User size={36} />
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{user?.displayName || 'PlayPass Customer'}</h1>
            <span className="profile-email">{user?.email || 'Logged in Session'}</span>
            <div className="profile-tags">
              <span className="badge badge-category">
                {user?.role === 'admin' ? 'Store Administrator' : 'Verified Buyer'}
              </span>
              <span className="badge badge-primary">VIP Member</span>
            </div>
          </div>
          <div className="profile-actions">
            <button onClick={logout} className="btn btn-sm btn-outline">
              {t('navLogout')}
            </button>
          </div>
        </div></Tilt>

        {/* Order History Section */}
        <div className="orders-section">
          <div className="orders-header">
            <div>
              <h2 className="orders-title">{t('myAccountTitle')}</h2>
              <p className="orders-subtitle">{t('myAccountSubtitle')}</p>
            </div>
          </div>

          {loading ? (
            <div className="py-80 text-center">
              <div className="spinner" />
              <p>{language === 'ar' ? 'جاري استرجاع طلباتك...' : 'Loading orders...'}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-orders-card glass-card text-center">
              <ShoppingBag size={48} className="empty-icon" />
              <h3>{t('noOrdersYet')}</h3>
              <p>
                {language === 'ar'
                  ? 'اختر من باقات نتفلكس، IPTV، أو بطاقات الألعاب المفضلة لديك.'
                  : 'Choose from our digital subscriptions and gaming cards to start.'}
              </p>
              <Link to="/catalog" className="btn btn-primary mt-12">
                <span>{t('startShopping')}</span>
                <ArrowIcon size={16} />
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-history-card glass-card">
                  {/* Order Head */}
                  <div className="order-card-head">
                    <div className="order-id-group">
                      <span className="order-id-label">{t('orderNumber')}:</span>
                      <strong className="order-id-val">{order.id}</strong>
                      <button
                        onClick={() => copyText(order.id, order.id)}
                        className="btn-icon copy-small-btn"
                        title="Copy Order ID"
                      >
                        <Copy size={13} />
                      </button>
                      {copiedId === order.id && (
                        <span className="copied-pill">{language === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                      )}
                    </div>

                    <div className="order-meta-group">
                      <span className="order-date">{formatDate(order.createdAt, language)}</span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="order-card-body">
                    <div className="order-items-sublist">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="order-sub-item">
                          <img src={it.imageUrl} alt="" className="sub-item-img" />
                          <div className="sub-item-text">
                            <span className="sub-item-name">
                              {language === 'ar' ? (it.name_ar || it.name_en) : it.name_en}
                            </span>
                            <div className="sub-item-meta">
                              {it.variantName_en && (
                                <span className="variant-tag">
                                  {language === 'ar' ? (it.variantName_ar || it.variantName_en) : it.variantName_en}
                                </span>
                              )}
                              <span className="sub-item-qty">x{it.quantity}</span>
                            </div>
                          </div>
                          <span className="sub-item-price">
                            {formatPrice(it.price * it.quantity, language)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Digital Credentials / Delivery Output */}
                    {order.fulfillmentNotes && (
                      <div className="fulfillment-notes-card">
                        <div className="fulfillment-notes-head">
                          <ShieldCheck size={16} className="text-green" />
                          <span>{t('fulfillmentDetails')}</span>
                        </div>
                        <div className="fulfillment-code-row">
                          <code className="fulfillment-code-text">{order.fulfillmentNotes}</code>
                          <button
                            onClick={() => copyText(order.fulfillmentNotes, `${order.id}-cred`)}
                            className="btn btn-sm btn-secondary copy-cred-btn"
                          >
                            <Copy size={14} />
                            <span>{copiedId === `${order.id}-cred` ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ البيانات' : 'Copy')}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rejection / Cancellation Notice if applicable */}
                    {order.rejectionReason && order.status === 'Cancelled' && (
                      <div className="rejection-reason-notice">
                        <AlertCircle size={15} className="text-danger" />
                        <span>
                          {language === 'ar' ? 'ملاحظة الإلغاء: ' : 'Cancellation Note: '}
                          {order.rejectionReason}
                        </span>
                      </div>
                    )}

                    {/* Customer Payment Proof Screenshot link */}
                    {order.paymentProofUrl && (
                      <div className="account-proof-row">
                        <a
                          href={order.paymentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="account-proof-chip"
                          title="View submitted transfer screenshot"
                        >
                          <img src={order.paymentProofUrl} alt="Transfer proof" className="account-proof-thumb" />
                          <span>{language === 'ar' ? 'معاينة إشعار التحويل المرفق' : 'View Submitted Proof Screenshot'}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Order Card Footer */}
                  <div className="order-card-footer">
                    <div className="order-customer-hint">
                      <span>{language === 'ar' ? 'المستلم:' : 'Delivered to:'} {order.customerInfo?.email || order.customerInfo?.phone}</span>
                      {(order.status === 'Pending Verification' || order.status === 'Pending Payment' || order.status === 'Pending') && (
                        <a
                          href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(language === 'ar' ? `مرحباً! أود الاستفسار عن طلبي رقم #${order.id} بقيمة ${formatPrice(order.total, language)}.` : `Hello! Inquiring regarding my Order #${order.id} (${formatPrice(order.total, language)}).`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline btn-wa-confirm-order"
                        >
                          <MessageCircle size={14} />
                          <span>{language === 'ar' ? 'متابعة مع الدعم' : 'Contact Support'}</span>
                        </a>
                      )}
                    </div>
                    <div className="order-total-block">
                      <span className="total-label">{t('total')}:</span>
                      <span className="total-val">{formatPrice(order.total, language)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .account-page-root {
          padding-block: 36px 80px;
        }
        .profile-hero-card {
          padding: 28px 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .profile-avatar-box {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-purple) 0%, #4f2cdb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: 2px solid var(--border-active);
          box-shadow: 0 0 20px rgba(124, 92, 252, 0.4);
        }
        .profile-details {
          flex: 1;
        }
        .profile-name {
          font-size: 1.6rem;
          color: var(--text-white);
          margin-bottom: 4px;
        }
        .profile-email {
          font-size: 0.88rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 8px;
        }
        .profile-tags {
          display: flex;
          gap: 8px;
        }
        .orders-header {
          margin-bottom: 24px;
        }
        .orders-title {
          font-size: 1.8rem;
          color: var(--text-white);
          margin-bottom: 4px;
        }
        .orders-subtitle {
          color: var(--text-secondary);
          font-size: 0.92rem;
        }
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .order-history-card {
          padding: 24px;
        }
        .order-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 14px;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .order-id-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .order-id-label {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .order-id-val {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          color: var(--accent-purple);
        }
        .copy-small-btn {
          padding: 4px 8px;
          border-radius: 4px;
        }
        .copied-pill {
          font-size: 0.72rem;
          color: #10B981;
          font-weight: 600;
        }
        .order-meta-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .order-date {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .order-items-sublist {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }
        .order-sub-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sub-item-img {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          background: #0d0f1a;
          border: 1px solid var(--border-subtle);
        }
        .sub-item-text {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .sub-item-name {
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--text-white);
        }
        .sub-item-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.76rem;
          color: var(--text-muted);
        }
        .variant-tag {
          color: var(--accent-purple);
          background: rgba(124, 92, 252, 0.1);
          padding: 1px 6px;
          border-radius: 4px;
        }
        .sub-item-price {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-white);
        }
        .fulfillment-notes-card {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-sm);
          padding: 14px;
          margin-top: 14px;
        }
        .fulfillment-notes-head {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #10B981;
          margin-bottom: 8px;
        }
        .fulfillment-code-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .fulfillment-code-text {
          font-family: monospace;
          background: #090B13;
          padding: 8px 12px;
          border-radius: 4px;
          color: #F1F5F9;
          font-size: 0.85rem;
          word-break: break-all;
          flex: 1;
        }
        .order-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 14px;
          margin-top: 14px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .order-customer-hint {
          font-size: 0.82rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .rejection-reason-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #EF4444;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          margin-top: 10px;
        }
        .account-proof-row {
          margin-top: 10px;
          display: flex;
        }
        .account-proof-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 4px 10px;
          font-size: 0.78rem;
          color: var(--text-secondary);
          transition: all 0.2s;
          text-decoration: none;
        }
        .account-proof-chip:hover {
          background: rgba(124, 92, 252, 0.1);
          border-color: var(--accent-purple);
          color: var(--text-white);
        }
        .account-proof-thumb {
          width: 26px;
          height: 26px;
          object-fit: cover;
          border-radius: 4px;
        }
        .btn-wa-confirm-order {
          color: #25D366;
          border-color: rgba(37, 211, 102, 0.4);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          font-size: 0.78rem;
          background: rgba(37, 211, 102, 0.08);
          border-radius: var(--radius-sm);
        }
        .btn-wa-confirm-order:hover {
          background: rgba(37, 211, 102, 0.2);
          border-color: #25D366;
        }
        .order-total-block {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .total-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .total-val {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--accent-purple);
        }
        .empty-orders-card {
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .empty-icon {
          color: var(--text-muted);
        }
        .mt-12 { margin-top: 12px; }
        @media (max-width: 600px) {
          .account-page-root {
            padding-block: 20px 60px;
          }
          .profile-hero-card {
            padding: 18px 16px;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .profile-actions {
            width: 100%;
          }
          .profile-actions .btn {
            width: 100%;
          }
          .order-history-card {
            padding: 16px;
          }
          .order-card-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .order-meta-group {
            width: 100%;
            justify-content: space-between;
          }
          .order-card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .order-total-block {
            width: 100%;
            justify-content: space-between;
          }
          .fulfillment-code-row {
            flex-direction: column;
            align-items: stretch;
          }
          .copy-cred-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
