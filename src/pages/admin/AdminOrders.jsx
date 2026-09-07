import React, { useState, useEffect } from 'react';
import { orderService } from '../../config/firebase';
import { useLanguage } from '../../../src/context/LanguageContext';
import { formatPrice, formatDate } from '../../utils/formatters';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  Save,
  MessageCircle,
  ChevronDown,
  User,
  Mail,
  Phone
} from 'lucide-react';

export const AdminOrders = () => {
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Fulfillment Editing
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fulfillmentInput, setFulfillmentInput] = useState('');
  const [statusInput, setStatusInput] = useState('Pending');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenFulfillModal = (order) => {
    setSelectedOrder(order);
    setFulfillmentInput(order.fulfillmentNotes || '');
    setStatusInput(order.status || 'Pending');
  };

  const handleUpdateStatusQuick = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleSaveFulfillment = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSavingNotes(true);
    try {
      await orderService.updateStatus(selectedOrder.id, statusInput, fulfillmentInput);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error('Error saving fulfillment:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'All' && order.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const idMatch = (order.id || '').toLowerCase().includes(q);
      const nameMatch = (order.customerInfo?.name || '').toLowerCase().includes(q);
      const emailMatch = (order.customerInfo?.email || '').toLowerCase().includes(q);
      const phoneMatch = (order.customerInfo?.phone || '').toLowerCase().includes(q);
      return idMatch || nameMatch || emailMatch || phoneMatch;
    }
    return true;
  });

  return (
    <div className="admin-orders-root">
      {/* Top Header */}
      <div className="orders-top-header">
        <div>
          <h2 className="admin-page-title">{t('adminTabOrders')}</h2>
          <p className="admin-page-sub">
            {orders.length} {language === 'ar' ? 'إجمالي الطلبات الواردة' : 'total orders recorded'}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="orders-toolbar glass-card">
        <div className="orders-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'بحث برقم الطلب، البريد، الاسم، أو الهاتف...' : 'Search by Order ID, email, name, or phone...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="orders-search-input"
          />
        </div>

        <div className="status-filter-buttons">
          {['All', 'Pending Payment', 'Paid', 'Delivered', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`status-btn ${statusFilter === st ? 'active' : ''}`}
            >
              <span>
                {st === 'All'
                  ? (language === 'ar' ? 'الكل' : 'All')
                  : st === 'Pending Payment'
                  ? (language === 'ar' ? 'بانتظار الدفع' : 'Pending Payment')
                  : st}
              </span>
              <span className="count-pill">
                {st === 'All' ? orders.length : orders.filter(o => o.status === st || (st === 'Pending Payment' && o.status === 'Pending')).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-card glass-card">
        {loading ? (
          <div className="py-80 text-center">
            <div className="spinner" />
            <p>{language === 'ar' ? 'جاري استرجاع الطلبات...' : 'Loading orders...'}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-60 text-center text-secondary">
            <ShoppingBag size={40} className="text-muted mb-8" />
            <p>{language === 'ar' ? 'لا توجد طلبات تطابق الفلتر' : 'No orders found matching this filter.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('orderNumber')}</th>
                  <th>{t('adminCustomer')}</th>
                  <th>{t('adminItems')}</th>
                  <th>{t('total')}</th>
                  <th>{t('status')}</th>
                  <th>{language === 'ar' ? 'بيانات التسليم اليدوي' : 'Manual Credentials'}</th>
                  <th className="text-end">{t('adminActions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <strong className="order-id-highlight">{order.id}</strong>
                      <span className="order-time-sub">{formatDate(order.createdAt, language)}</span>
                    </td>
                    <td>
                      <div className="customer-info-cell">
                        <div className="customer-name-row">
                          <strong className="c-name">{order.customerInfo?.name || 'Customer'}</strong>
                          {order.customerInfo?.phone && (
                            <a
                              href={`https://wa.me/${order.customerInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customerInfo.name || ''}, PlayPass support regarding Order #${order.id}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="wa-customer-shortcut"
                              title="Message customer on WhatsApp"
                            >
                              <MessageCircle size={13} />
                            </a>
                          )}
                        </div>
                        <span className="c-meta"><Mail size={12} /> {order.customerInfo?.email}</span>
                        {order.customerInfo?.phone && (
                          <span className="c-meta"><Phone size={12} /> {order.customerInfo.phone}</span>
                        )}
                        {order.customerInfo?.notes && (
                          <span className="c-notes">Note: "{order.customerInfo.notes}"</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="order-items-cell">
                        {order.items?.map((it, i) => (
                          <div key={i} className="order-item-inline">
                            <span>{language === 'ar' ? (it.name_ar || it.name_en) : it.name_en}</span>
                            <span className="item-q">x{it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <strong className="order-total-highlight">{formatPrice(order.total, language)}</strong>
                    </td>
                    <td>
                      <select
                        value={order.status === 'Pending' ? 'Pending Payment' : order.status}
                        onChange={(e) => handleUpdateStatusQuick(order.id, e.target.value)}
                        className={`status-select-tag status-${(order.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <option value="Pending Payment">Pending Payment (بانتظار الدفع)</option>
                        <option value="Paid">Paid (تم تأكيد الدفع)</option>
                        <option value="Delivered">Delivered (تم التسليم يدوياً)</option>
                        <option value="Cancelled">Cancelled (ملغي)</option>
                      </select>
                    </td>
                    <td>
                      {order.fulfillmentNotes ? (
                        <code className="cred-preview-tag" title={order.fulfillmentNotes}>
                          {order.fulfillmentNotes.length > 28
                            ? `${order.fulfillmentNotes.slice(0, 28)}...`
                            : order.fulfillmentNotes}
                        </code>
                      ) : (
                        <span className="no-creds-hint">{language === 'ar' ? 'بانتظار التأكيد' : 'Awaiting confirmation'}</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenFulfillModal(order)}
                        className="btn btn-sm btn-outline fulfill-modal-trigger"
                      >
                        <Zap size={14} />
                        <span>{language === 'ar' ? 'تسليم يدوي' : 'Manual Delivery'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fulfillment & Credentials Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-glow">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  {language === 'ar' ? `تسليم الطلب رقم ${selectedOrder.id}` : `Fulfill Order #${selectedOrder.id}`}
                </h3>
                <span className="modal-sub">
                  {selectedOrder.customerInfo?.name} ({selectedOrder.customerInfo?.email})
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="modal-close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFulfillment} className="modal-form">
              <div className="form-group">
                <label className="form-label">{t('status')}</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="form-select"
                >
                  <option value="Pending">Pending (قيد الانتظار)</option>
                  <option value="Paid">Paid (تم تأكيد الدفع)</option>
                  <option value="Delivered">Delivered (تم التسليم للعميل)</option>
                  <option value="Cancelled">Cancelled (ملغي)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('adminEnterCredentials')}</label>
                <textarea
                  rows={4}
                  value={fulfillmentInput}
                  onChange={(e) => setFulfillmentInput(e.target.value)}
                  placeholder="e.g. Netflix Email: user99@stream.vip | Password: **** | PIN: 9281 | Guide link..."
                  className="form-textarea code-font"
                  required
                />
                <span className="form-hint">
                  {language === 'ar'
                    ? 'هذه البيانات ستظهر فوراً في حساب العميل وتحت خانة تفاصيل الطلب.'
                    : 'These details will appear immediately on the customer’s order receipt and account dashboard.'}
                </span>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-secondary"
                >
                  {t('adminCancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingNotes}
                  className="btn btn-primary"
                >
                  <Save size={16} />
                  <span>{savingNotes ? 'Saving...' : t('adminSaveNotes')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-orders-root {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .orders-top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .orders-toolbar {
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .orders-search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 280px;
        }
        .orders-search-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 10px 14px 10px 38px;
          color: var(--text-white);
          font-size: 0.88rem;
        }
        [dir="rtl"] .orders-search-input {
          padding: 10px 38px 10px 14px;
        }
        .status-filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .status-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
        }
        .status-btn:hover {
          color: var(--text-white);
          border-color: var(--border-active);
        }
        .status-btn.active {
          background: var(--primary-purple);
          border-color: var(--primary-purple);
          color: white;
        }
        .count-pill {
          font-size: 0.72rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 1px 6px;
          border-radius: 999px;
        }
        .orders-table-card {
          padding: 20px;
        }
        .order-id-highlight {
          color: var(--accent-purple);
          font-family: var(--font-heading);
          font-size: 1.05rem;
          display: block;
        }
        .order-time-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .customer-info-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .c-name {
          font-size: 0.92rem;
          color: var(--text-white);
        }
        .c-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .c-notes {
          font-size: 0.74rem;
          color: #FBBF24;
          font-style: italic;
        }
        .order-items-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .order-item-inline {
          font-size: 0.82rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .item-q {
          color: var(--accent-purple);
          font-weight: 700;
        }
        .order-total-highlight {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          color: var(--text-white);
        }
        .status-select-tag {
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 700;
          border: 1px solid transparent;
          cursor: pointer;
        }
        .status-pending {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          border-color: rgba(245, 158, 11, 0.3);
        }
        .status-paid {
          background: rgba(124, 92, 252, 0.15);
          color: var(--accent-purple);
          border-color: var(--border-active);
        }
        .status-delivered {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border-color: rgba(16, 185, 129, 0.3);
        }
        .status-cancelled {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border-color: rgba(239, 68, 68, 0.3);
        }
        .cred-preview-tag {
          font-family: monospace;
          background: #090B13;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.78rem;
          color: #10B981;
          display: inline-block;
        }
        .no-creds-hint {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .code-font {
          font-family: monospace;
          font-size: 0.9rem;
        }
        .form-hint {
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .modal-sub {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .mb-8 { margin-bottom: 8px; }
        .py-60 { padding-block: 60px; }
        @media (max-width: 640px) {
          .orders-toolbar {
            padding: 14px;
            gap: 12px;
          }
          .orders-search-box {
            min-width: 100%;
          }
          .status-filter-buttons {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
          }
          .status-btn {
            flex-shrink: 0;
            padding: 6px 10px;
            font-size: 0.78rem;
          }
          .orders-table-card {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
};
